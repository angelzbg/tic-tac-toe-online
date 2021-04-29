import { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setAuthLoading, setUser } from './store/actions/authActions';
import UserCard from "./components/usercard";
import Navigation from "./components/navigation";

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
            {/*lqva                dqsna*/}
            {/*usercard            header*/}
            {/*nav                 switch*/}
            <div  className="app-left-side">
                <UserCard></UserCard>
                <Navigation></Navigation>
                {/* Navigation */}
            </div>
            <div className="app-right-side">
                {/* Header */}
                {/* Switch */}
            </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
