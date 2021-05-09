import { SignOutIcon, HubotIcon } from '@primer/octicons-react';
import { useEffect, useRef, useState } from 'react';
import { logOut, updateUserAvatar } from '../../utils/api';
import AvatarsModal from '../modals/avatars';
import { handleClickOutside } from './utils';

const UserMenu = ({ setMenuOpen }) => {
  const userMenuRef = useRef(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  useEffect(() => handleClickOutside(userMenuRef, avatarModalOpen, setMenuOpen), [avatarModalOpen, setMenuOpen]);

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
