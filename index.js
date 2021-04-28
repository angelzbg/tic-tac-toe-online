const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

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

// -------------

app.use((req, _, next) => {
  const token = req.cookies.token || req.headers.token;
  if (!token) {
    next();
    return;
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      next(/*err*/);
      return;
    }

    req.user = await User.findOne({ login: decoded.login });
    req.token = token;
    next();
  });
});

// -------------

// -------------

app.use((err, _, res, _1) => {
  if (err) {
    console.log(err);
    res.status(200).json(respond(NETWORK_CODES_TYPES.ERROR, NETWORK_CODES.UNEXPECTED_ERROR));
  }
});

// -------------

// React browser router extra support
app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/frontend/build/index.html')));

mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    http.listen(SERVER_PORT, console.log('Server started'));
  });
