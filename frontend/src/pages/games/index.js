import GameCard from './gamecard';
import './styles/style.css';
import {useSelector} from "react-redux";
import {createGame} from "../../utils/api";

const ActiveGames = () => {
    const {tictactoe, auth} = useSelector((store) => store);
  return (
    <div className="container scroll-h">
        <button className="create-game" onClick={createGame}>
            Create Game
        </button>
        {Object.values(tictactoe.games).map((game) => {
            console.log(game);
            return <div key={game.gameId} className="game-card"></div>
        })}
    </div>
  );
};

export default ActiveGames;
