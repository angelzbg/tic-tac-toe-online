import './styles/style.css';
import { CircleIcon, RocketIcon, SignInIcon, SyncIcon, XIcon } from '@primer/octicons-react';
import ReactMomentCountDown from 'react-moment-countdown';
import { useSelector } from 'react-redux';
import ActiveGame from './activegame';
import { useHistory } from 'react-router';
import { avatars } from '../../../utils/constants';
import { TTT_createGame, TTT_joinLobby, TTT_subscribe, TTT_unsubscribe } from '../../../utils/api';
import { useEffect, useLayoutEffect, useState } from 'react';

const symbols = {
  X: (props = {}) => XIcon({ ...props, size: 'medium' }),
  O: (props = {}) => CircleIcon({ ...props, size: 'small' }),
};

const resizeMe = () => {
  const container = document.querySelector('.container');
  if (container) {
    const rightSide = document.querySelector('.app-right-side');
    const rightSideHeight = rightSide.clientHeight;
    const header = document.querySelector('.header');
    const headerHeight = header.clientHeight + +window.getComputedStyle(header).marginTop.split('px')[0];
    const activeGameCard = document.querySelector('.active-game-card');
    const activeGameCardHeight = activeGameCard
      ? activeGameCard.clientHeight + +window.getComputedStyle(activeGameCard).marginTop.split('px')[0]
      : 0;
    return (
      rightSideHeight -
      headerHeight -
      activeGameCardHeight -
      +window.getComputedStyle(container).marginTop.split('px')[0]
    );
  }

  return 0;
};

const TicTacToeGames = () => {
  const history = useHistory();
  const { tictactoe, auth } = useSelector((store) => store);
  const [height, setHeight] = useState(0);
  const activeGame = auth.user ? tictactoe.games[tictactoe.activeGame] : null;
  const canCreate = !activeGame;
  const games = Object.values(tictactoe.games).sort((a, b) => b.created - a.created);
  if (activeGame) {
    const index = games.findIndex(({ gameId }) => gameId === activeGame.gameId);
    if (index !== -1) {
      games.splice(index, 1);
    }
  }

  useEffect(() => {
    TTT_subscribe();
    const resize = () => setHeight(resizeMe());
    window.addEventListener('resize', resize);
    return () => {
      TTT_unsubscribe();
      window.removeEventListener('resize', resize);
    };
  }, [setHeight]);

  useLayoutEffect(() => {
    setHeight(resizeMe());
  }, [setHeight, activeGame]);

  //console.log(activeGame);
  return (
    <>
      {activeGame && <ActiveGame {...{ game: activeGame, auth }} />}
      <div className="container scroll-h" style={{ height: height || 300 }}>
        {canCreate && (
          <button className="create-game" onClick={() => (auth.user ? TTT_createGame() : history.push('/login'))}>
            Create Game
          </button>
        )}
        {games.map((game) => {
          return (
            <div key={game.gameId} className="game-card">
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
                              <span style={{ fontSize: `calc(1.11rem - (0.03rem * ${username.length}))` }}>
                                {username}
                              </span>
                            ))({ ...{ username: player.username } })}
                          </p>
                        </div>
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
                      <div className={`board-field ${field}`} key={`${i}-${j}`}>
                        {!isEmpty && symbols[field]()}
                      </div>
                    );
                  });
                })}
                {typeof game.path === 'number' && <div className={`path${game.path}`} />}
              </div>
              <div className="game-controllers">
                {!activeGame && Object.keys(game.players).length < 2 && game.status === 'lobby' && (
                  <button
                    className="join-button"
                    onClick={() => (auth.user ? TTT_joinLobby(game.gameId) : history.push('/login'))}
                    tooltip="Join"
                  >
                    <SignInIcon size="medium" />
                  </button>
                )}
                {game.status === 'lobby' && (
                  <div className="lobby-timeout" tooltip="Timeout">
                    <SyncIcon size="medium" />
                    <ReactMomentCountDown toDate={new Date(game.created + 600000)} targetFormatMask="m:ss" />
                  </div>
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
