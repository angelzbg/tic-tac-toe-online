import { CircleIcon, SyncIcon, XIcon } from '@primer/octicons-react';
import ReactMomentCountDown from 'react-moment-countdown';
import { TTT_leaveLobby, TTT_makeTurn, TTT_startGAme } from '../../../../utils/api';
import { avatars } from '../../../../utils/constants';

const symbols = {
  X: () => <XIcon size="medium" />,
  O: () => <CircleIcon size="big" />,
};

const ActiveGame = ({ game, auth }) => {
  return (
    <div key={game.gameId} className="active-game-card">
      <div className="game-players">
        {game.status === 'finished'
          ? Object.entries(game.playersStatistics).map(([playerId, player]) => (
              <div key={playerId} className="game-player">
                <img className="game-avatar" src={avatars[player.avatar]} alt="" />
                <div className="game-player-info">
                  <div tooltip={player.username}>
                    <p className="game-username">
                      [{player.symbol}]{' '}
                      {(({ username }) => (
                        <span style={{ fontSize: `calc(0.99rem - (0.03rem * ${username.length}))` }}>{username}</span>
                      ))({ ...{ username: player.username } })}
                    </p>
                  </div>
                  {playerId === game.winnerId && <p>winner</p>}
                </div>
              </div>
            ))
          : Object.entries(game.players).map(([playerId, player]) => (
              <div key={playerId} className="game-player">
                <img className="game-avatar" src={avatars[player.avatar]} alt="" />
                <div className="game-player-info">
                  <div tooltip={player.username}>
                    <p className="game-username">
                      [{player.symbol}]{' '}
                      {(({ username }) => (
                        <span style={{ fontSize: `calc(0.99rem - (0.03rem * ${username.length}))` }}>{username}</span>
                      ))({ ...{ username: player.username } })}
                    </p>
                  </div>
                  {game.status === 'progress' && game.turn === player._id && (
                    <div className="game-turn-timer">
                      <SyncIcon size="small" />{' '}
                      <ReactMomentCountDown toDate={new Date(game.turnDate)} targetFormatMask="ss" />
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
      <div className="board" style={{ transform: `rotate(${game.rotate}deg)` }}>
        {game.fields.map((row, i) => {
          return row.map((field, j) => {
            const isEmpty = field === 0;
            return (
              <div
                className={`board-field ${
                  isEmpty ? (game.status === 'progress' && game.turn === auth.user._id ? 'empty' : '') : field
                }`}
                key={`${i}-${j}`}
                onClick={() => {
                  if (isEmpty && game.status === 'progress' && game.turn === auth.user._id) {
                    TTT_makeTurn(game.gameId, i, j);
                  }
                }}
              >
                {!isEmpty && symbols[field]()}
              </div>
            );
          });
        })}
        {typeof game.path === 'number' && <div className={`path${game.path}`} />}
      </div>
      <div className="game-controllers">
        {game.status === 'lobby' &&
          Object.keys(game.players).length > 1 &&
          Object.values(game.players).find(({ username }) => username === auth.user.username).symbol === 'X' && (
            <button className="start-button" onClick={() => TTT_startGAme(game.gameId)}>
              Start
            </button>
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
