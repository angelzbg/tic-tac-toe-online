import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setAuthLoading, setAuthState, setUser } from './store/actions/authActions';
import Main from './components/Main/Main';

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthLoading } = useSelector((store) => store.auth);

  useEffect(() => {
    setTimeout(() => {
      //dispatch(setUser({ username: 'Pesho' }));
      //dispatch(setAuthLoading(false));
      //causes prerender
      dispatch(
        setAuthState({
          isAuthLoading: false,
          user: { username: 'Pesho' },
        })
      );
    }, 5000);
  }, [dispatch]); 

  return (
    <BrowserRouter>
      <Main>{isAuthLoading ? <div>Loading</div> : <div>{user.username}</div>}</Main>
    </BrowserRouter>
  );
};

export default App;
