import { SignOutIcon, HubotIcon } from '@primer/octicons-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserAvatar } from '../../store/actions/authActions';
import { logOut, updateUserAvatar } from '../../utils/api';
import AvatarsModal from '../modals/avatars';
import { shouldUserMenuClose } from './utils';

const UserMenu = ({ setMenuOpen }) => {
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      if (shouldUserMenuClose(avatarModalOpen, userMenuRef, target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, [avatarModalOpen, setMenuOpen]);

  return (
    <div className="user-menu" id="user-menu" ref={userMenuRef}>
      <div className="user-menu-item" onClick={() => setAvatarModalOpen(true)}>
        <HubotIcon size={'small'} />
        Change avatar
      </div>
      <div className="user-menu-item" onClick={logOut}>
        <SignOutIcon size={'small'} />
        Logout
      </div>
      {avatarModalOpen && (
        <AvatarsModal
          {...{
            onSelect: (avatar) => {
              updateUserAvatar(avatar);
              dispatch(setUserAvatar(avatar));
              setAvatarModalOpen(false);
            },
            onCancel: () => setAvatarModalOpen(false),
          }}
        />
      )}
    </div>
  );
};

export default UserMenu;
