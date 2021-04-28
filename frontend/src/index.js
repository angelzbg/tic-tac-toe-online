import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, batch } from 'react-redux';
import store from './store';
import { setAuthLoading, setUser } from './store/actions/authActions';

/*setTimeout(() => {
  batch(() => {
    store.dispatch(setAuthLoading(false));
    store.dispatch(setUser({ username: 'Pesho' }));
  });
}, 5000);*/

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
