import GameCard from './gamecard';
import './styles/style.css';
import { useSelector } from 'react-redux';
import { createGame } from '../../utils/api';
import ActiveGame from './activegame';
import { useHistory } from 'react-router';
import {avatars} from "../../utils/constants";

const ActiveGames = () => {
  const history = useHistory();
  const { tictactoe, auth } = useSelector((store) => store);
  const game = auth.user ? tictactoe.games[tictactoe.activeGame] : null;
  const canCreate = !game || !!game.winner;

  return (
    <>
      {/*{game && <ActiveGame {...{ game, auth }} />}*/}
      <div className="container scroll-h">
        {canCreate && (
          <button className="create-game" onClick={() => auth.user ? createGame() : history.push('/login')}>
            Create Game
          </button>
        )}
        {Object.values(tictactoe.games).map((game) => {
          console.log(Object.values(game.players)[0]);
          const player1 = Object.values(game.players)[0]
          return (
              <div key={game.gameId} className="game-card">
                  <div className="lobby-player">
                      <img className="lobby-avatar" src={avatars[player1.avatar]} alt=""/>
                      <p className="lobby-username" >{player1.username}</p>
                      <p className="lobby-rate">Rate: {player1.rate}%</p>
                      <p className="lobby-symbol">Symbol: {player1.symbol}</p>
                  </div>
                  <div style={{textAlign: 'center'}} className="board">
                      BOARD
                  </div>
                  <div className="lobby-player">
                      <img className="lobby-avatar" src={avatars[player1.avatar]} alt=""/>
                      <p className="lobby-username" >{player1.username}</p>
                      <p className="lobby-rate">Rate: {player1.rate}%</p>
                      <p className="lobby-symbol">Symbol: {player1.symbol}</p>
                  </div>
              </div>
          )
        })}
      </div>
    </>
  );
};

export default ActiveGames;
