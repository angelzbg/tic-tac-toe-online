import store from '..';
import { ACTION_TYPES } from '../constants';

const initialState = {
  games: {},
  activeGame: null,
};

const gamesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_TYPES.SET_GAMES:
      return { activeGame: state.activeGame, games: payload };
    case ACTION_TYPES.SET_ACTIVE_GAME:
      return { games: state.games, activeGame: payload };
    case ACTION_TYPES.ADD_LOBBY: {
      let activeGame = state.activeGame;
      if (payload.players[store.auth?.user?._id]) {
        activeGame = payload.gameId;
      }
      return { activeGame, games: { ...state.games, [payload.gameId]: payload } };
    }
    case ACTION_TYPES.ADD_PLAYER_TO_LOBBY: {
      const { user, gameId } = payload;

      let activeGame = state.activeGame;
      if (user._id === store.auth?.user?._id) {
        activeGame = gameId;
      }

      return {
        activeGame,
        games: {
          ...state.games,
          [gameId]: { ...state.games[gameId], players: { ...state.games[gameId].players, [user._id]: user } },
        },
      };
    }
    case ACTION_TYPES.REMOVE_PLAYER_FROM_LOBBY: {
      const { userId, gameId } = payload;

      let activeGame = state.activeGame;
      if (userId === store.auth?.user?._id) {
        activeGame = null;
      }

      const { players } = state.games[gameId];
      delete players[userId];
      return { activeGame, games: { ...state.games, [gameId]: { ...state.games[gameId], players: { ...players } } } };
    }
    case ACTION_TYPES.DELETE_GAME: {
      let activeGame = state.activeGame;
      if (activeGame === payload) {
        activeGame = null;
      }

      const games = { ...state.games };
      delete games[payload];
      return { activeGame, games };
    }
    default:
      return state;
  }
};

export default gamesReducer;

// ADD_LOBBY: 'ADD_LOBBY',
// ADD_PLAYER_TO_LOBBY: 'ADD_PLAYER_TO_LOBBY',
// REMOVE_PLAYER_FROM_LOBBY: 'REMOVE_PLAYER_FROM_LOBBY',
