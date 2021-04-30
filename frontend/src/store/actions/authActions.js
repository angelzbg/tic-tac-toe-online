import { ACTION_TYPES } from '../constants';

export const setUser = (payload) => ({
  type: ACTION_TYPES.SET_USER,
  payload,
});

export const setUserAvatar = (payload) => ({
  type: ACTION_TYPES.SET_USER_AVATAR,
  payload,
});

export const setAuthLoading = (payload) => ({
  type: ACTION_TYPES.SET_AUTH_LOADING,
  payload,
});

export const setAuthLogged = (payload) => ({
  type: ACTION_TYPES.SET_AUTH_LOGGED,
  payload,
});
