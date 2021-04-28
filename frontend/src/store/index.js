import { combineReducers, createStore } from 'redux';
import authReducer from './reducers/authReducer';

const store = createStore(
  combineReducers({
    auth: authReducer,
  })
);

export default store;