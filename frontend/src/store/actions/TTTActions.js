import { ACTION_TYPES } from '../constants';

export const TTT_setGames = (payload) => ({
  type: ACTION_TYPES.TTT_SET_GAMES,
  payload,
});

export const TTT_addLobby = (payload) => ({
  type: ACTION_TYPES.TTT_ADD_LOBBY,
  payload,
});

export const TTT_addPlayerToLobby = (payload) => ({
  type: ACTION_TYPES.TTT_ADD_PLAYER_TO_LOBBY,
  payload,
});

export const TTT_removePlayerFromlobby = (payload) => ({
  type: ACTION_TYPES.TTT_REMOVE_PLAYER_FROM_LOBBY,
  payload,
});

export const TTT_deleteGame = (payload) => ({
  type: ACTION_TYPES.TTT_DELETE_GAME,
  payload,
});

export const TTT_playerTurn = (payload) => ({
  type: ACTION_TYPES.TTT_PLAYER_TURN,
  payload,
});

export const TTT_gameFinished = (payload) => ({
  type: ACTION_TYPES.TTT_GAME_FINISHED,
  payload,
});

export const TTT_resetState = () => ({
  type: ACTION_TYPES.TTT_RESET_STATE,
});

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');
