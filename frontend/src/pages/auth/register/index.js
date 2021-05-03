import { useState } from 'react';
import { avatars } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { registerInputs } from '../constants';
import { register } from '../../../utils/api';
import AvatarsModal from '../../../components/modals/avatars';
import AuthForm from '../AuthForm';

const Register = () => {
  const { isLogged } = useSelector((store) => store.auth);
  const [avatar, setAvatar] = useState(0);
  const [isOpen, setOpen] = useState(false);

  const onSelect = (avatar) => {
    setAvatar(avatar);
    setOpen(false);
  };

  const onCancel = () => setOpen(false);

  if (isLogged) {
    return <Redirect to="/" />;
  }

  return (
    <AuthForm
      fields={registerInputs}
      onSubmit={(body = {}) => register({ ...body, avatar })}
      children={
        <>
          {isOpen && <AvatarsModal {...{ onSelect, onCancel }} />}
          <img className="register-avatar" src={avatars[avatar]} alt="" onClick={() => setOpen(true)} />
          <br />
        </>
      }
    />
  );
};

export default Register;
