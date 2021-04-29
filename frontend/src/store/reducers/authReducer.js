import { ACTION_TYPES } from '../constants';

const initialState = {
  isAuthLoading: true,
  isLogged: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_AUTH_LOADING:
      return { ...state, isAuthLoading: action.payload };
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    case ACTION_TYPES.SET_AUTH_LOGGED:
      return { ...state, isLogged: action.payload };
    default:
      return state;
  }
};

export default authReducer;
