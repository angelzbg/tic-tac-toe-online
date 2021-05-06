import { batch } from 'react-redux';
import store from '../store';
import { setAuthLoading, setAuthLogged, setUser } from '../store/actions/authActions';
import { networkCall } from './utils';
import { io } from 'socket.io-client';
import {
  TTT_addLobby,
  TTT_addPlayerToLobby,
  TTT_deleteGame,
  TTT_removePlayerFromlobby,
  TTT_resetState,
  TTT_setGames,
} from '../store/actions/TTTActions';

const socket = io('/');

// Tic Tac Toe [ START ]
export const TTT_createGame = () => socket.emit('3xT-create-lobby');
export const TTT_joinLobby = (gameId) => socket.emit('3xT-join-lobby', { gameId });
export const TTT_leaveLobby = (gameId) => socket.emit('3xT-leave-lobby', { gameId });
export const TTT_subscribe = () => {
  socket.on('3xT-received-games', (payload) => {
    store.dispatch(TTT_setGames({ games: payload, user: store.getState().auth.user }));
  });

  socket.on('3xT-created-lobby', (payload) => {
    store.dispatch(TTT_addLobby({ game: payload, user: store.getState().auth.user }));
  });

  socket.on('3xT-player-joined', (payload) => {
    store.dispatch(TTT_addPlayerToLobby({ ...payload, user: store.getState().auth.user }));
  });

  socket.on('3xT-player-leave', (payload) => {
    store.dispatch(TTT_removePlayerFromlobby({ ...payload, user: store.getState().auth.user }));
  });

  socket.on('3xT-game-deleted', (payload) => {
    store.dispatch(TTT_deleteGame(payload));
  });

  socket.emit('3xT-subscribe');
};
export const TTT_unsubscribe = () => {
  socket.off('3xT-received-games');
  socket.off('3xT-created-lobby');
  socket.off('3xT-player-joined');
  socket.off('3xT-player-leave');
  socket.off('3xT-game-deleted');
  store.dispatch(TTT_resetState());
};
// Tic Tac Toe [  END  ]

export const logOut = async () => {
  const response = await networkCall({ path: '/api/logout', method: 'GET' });
  if (response.success) {
    batch(() => {
      store.dispatch(setUser(null));
      store.dispatch(setAuthLogged(false));
    });
  }

  return response;
};

export const updateUserAvatar = (avatar = 0) => {
  networkCall({ path: '/api/update-user', method: 'POST', body: { avatar } });
};

export const getUserInfo = async () => {
  const response = await networkCall({ path: '/api/user-info', method: 'GET' });
  if (response.success) {
    batch(() => {
      store.dispatch(setUser(response.success));
      store.dispatch(setAuthLogged(true));
      store.dispatch(setAuthLoading(false));
      socket.emit('identify', { username: response.success.username, socketId: response.success.socketId });
    });
  } else {
    store.dispatch(setAuthLoading(false));
  }
};

export const register = async (body) => {
  store.dispatch(setAuthLoading(true));
  const response = await networkCall({
    path: '/api/register',
    method: 'POST',
    body,
  });

  if (response.success) {
    getUserInfo();
  } else {
    store.dispatch(setAuthLoading(false));
  }

  return response;
};

export const login = async (body) => {
  store.dispatch(setAuthLoading(true));
  const response = await networkCall({ path: '/api/login', method: 'POST', body });

  if (response.success) {
    getUserInfo();
  } else {
    store.dispatch(setAuthLoading(false));
  }

  return response;
};
