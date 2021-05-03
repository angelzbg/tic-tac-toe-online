import { batch } from 'react-redux';
import store from '../store';
import { setAuthLoading, setAuthLogged, setUser } from '../store/actions/authActions';
import { networkCall } from './utils';

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
