import "../styles/style.css";
import { useState, Fragment } from "react";
import { avatars } from "../../../utils/constants";
import AvatarsModal from "../../../components/modals/avatars";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { registerInputs } from "../constants";
import { useAuthForm } from "../utils";
import AuthFields from "../AuthFields";
import { register } from "../../../utils/api";

const Register = () => {
  const { isLogged } = useSelector((store) => store.auth);
  const [avatar, setAvatar] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const {
    state,
    onChange,
    isValidForm,
    getFieldsBody,
    setNetworkError,
  } = useAuthForm(registerInputs);

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
      <img
        className="register-avatar"
        src={avatars[avatar]}
        alt=""
        onClick={() => setOpen(true)}
      />
      <br />
      <AuthFields {...{ ...state, onChange }} />
      <input
        type="submit"
        onClick={async () => {
          if (!isValidForm()) {
            return;
          }

          const body = { ...getFieldsBody(), avatar };
          const response = await register(body);
          if (response.error) {
            setNetworkError(response.error);
          }
        }}
      />
      <br />
      <div className={`auth-error ${!state.networkError ? 'inactive' : ''}`}>{state.networkError}</div>
      {isOpen && <AvatarsModal {...{ onSelect, onCancel }} />}
    </div>
  );
};

export default Register;
