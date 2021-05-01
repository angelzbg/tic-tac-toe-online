import './styles/style.css';
import { ArrowUpIcon, ArrowDownIcon, GearIcon } from '@primer/octicons-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { avatars } from '../../utils/constants';
import UserMenu from './UserMenu';

const UserCard = () => {
  const { user, isLogged } = useSelector((store) => store.auth);
  const [isMenuOpen, setMenuOpen] = useState(false);
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
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default UserCard;
