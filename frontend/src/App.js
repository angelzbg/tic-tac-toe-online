import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AppLoader from './components/loaders/app';
import UserCard from './components/usercard';
import Navigation from './components/navigation';
import Header from './components/header';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Ranking from './pages/ranking';
import GamesList from './pages/games/';
import TicTacToeGames from './pages/games/tictactoe';
import TicTacToeRanking from './pages/ranking/tictactoe';

const App = () => {
  const { isAuthLoading } = useSelector((store) => store.auth);

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <div className="glass">
          <div className="app-left-side">
            <UserCard />
            <Navigation />
          </div>
          <div className="app-right-side">
            <Route path="/:route?/:subroute?" component={Header} />
            <Switch>
              <Route exact path="/" component={GamesList} />
              <Route exact path="/tic-tac-toe" component={TicTacToeGames} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/ranking" component={Ranking} />
              <Route exact path="/ranking/tic-tac-toe" component={TicTacToeRanking} />
              <Route path="*" component={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </div>
        {isAuthLoading && <AppLoader />}
      </div>
    </BrowserRouter>
  );
};

export default App;
