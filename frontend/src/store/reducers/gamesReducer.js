import store from "..";
import { ACTION_TYPES } from "../constants";

const initialState = {
  games: {},
  activeGame: null,
};

const gamesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_TYPES.SET_GAMES: {
      let activeGame = state.activeGame;
      const userId = payload.user?._id;
      if (userId) {
        const game = Object.values(payload.games).find(
          ({ players }) => players[userId]
        );
        if (game) {
          activeGame = game.gameId;
        }
      }
      return { activeGame, games: payload.games };
    }
    case ACTION_TYPES.ADD_LOBBY: {
      let activeGame = state.activeGame;
      if (payload.game.players[payload.user?._id]) {
        activeGame = payload.game.gameId;
      }
      return {
        activeGame,
        games: { ...state.games, [payload.game.gameId]: payload.game },
      };
    }
    case ACTION_TYPES.ADD_PLAYER_TO_LOBBY: {
      const { joinedUser, gameId, user } = payload;

      let activeGame = state.activeGame;
      if (joinedUser._id === user?._id) {
        activeGame = gameId;
      }

      return {
        activeGame,
        games: {
          ...state.games,
          [gameId]: {
            ...state.games[gameId],
            players: { ...state.games[gameId].players, [joinedUser._id]: joinedUser },
          },
        },
      };
    }
    case ACTION_TYPES.REMOVE_PLAYER_FROM_LOBBY: {
      const { userId, gameId, user } = payload;

      let activeGame = state.activeGame;
      if (userId === user?._id) {
        activeGame = null;
      }

      const { players } = state.games[gameId];
      delete players[userId];
      return {
        activeGame,
        games: {
          ...state.games,
          [gameId]: { ...state.games[gameId], players: { ...players } },
        },
      };
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
