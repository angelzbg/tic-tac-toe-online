import './styles/style.css';
import { ArrowUpIcon, ArrowDownIcon, GearIcon } from '@primer/octicons-react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAuthLoading, setAuthLogged, setUser } from '../../store/actions/authActions';
import { Link } from 'react-router-dom';
import { avatars } from '../../utils/constants';
import UserMenu from './UserMenu';

const UserCard = () => {
  const { user, isLogged } = useSelector((store) => store.auth);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  /*useEffect(() => {
    setTimeout(() => {
      batch(() => {
        dispatch(
          setUser({
            username: 'Pesho',
            avatar: 1,
            created: new Date().getTime(),
            wins: 100,
            losses: 30,
            rate: 76.92,
            socketId: 'someuuid',
          })
        );
        dispatch(setAuthLogged(true));
        dispatch(setAuthLoading(true));
      });
    }, 1000);
  }, [dispatch]);*/

  const percentage = `${user?.rate || 0}%`;

  return (
    <div className="user-card">
      <div className="profile-avatar">
        <img src={avatars[user?.avatar] || avatars[0]} alt="avatar" />
        {isLogged && (
          <div className="profile-settings-menu">
            <div
              id="user-menu-toggle"
              className="profile-settings-button"
              onClick={() => setMenuOpen(!isMenuOpen)}
              tooltip={!isMenuOpen ? 'Open settings' : 'Close settings'}
            >
              <GearIcon size="medium" />
            </div>
            {isMenuOpen && <UserMenu {...{ setMenuOpen }} />}
          </div>
        )}
      </div>
      {isLogged ? (
        <>
          <div className="profile-username">{user.username}</div>
          <div className="profile-score">
            <div className="profile-wins" tooltip="Wins">
              <ArrowUpIcon />
              {user.wins}
            </div>
            <div className="profile-losses" tooltip="Losses">
              <ArrowDownIcon />
              {user.losses}
            </div>
            <div className="profile-rate" tooltip="Winrate">
              <div className="rate-indicator" style={{ width: `calc(${percentage} + 1.6px)` }}>
                {percentage}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="login-register">
          <Link to="/login">Login </Link>
          <Link to="/register"> Register</Link>
        </div>
      )}
    </div>
  );
};

export default UserCard;
