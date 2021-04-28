import { ACTION_TYPES } from '../constants';

export const setUser = (payload) => ({
  type: ACTION_TYPES.SET_USER,
  payload,
});

export const setAuthLoading = (payload) => ({
  type: ACTION_TYPES.SET_AUTH_LOADING,
  payload,
});

export const setAuthState = (payload) => ({
  type: ACTION_TYPES.SET_AUTH_STATE,
  payload,
});
