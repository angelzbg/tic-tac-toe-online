import './styles/style.css';
import { NavLink } from 'react-router-dom';
import { RocketIcon, StarIcon } from '@primer/octicons-react';

const Navigation = () => {
  return (
    <div className="navigation">
      <NavLink to="/">
        <RocketIcon size={22} /> Games
      </NavLink>
      <NavLink to="/ranking">
        <StarIcon size={22} /> Ranking
      </NavLink>
    </div>
  );
};

export default Navigation;
