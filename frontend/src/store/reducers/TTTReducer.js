import { ACTION_TYPES } from '../constants';

const initialState = {
  games: {},
  activeGame: null,
};

const gamesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_TYPES.TTT_SET_GAMES: {
      let activeGame = state.activeGame;
      const userId = payload.user?._id;
      if (userId) {
        const game = Object.values(payload.games).find(({ players }) => players[userId]);
        if (game) {
          activeGame = game.gameId;
        }
      }

      return { activeGame, games: payload.games };
    }
    case ACTION_TYPES.TTT_ADD_LOBBY: {
      const { game, user } = payload;
      let activeGame = state.activeGame;
      if (game.players[user?._id]) {
        activeGame = game.gameId;
      }

      return {
        activeGame,
        games: { ...state.games, [game.gameId]: game },
      };
    }
    case ACTION_TYPES.TTT_ADD_PLAYER_TO_LOBBY: {
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
    case ACTION_TYPES.TTT_REMOVE_PLAYER_FROM_LOBBY: {
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
    case ACTION_TYPES.TTT_PLAYER_TURN: {
      const { gameId, fields, turn, turnDate } = payload;
      const { activeGame, games } = state;
      return {
        activeGame: activeGame,
        games: { ...games, [gameId]: { ...games[gameId], fields, turn, turnDate } },
      };
    }
    case ACTION_TYPES.TTT_GAME_FINISHED: {
      const { activeGame, games } = state;
      return {
        activeGame,
        games: { ...games, [payload.gameId]: payload },
      };
    }
    case ACTION_TYPES.TTT_DELETE_GAME: {
      let activeGame = state.activeGame;
      if (activeGame === payload) {
        activeGame = null;
      }

      const games = { ...state.games };
      delete games[payload];
      return { activeGame, games };
    }
    case ACTION_TYPES.TTT_RESET_STATE:
      return { games: {}, activeGame: null };
    case ACTION_TYPES.TTT_START_GAME: {
      const { gameId, status, turnDate } = payload;
      return {
        activeGame: state.activeGame,
        games: { ...state.games, [gameId]: { ...state.games[gameId], status, turnDate} },
      };
    }
    default:
      return state;
  }
};

export default gamesReducer;
