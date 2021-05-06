const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const User = require('./models/User');

const { SERVER_PORT, MONGO_CONNECTION_STRING, SECRET } = require('./utils/config');
const { NETWORK_CODES, NETWORK_CODES_TYPES, respond } = require('./utils/constants');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(cors());

const timeouts = {};
const tictactoe = {};

// ------------- Middlewares [ START ]

app.use((req, _, next) => {
  const token = req.cookies.token || req.headers.token;
  if (!token) {
    next();
    return;
  }

  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      next(/*err*/);
      return;
    }

    req.user = await User.findOne({ username: decoded.username });
    req.token = token;
    next();
  });
});

// ------------- Middlewares [  END  ]

// ------------- Services [ START ]

// Auth services ------------- [ START ]
const sign = (res, username) => {
  const token = jwt.sign({ username }, SECRET /*, { expiresIn: '1h' }*/);
  res.cookie('token', token, { httpOnly: true, ...(process.env.SECRET ? { secure: true } : {}) });
  res.status(200).json(respond(NETWORK_CODES_TYPES.SUCCESS, { token }));
};

const validateRegisterData = ({ username, password, avatar = 0 } = {}) => {
  if (typeof username !== 'string' || username.length < 3 || username.length > 16) {
    return NETWORK_CODES.INVALID_USERNAME;
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 30) {
    return NETWORK_CODES.INVALID_PASSWORD;
  }

  if (typeof avatar !== 'number' || avatar < 0) {
    return NETWORK_CODES.INVALID_AVATAR;
  }
};

app.post('/api/register', async (req, res) => {
  const validationError = validateRegisterData(req.body);
  if (validationError) {
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, validationError));
    return;
  }

  let { username, password, avatar } = req.body;

  const found = await User.findOne({ username });
  if (found) {
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.USERNAME_ALREADY_TAKEN));
    return;
  }

  const user = new User({
    username,
    password,
    avatar: parseInt(avatar),
    created: new Date().getTime(),
    socketId: uniqid() + uniqid() + uniqid(),
  });

  user.save((err) => {
    if (err) {
      res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
      return;
    }

    sign(res, username);
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
    return;
  }

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
      return;
    }

    if (!user) {
      res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.WRONG_CREDENTIALS));
      return;
    }

    user.isCorrectPassword(password, (err, same) => {
      if (err) {
        res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
        return;
      }

      if (!same) {
        res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.WRONG_CREDENTIALS));
        return;
      }

      sign(res, username);
    });
  });
});

app.get('/api/logout', (_, res) => {
  res.clearCookie('token');
  res.status(200).json(respond(NETWORK_CODES_TYPES.SUCCESS, NETWORK_CODES.LOGOUT_SUCCESSFUL));
});

app.get('/api/user-info', (req, res) => {
  if (req.user) {
    const { _id, username, avatar, created, wins, losses, rate, socketId } = req.user;
    res
      .status(200)
      .json(respond(NETWORK_CODES_TYPES.SUCCESS, { _id, username, avatar, created, wins, losses, rate, socketId }));
    return;
  }

  res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.GET_USER_INFO_FAIL));
});

app.post('/api/update-user', async (req, res) => {
  if (!req.user) {
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.INVALID_PERMISSIONS));
    return;
  }

  let { avatar } = req.body;

  if (avatar) {
    if (typeof avatar !== 'number' || avatar < 0) {
      res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.INVALID_AVATAR));
      return;
    }

    avatar = parseInt(avatar);

    await User.findByIdAndUpdate(req.user._id, { avatar });
    res.status(200).json(respond(NETWORK_CODES_TYPES.SUCCESS, { avatar }));
    return;
  }

  res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
  return;
});
// Auth services ------------- [  END  ]

// Ranking services ------------- [ START ]
app.post('/api/ranking', async (req, res) => {
  let { skip } = req.body;
  if (typeof skip !== 'number' || skip < 0) {
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.INVALID_SKIP_PARAM));
    return;
  }

  skip = parseInt(skip);
  const selected = ['_id', 'username', 'avatar', 'created', 'wins', 'losses', 'rate'];
  const result = await User.find({}, selected, { skip, sort: { rate: -1, wins: -1 }, limit: 25 });

  res.status(200).json(respond(NETWORK_CODES_TYPES.SUCCESS, result || []));
});
// Ranking services ------------- [  END  ]

// ------------- Services [  END  ]

// ------------- Global Error Handler [ START ]

app.use((err, _, res, _1) => {
  if (err) {
    console.log(err);
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
  }
});

// ------------- Global Error Handler [  END  ]

// ------------- React browser router extra support [ START ]

app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/frontend/build/index.html')));

// ------------- React browser router extra support [  END  ]

const identifySocket = async (identification, { username, socketId }) => {
  const foundUser = await User.findOne({ username, socketId });
  if (foundUser) {
    identification.user = foundUser;
    identification.user._id = user._id.toString();
  }
};

mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    io.on('connection', (socket) => {
      const identification = { user: null };

      socket.on('identify', (data) => identifySocket(identification, data));

      socket.on('3xT-subscribe', () => {
        socket.emit('3xT-received-games', tictactoe);

        socket.on('3xT-create-lobby', () => {
          const { user } = identification;
          if (!user) return;

          for (let game of Object.values(tictactoe)) {
            if (user._id in game.players) {
              return;
            }
          }

          const gameId = uniqid();
          tictactoe[gameId] = {
            gameId,
            status: 'lobby',
            winner: null,
            loser: null,
            turn: user._id,
            created: new Date().getTime(),
            players: {
              [user._id]: {
                _id: user._id,
                username: user.username,
                rate: user.rate,
                avatar: user.avatar,
                symbol: 'X',
              },
            },
            fields: [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          };

          io.emit('3xT-created-lobby', tictactoe[gameId]);

          timeouts[gameId] = setTimeout(() => {
            delete tictactoe[gameId];
            io.emit('3xT-game-deleted', gameId);
            delete timeouts[gameId];
          }, 5 * 60000);
        });

        socket.on('3xT-join-lobby', ({ gameId }) => {
          const { user } = identification;
          if (!user) return;

          for (let game of Object.values(tictactoe)) {
            if (user._id in game.players) {
              return;
            }
          }

          const game = tictactoe[gameId];
          if (!game || game.status !== 'lobby' || Object.keys(game.players).length >= 2) {
            return;
          }

          tictactoe[gameId].players[user._id] = {
            _id: user._id,
            username: user.username,
            rate: user.rate,
            avatar: user.avatar,
            symbol: 'O',
          };

          io.emit('3xT-player-joined', { joinedUser: tictactoe[gameId].players[user._id], gameId });
        });

        socket.on('3xT-leave-lobby', ({ gameId }) => {
          const { user } = identification;
          if (!user) return;

          let game = tictactoe[gameId];
          if (!game || !game.players[user._id] || game.status === 'progress') {
            return;
          }

          if (game.players[user._id].symbol === 'X' && game.status === 'lobby') {
            delete tictactoe[gameId];
            io.emit('3xT-game-deleted', gameId);
            clearTimeout(timeouts[gameId]);
            delete timeouts[gameId];
            return;
          }

          delete tictactoe[gameId].players[user._id];
          io.emit('3xT-player-leave', { userId: user._id, gameId });
        });

        // 'start-game'
        // checks if game exists, if user is X, if players are 2
      });
    });

    http.listen(SERVER_PORT, console.log('Server started'));
  });
