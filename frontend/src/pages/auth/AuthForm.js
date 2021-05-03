import './styles/style.css';
import AuthFields from './AuthFields';
import { useAuthForm } from './utils';

const AuthForm = ({ fields = () => [], onSubmit = () => {}, children = [] }) => {
  const { state, onChange, submit } = useAuthForm(fields, onSubmit);
  return (
    <div className="auth-form">
      {children}
      <AuthFields {...{ ...state, onChange }} />
      <input type="submit" onClick={submit} />
      <br />
      <div className={`auth-error ${!state.networkError ? 'inactive' : ''}`}>{state.networkError}</div>
    </div>
  );
};

export default AuthForm;
