import '../styles/style.css';
import { useState } from 'react';
import { avatars } from '../../../utils/constants';
import AvatarsModal from '../../../components/modals/avatars';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { registerInputs } from '../constants';
import { useAuthForm } from '../utils';
import { register } from '../../../utils/api';

const Register = () => {
  const { isLogged } = useSelector((store) => store.auth);
  const [avatar, setAvatar] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const authForm = useAuthForm(registerInputs, register, { avatar });

  const onSelect = (avatar) => {
    setAvatar(avatar);
    setOpen(false);
  };

  const onCancel = () => setOpen(false);

  if (isLogged) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-form">
      <img className="register-avatar" src={avatars[avatar]} alt="" onClick={() => setOpen(true)} />
      <br />
      {authForm}
      {isOpen && <AvatarsModal {...{ onSelect, onCancel }} />}
    </div>
  );
};

export default Register;
