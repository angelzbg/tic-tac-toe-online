import GameCard from './gamecard';
import './styles/style.css';

const ActiveGames = () => {
  return (
    <div className="container scroll-h">
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
    </div>
  );
};

export default ActiveGames;
