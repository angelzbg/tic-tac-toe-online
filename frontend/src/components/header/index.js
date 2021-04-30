import { useEffect } from 'react';
import './styles/style.css';

const headers = {
  default: {
    title: 'Tic Tac Toe',
  },
  ranking: {
    title: 'Players Ranking',
  },
  login: {
    title: 'Login',
  },
  register: {
    title: 'Register',
  },
};

const Header = ({
  match: {
    params: { route },
  },
}) => {
  const { title } = headers[route] || headers.default;

  useEffect(() => {
    document.title = `3xT - ${title}`;
  }, [title]);

  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-underline"></div>
    </div>
  );
};

export default Header;
