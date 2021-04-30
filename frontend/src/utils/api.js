import { batch } from 'react-redux';
import store from '../store';
import { setAuthLogged, setUser } from '../store/actions/authActions';
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
  //networkCall({ path: '/api/update-user', method: 'POST', body: { avatar } });
};
