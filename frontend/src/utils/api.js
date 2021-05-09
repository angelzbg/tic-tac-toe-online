import { batch } from 'react-redux';
import store from '../store';
import { setAuthLoading, setAuthLogged, setUser } from '../store/actions/authActions';
import { networkCall } from './utils';
import { io } from 'socket.io-client';
import {
  TTT_addLobby,
  TTT_addPlayerToLobby,
  TTT_deleteGame,
  TTT_gameFinished,
  TTT_playerTurn,
  TTT_removePlayerFromlobby,
  TTT_resetState,
  TTT_setGames,
  TTT_setGameStarted,
} from '../store/actions/TTTActions';

export const getCurrentUser = () => store.getState().auth.user;

const socket = io('/');

const socketInfo = {
  disconnected: false,
  subscription: null,
};

// Tic Tac Toe [ START ]
export const TTT_getLeaveToggle = () => {
  return JSON.parse(localStorage.getItem(`3xT-save-toggle-${getCurrentUser()._id}`) ?? 'false');
};
export const TTT_setLeaveToggle = (toggle = false) => {
  return localStorage.setItem(`3xT-save-toggle-${getCurrentUser()._id}`, JSON.stringify(toggle));
};
export const TTT_createGame = () => socket.emit('3xT-create-lobby');
export const TTT_joinLobby = (gameId) => socket.emit('3xT-join-lobby', { gameId });
export const TTT_leaveLobby = (gameId) => socket.emit('3xT-leave-lobby', { gameId });
export const TTT_makeTurn = (gameId, i, j) => socket.emit('3xT-make-turn', { gameId, i, j });
export const TTT_startGAme = (gameId) => socket.emit('3xT-start-game', gameId);
export const TTT_subscribe = () => {
  socket.on('3xT-received-games', (payload) => {
    store.dispatch(TTT_setGames({ games: payload, user: getCurrentUser() }));
  });

  socket.on('3xT-created-lobby', (payload) => {
    store.dispatch(TTT_addLobby({ game: payload, user: getCurrentUser() }));
  });

  socket.on('3xT-player-joined', (payload) => {
    store.dispatch(TTT_addPlayerToLobby({ ...payload, user: getCurrentUser() }));
  });

  socket.on('3xT-player-leave', (payload) => {
    store.dispatch(TTT_removePlayerFromlobby({ ...payload, user: getCurrentUser() }));
  });

  socket.on('3xT-game-deleted', (payload) => {
    store.dispatch(TTT_deleteGame(payload));
  });

  socket.on('3xT-player-turn', (payload) => {
    store.dispatch(TTT_playerTurn(payload));
  });

  socket.on('3xT-game-finished', (payload) => {
    store.dispatch(TTT_gameFinished(payload));
  });

  socket.on('3xT-game-started', (payload) => {
    store.dispatch(TTT_setGameStarted(payload));
  });

  socket.emit('3xT-subscribe');
  socketInfo.subscription = '3xT';
};
export const TTT_unsubscribe = () => {
  socket.off('3xT-received-games');
  socket.off('3xT-created-lobby');
  socket.off('3xT-player-joined');
  socket.off('3xT-player-leave');
  socket.off('3xT-game-deleted');
  socket.off('3xT-player-turn');
  socket.off('3xT-game-finished');
  store.dispatch(TTT_resetState());
  socketInfo.subscription = null;
};
// Tic Tac Toe [  END  ]

export const subscriptions = {
  '3xT': {
    subscribe: TTT_subscribe,
    unsubscribe: TTT_unsubscribe,
  },
};

socket.on('connect', () => {
  if (socketInfo.disconnected) {
    socketInfo.disconnected = false;
    const user = getCurrentUser();
    if (user) {
      socket.emit('identify', { username: user.username, socketId: user.socketId });
    }

    if (socketInfo.subscription) {
      subscriptions[socketInfo.subscription].subscribe();
    }
  }
});

socket.on('disconnect', () => {
  socketInfo.disconnected = true;
  if (socketInfo.subscription) {
    const subscription = socketInfo.subscription;
    subscriptions[subscription].unsubscribe();
    socketInfo.subscription = subscription;
  }
});

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
  socket.emit('avatar-change', avatar);
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
