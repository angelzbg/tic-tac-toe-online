import { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { setAuthLoading, setUser } from './store/actions/authActions';
import UserCard from './components/usercard';
import Navigation from './components/navigation';
import Header from './components/header';
import Container from "./components/container";

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthLoading } = useSelector((store) => store.auth);

  /*useEffect(() => {
    setTimeout(() => {
      batch(() => {
        dispatch(setAuthLoading(false));
        dispatch(setUser({ username: 'Pesho' }));
      });
    }, 5000);
  }, [dispatch]);*/

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
            <Container/>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
