import { combineReducers, createStore } from "redux";
import authReducer from "./reducers/authReducer";
import TTTReducer from "./reducers/TTTReducer";

const store = createStore(
  combineReducers({
    auth: authReducer,
    tictactoe: TTTReducer,
  })
);

export default store;
