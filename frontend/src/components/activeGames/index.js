import "./styles/style.css";
import GameCard from "../gameCard";

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
