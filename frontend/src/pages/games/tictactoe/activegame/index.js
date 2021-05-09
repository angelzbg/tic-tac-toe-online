import { CircleIcon, PlayIcon, RocketIcon, SignOutIcon, SyncIcon, XIcon } from '@primer/octicons-react';
import { useEffect, useState } from 'react';
import ReactMomentCountDown from 'react-moment-countdown';
import {
  TTT_getLeaveToggle,
  TTT_leaveLobby,
  TTT_makeTurn,
  TTT_setLeaveToggle,
  TTT_startGAme,
} from '../../../../utils/api';
import { avatars } from '../../../../utils/constants';

const symbols = {
  X: (props = {}) => XIcon({ ...props, size: 'medium' }),
  O: (props = {}) => CircleIcon({ ...props, size: 'small' }),
};

const ActiveGame = ({ game, auth }) => {
  const [fieldOver, setFieldOver] = useState([-1, -1]);
  const [leaveToggle, setLeaveToggle] = useState(TTT_getLeaveToggle());

  useEffect(() => {
    if (game.status === 'finished' && leaveToggle) {
      TTT_leaveLobby(game.gameId);
    }
  }, [game, leaveToggle]);

  return (
    <div key={game.gameId} className="active-game-card">
      <div
        className={`leave-toggle ${leaveToggle ? 'activated' : 'deactivated'}`}
        tooltip="Auto leave"
        onClick={() => {
          if (leaveToggle) {
            TTT_setLeaveToggle(false);
            setLeaveToggle(false);
            return;
          }

          TTT_setLeaveToggle(true);
          if (game.status === 'finished') {
            TTT_leaveLobby(game.gameId);
          } else {
            setLeaveToggle(true);
          }
        }}
      >
        <div />
      </div>
      <div className="game-players">
        {Object.entries(game.status === 'finished' ? game.playersStatistics : game.players).map(
          ([playerId, player]) => (
            <div key={playerId} className="game-player">
              <div className="game-avatar">
                <img src={avatars[player.avatar]} alt="" />
                <div className={`avatar-symbol ${player.symbol}`}>{symbols[player.symbol]()}</div>
                {game.status === 'finished' && playerId === game.winnerId && (
                  <div className="avatar-winner" tooltip="Winner">
                    <RocketIcon size="medium" />
                  </div>
                )}
              </div>
              <div className="game-player-info">
                <div tooltip={player.username}>
                  <p className="game-username">
                    {(({ username }) => (
                      <span style={{ fontSize: `calc(1.11rem - (0.03rem * ${username.length}))` }}>{username}</span>
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
          )
        )}
      </div>
      <div className="board" /*style={{ transform: `rotate(${game.rotate}deg)` }}*/>
        {game.fields.map((row, i) => {
          return row.map((field, j) => {
            const isEmpty = field === 0;
            return (
              <div
                className={`board-field ${
                  isEmpty ? (game.status === 'progress' && game.turn === auth.user._id ? 'empty' : '') : field
                }`}
                key={`${i}-${j}`}
                onMouseEnter={() => setFieldOver([i, j])}
                onMouseLeave={() => setFieldOver([-1, -1])}
                onClick={() => {
                  if (isEmpty && game.status === 'progress' && game.turn === auth.user._id) {
                    TTT_makeTurn(game.gameId, i, j);
                  }
                }}
              >
                {!isEmpty && symbols[field]()}
                {game.status === 'progress' &&
                  isEmpty &&
                  game.turn === auth.user._id &&
                  fieldOver[0] === i &&
                  fieldOver[1] === j &&
                  symbols[game.players[auth.user._id].symbol]({
                    className: `field-selector ${game.players[auth.user._id].symbol}`,
                  })}
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
            <button className="start-button" onClick={() => TTT_startGAme(game.gameId)} tooltip="Start">
              <PlayIcon size="medium" />
            </button>
          )}
        {game.status !== 'progress' && (
          <button className="leave-button" onClick={() => TTT_leaveLobby(game.gameId)} tooltip="Leave">
            <SignOutIcon size="medium" />
          </button>
        )}
        {game.status === 'lobby' && (
          <div
            className={`lobby-timeout ${Object.keys(game.players).length === 2 ? 'lobby-active' : ''}`}
            tooltip="Timeout"
          >
            <SyncIcon size="medium" />
            <ReactMomentCountDown toDate={new Date(game.created + 600000)} targetFormatMask="m:ss" />
            {game.players[auth.user._id].symbol === 'X' && <div className="lobby-indicator" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveGame;
