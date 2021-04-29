import './styles/style.css';
import { ArrowUpIcon, ArrowDownIcon, GearIcon } from '@primer/octicons-react';
import avatar from '../../images/avatars/profile-picture.png';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setAuthLoading, setAuthLogged, setUser } from '../../store/actions/authActions';

const UserCard = () => {
  const { user, isLogged } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      batch(() => {
        dispatch(
          setUser({
            username: 'Pesho',
            avatar: 0,
            created: new Date().getTime(),
            wins: 100,
            losses: 30,
            rate: 76.92,
            socketId: 'someuuid',
          })
        );
        dispatch(setAuthLogged(true));
        dispatch(setAuthLoading(false));
      });
    }, 1000);
  }, [dispatch]);

  const percentage = `${user?.rate || 0}%`;

  return (
    <div className="user-card">
      <div className="profile-avatar">
        <img src={avatar} alt="avatar" />
        <div className="profile-settings-menu">
          <div className="profile-settings-button" tooltip={true ? 'Open Settings' : 'Close Settings'}>
            <GearIcon />
          </div>
        </div>
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
        <></>
      )}
    </div>
  );
};

export default UserCard;
