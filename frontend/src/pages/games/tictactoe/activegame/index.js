import { SyncIcon } from '@primer/octicons-react';
import ReactMomentCountDown from 'react-moment-countdown';
import { TTT_leaveLobby } from '../../../../utils/api';
import { avatars } from '../../../../utils/constants';
import { useResizeDetector } from 'react-resize-detector';
import { useEffect } from 'react';

const ActiveGame = ({ game, auth, setActiveGameHeight }) => {
  const { height: activeGameHeight, ref: activeGameRef } = useResizeDetector();

  useEffect(() => {
    setActiveGameHeight(activeGameHeight);
  }, [activeGameHeight]);

  return (
    <div key={game.gameId} className="active-game-card" ref={activeGameRef}>
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
        {game.status === 'lobby' &&
          Object.keys(game.players).length > 1 &&
          Object.values(game.players).find(({ username }) => username === auth.user.username).symbol === 'X' && (
            <button className="start-button">Start</button>
          )}
        {game.status !== 'progress' && (
          <button className="leave-button" onClick={() => TTT_leaveLobby(game.gameId)}>
            Leave
          </button>
        )}
        {game.status === 'lobby' && (
          <div className="lobby-timeout">
            <SyncIcon size="medium" />
            <ReactMomentCountDown toDate={new Date(game.created + 600000)} targetFormatMask="m:ss" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveGame;
