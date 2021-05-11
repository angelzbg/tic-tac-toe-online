const uniqid = require('uniqid');
const { ioEmit } = require('./');

const gameTimeouts = {};
const games = {};

const check3xTFields = (fields = []) => {
  for (let i = 0; i < 3; i++) {
    const rowCheck = [...new Set(fields[i])];
    if (rowCheck.length === 1 && rowCheck[0] !== 0) {
      return { winner: rowCheck[0], path: i };
    }

    const colCheck = [...new Set(fields.reduce((col, row) => [...col, row[i]], []))];
    if (colCheck.length === 1 && colCheck[0] !== 0) {
      return { winner: colCheck[0], path: 3 + i };
    }
  }

  const mainDiag = [...new Set([fields[0][0], fields[1][1], fields[2][2]])];
  if (mainDiag.length === 1 && mainDiag[0] !== 0) {
    return { winner: mainDiag[0], path: 6 };
  }

  const secDiag = [...new Set([fields[0][2], fields[1][1], fields[2][0]])];
  if (secDiag.length === 1 && secDiag[0] !== 0) {
    return { winner: secDiag[0], path: 7 };
  }
};

const createLobby = (socket) => () => {
  const user = socket.data?.parent?.user;
  if (!user) return;

  for (let game of Object.values(games)) {
    if (user._id in game.players) {
      return;
    }
  }

  const gameId = uniqid();
  games[gameId] = {
    gameId,
    status: 'lobby',
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

  ioEmit('3xT-created-lobby', games[gameId]);

  gameTimeouts[gameId] = setTimeout(() => {
    delete games[gameId];
    ioEmit('3xT-game-deleted', gameId);
    delete gameTimeouts[gameId];
  }, 10 * 60000);
};

const joinLobby = (socket) => ({ gameId } = {}) => {
  if (!gameId) return;
  const user = socket.data?.parent?.user;
  if (!user) return;

  for (let game of Object.values(games)) {
    if (user._id in game.players) {
      return;
    }
  }

  const game = games[gameId];
  if (!game || game.status !== 'lobby' || Object.keys(game.players).length >= 2) {
    return;
  }

  games[gameId].players[user._id] = {
    _id: user._id,
    username: user.username,
    rate: user.rate,
    avatar: user.avatar,
    symbol: 'O',
  };

  ioEmit('3xT-player-joined', { joinedUser: games[gameId].players[user._id], gameId });
};

leaveLobby = (socket) => ({ gameId } = {}) => {
  if (!gameId) return;
  const user = socket.data?.parent?.user;
  if (!user) return;

  let game = games[gameId];
  if (!game || !game.players[user._id] || game.status === 'progress') {
    return;
  }

  if (game.players[user._id].symbol === 'X' && game.status === 'lobby') {
    delete games[gameId];
    ioEmit('3xT-game-deleted', gameId);
    clearTimeout(gameTimeouts[gameId]);
    delete gameTimeouts[gameId];
    return;
  }

  delete games[gameId].players[user._id];
  ioEmit('3xT-player-leave', { userId: user._id, gameId });
};

startGame = (socket) => (gameId) => {
  if (!gameId) return;
  const user = socket.data?.parent?.user;
  if (!user) return;
  const game = games[gameId];
  if (!game) return;
  if (!game.players[user._id]) return;
  if (game.players[user._id].symbol !== 'X') return;
  if (game.status !== 'lobby') return;
  if (Object.keys(game.players).length !== 2) return;
  clearTimeout(gameTimeouts[gameId]);
  game.status = 'progress';
  game.turnDate = new Date().getTime() + 20000;
  const OPlayerId = Object.values(game.players).find((p) => p._id !== user._id)._id;
  ioEmit('3xT-game-started', { gameId, status: game.status, turnDate: game.turnDate });
  gameTimeouts[gameId] = setTimeout(() => {
    game.status = 'finished';
    game.playersStatistics = { ...game.players };
    game.winnerId = OPlayerId;
    ioEmit('3xT-game-finished', game);

    gameTimeouts[gameId] = setTimeout(() => {
      ioEmit('3xT-game-deleted', gameId);
      delete games[gameId];
      delete gameTimeouts[gameId];
    }, 60000);
  }, 20000);
};

const makeTurn = (socket) => ({ gameId, i, j } = {}) => {
  if (!gameId) return;
  const user = socket.data?.parent?.user;
  if (!user) return;
  const game = games[gameId];
  if (!game) return;
  if (game.status !== 'progress') return;
  if (game.turn !== user._id) return;
  if (game.fields[i][j] !== 0) return;
  clearTimeout(gameTimeouts[gameId]);
  game.fields[i][j] = game.players[user._id].symbol;
  const result = check3xTFields(game.fields);
  if (result) {
    game.status = 'finished';
    game.playersStatistics = { ...game.players };
    game.winnerId = user._id;
    game.path = result.path;
    ioEmit('3xT-game-finished', game);

    gameTimeouts[gameId] = setTimeout(() => {
      ioEmit('3xT-game-deleted', gameId);
      delete games[gameId];
      delete gameTimeouts[gameId];
    }, 60000);
    return;
  }

  if (!game.fields.reduce((acc, row) => [...acc, ...row.filter((el) => el === 0)], []).length) {
    game.status = 'finished';
    game.playersStatistics = { ...game.players };
    ioEmit('3xT-game-finished', game);
    gameTimeouts[gameId] = setTimeout(() => {
      ioEmit('3xT-game-deleted', gameId);
      delete games[gameId];
      delete gameTimeouts[gameId];
    }, 60000);
    return;
  }

  game.turn = Object.values(game.players).find((p) => p._id !== user._id)._id;
  game.turnDate = new Date().getTime() + 20000;
  ioEmit('3xT-player-turn', { gameId, fields: game.fields, turn: game.turn, turnDate: game.turnDate });
  gameTimeouts[gameId] = setTimeout(() => {
    game.status = 'finished';
    game.playersStatistics = { ...game.players };
    game.winnerId = user._id;
    ioEmit('3xT-game-finished', game);

    gameTimeouts[gameId] = setTimeout(() => {
      ioEmit('3xT-game-deleted', gameId);
      delete games[gameId];
      delete gameTimeouts[gameId];
    }, 60000);
  }, 20000);
};

const TTT_attachMainListener = (socket) => {
  socket.on(
    '3xT-subscribe',
    (() => {
      const functions = [
        () => socket.emit('3xT-received-games', games),
        () => {
          socket.on('3xT-create-lobby', createLobby(socket));
          socket.on('3xT-join-lobby', joinLobby(socket));
          socket.on('3xT-leave-lobby', leaveLobby(socket));
          socket.on('3xT-start-game', startGame(socket));
          socket.on('3xT-make-turn', makeTurn(socket));
          functions.length = 1;
        },
      ];
      return () => functions.forEach((fn) => fn());
    })()
  );
};

module.exports = TTT_attachMainListener;
