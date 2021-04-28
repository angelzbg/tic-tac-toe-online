import { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setAuthLoading, setUser } from './store/actions/authActions';

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthLoading } = useSelector((store) => store.auth);

  useEffect(() => {
    setTimeout(() => {
      batch(() => {
        dispatch(setAuthLoading(false));
        dispatch(setUser({ username: 'Pesho' }));
      });
    }, 5000);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <main>
        <section className="glass">{isAuthLoading ? <div>Loading</div> : <div>{user.username}</div>}</section>
      </main>
    </BrowserRouter>
  );
};

export default App;
