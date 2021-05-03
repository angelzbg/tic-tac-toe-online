import './styles/style.css';
import AuthFields from './AuthFields';
import { useAuthForm } from './utils';

const AuthForm = ({ fields = () => [], onSubmit = () => {}, children = [] }) => {
  const { inputs, errors, error, onChange, submit } = useAuthForm(fields, onSubmit);
  return (
    <div className="auth-form">
      {children}
      <AuthFields {...{ inputs, errors, onChange }} />
      <input type="submit" onClick={submit} />
      <br />
      <div className={`auth-error ${!error ? 'inactive' : ''}`}>{error}</div>
    </div>
  );
};

export default AuthForm;
