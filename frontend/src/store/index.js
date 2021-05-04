import { combineReducers, createStore } from "redux";
import authReducer from "./reducers/authReducer";
import gamesReducer from "./reducers/gamesReducer";

const store = createStore(
  combineReducers({
    auth: authReducer,
    tictactoe: gamesReducer,
  })
);

export default store;
