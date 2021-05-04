import { ACTION_TYPES } from '../constants';

export const setGames = (payload) => ({
  type: ACTION_TYPES.SET_GAMES,
  payload,
});

export const addLobby = (payload) => ({
  type: ACTION_TYPES.ADD_LOBBY,
  payload,
});

export const addPlayerToLobby = (payload) => ({
  type: ACTION_TYPES.ADD_PLAYER_TO_LOBBY,
  payload,
});

export const removePlayerFromlobby = (payload) => ({
  type: ACTION_TYPES.REMOVE_PLAYER_FROM_LOBBY,
  payload,
});

export const deleteGame = (payload) => ({
  type: ACTION_TYPES.DELETE_GAME,
  payload,
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
