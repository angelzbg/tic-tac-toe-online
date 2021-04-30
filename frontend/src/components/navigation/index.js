import './styles/style.css';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className="navigation">
      <NavLink to="/active-games">
        <RocketIcon size={22} /> Games
      </NavLink>
      <NavLink to="/ranking">
        <StarIcon size={22} /> Ranking
      </NavLink>
    </div>
  );
};

export default Navigation;
