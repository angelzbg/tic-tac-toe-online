import { useEffect } from 'react';
import './styles/style.css';

const headers = {
  default: {
    title: 'Games',
  },
  'tic-tac-toe': {
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
    params: { route, subroute },
  },
}) => {
  const title = `${(headers[route] || headers.default)?.title}${subroute ? ` - ${headers[subroute]?.title}` : ''}`;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-underline" />
    </div>
  );
};

export default Header;
