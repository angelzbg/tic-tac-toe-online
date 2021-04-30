import './styles/style.css';
import { Portal } from 'react-portal';
import { avatars } from '../../../utils/constants';
import { useEffect } from 'react';

const AvatarsModal = ({ onSelect, onCancel }) => {
  useEffect(() => {
    const container = document.querySelector('.avatars-container');
    const onwheel = (event) => (container.scrollLeft += event.deltaY * 1);
    container.addEventListener('mousewheel', onwheel, { passive: false });
    return () => {
      container.removeEventListener('mosuewheel', onwheel, { passive: false });
    };
  }, []);

  return (
    <Portal node={document.querySelector('.app-wrapper')}>
      <div className="avatars-modal">
        <div className="avatar-modal-bgr-click" onClick={onCancel} />
        <div className="avatars-container">
          <div className="avatars-wrapper">
            {avatars.map((avatar, i) => (
              <img key={i} className="avatar" src={avatar} alt="" onClick={() => onSelect(i)} />
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AvatarsModal;
