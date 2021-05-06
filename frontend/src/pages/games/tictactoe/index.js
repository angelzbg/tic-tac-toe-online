import GameCard from './gamecard';
import './styles/style.css';
import { useSelector } from 'react-redux';
import ActiveGame from './activegame';
import { useHistory } from 'react-router';
import { avatars } from '../../../utils/constants';
import { TTT_createGame, TTT_joinLobby, TTT_subscribe, TTT_unsubscribe } from '../../../utils/api';
import { useEffect } from 'react';

const TicTacToeGames = () => {
  const history = useHistory();
  const { tictactoe, auth } = useSelector((store) => store);
  const activeGame = auth.user ? tictactoe.games[tictactoe.activeGame] : null;
  const canCreate = !activeGame || !!activeGame.winner;
  const games = Object.values(tictactoe.games).sort((a, b) => b.created - a.created);

  useEffect(() => {
    TTT_subscribe();
    return () => {
      TTT_unsubscribe();
    };
  }, []);

  console.log(activeGame);
  return (
    <>
      {activeGame && <ActiveGame {...{ game: activeGame, auth }} />}
      <div className="container scroll-h">
        {canCreate && (
          <button className="create-game" onClick={() => (auth.user ? TTT_createGame() : history.push('/login'))}>
            Create Game
          </button>
        )}
        {games.map((game) => {
          return (
            <div key={game.gameId} className="game-card">
              <div className="game-players">
                {Object.entries(game.players).map(([playerId, player]) => (
                  <div key={playerId} className="game-player">
                    <img className="game-avatar" src={avatars[player.avatar]} alt="" />
                    <div className="game-player-info">
                      <p className="game-username">
                        [{player.symbol}] {player.username}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="board">
                {game.fields.map((row, i) => {
                  return row.map((field, j) => {
                    const isEmpty = field === 0;
                    return (
                      <div className="board-field" key={`${i}-${j}`}>
                        {!isEmpty && field}
                      </div>
                    );
                  });
                })}
              </div>
              <div className="game-controllers">
                {!activeGame && Object.keys(game.players).length < 2 && (
                  <button
                    className="join-button"
                    onClick={() => (auth.user ? TTT_joinLobby(game.gameId) : history.push('/login'))}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TicTacToeGames;
