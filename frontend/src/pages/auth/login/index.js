import AuthForm from "../AuthForm";
import { login } from "../../../utils/api";
import { loginInputs } from "../constants";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const Login = () => {
  const { isLogged } = useSelector((store) => store.auth);
  if (isLogged) return <Redirect to="/" />;
  return <AuthForm fields={loginInputs} onSubmit={login} />;
};

export default Login;
