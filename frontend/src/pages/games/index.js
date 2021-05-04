import GameCard from './gamecard';
import './styles/style.css';
import { useSelector } from 'react-redux';
import { createGame } from '../../utils/api';
import ActiveGame from './activegame';
import { useHistory } from 'react-router';

const ActiveGames = () => {
  const history = useHistory();
  const { tictactoe, auth } = useSelector((store) => store);
  const game = auth.user ? tictactoe.games[tictactoe.activeGame] : null;
  const canCreate = !game || !!game.winner;

  return (
    <>
      {game && <ActiveGame {...{ game, auth }} />}
      <div className="container scroll-h">
        {canCreate && (
          <button className="create-game" onClick={auth.user ? createGame() : history.push('/login')}>
            Create Game
          </button>
        )}
        {Object.values(tictactoe.games).map((game) => {
          console.log(game);
          return <div key={game.gameId} className="game-card"></div>;
        })}
      </div>
    </>
  );
};

export default ActiveGames;
