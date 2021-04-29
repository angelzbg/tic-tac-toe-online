import './styles/style.css';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className="navigation">
      <Link to="/">Games</Link>
      <Link to="/ranking">Ranking</Link>
    </div>
  );
};

export default Navigation;
