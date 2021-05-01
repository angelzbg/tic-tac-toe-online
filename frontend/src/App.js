import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import UserCard from './components/usercard';
import Navigation from './components/navigation';
import Header from './components/header';
import ActiveGames from './pages/games';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Ranking from './pages/ranking';
import AppLoader from './components/loaders/app';

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
            <Route path="/:route?" component={Header} />
            <Switch>
              <Route exact path="/" component={ActiveGames} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/ranking" component={Ranking} />
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
