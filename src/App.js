import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import Header from "./components/Header"
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import { createStore } from "redux";
import allReducers from "./components/reducers";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { set_islogged } from "./components/actions";

const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const Routing = () => {
  const isAuth = useSelector(state => state.isLogged);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    ReactDOM.unstable_batchedUpdates(() => {
      fetch("/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + localStorage.getItem('jwt')
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.isLogged) {
            dispatch(set_islogged())
          }
          if (data.error) {
            history.push('/login');
          }
        }).catch(er => console.log(er));
    })
    // eslint-disable-next-line
  }, []);
  return (

    <Switch>
      {
        isAuth && <Route path="/profile" >
          <Profile />
        </Route>
      }
      {
        isAuth && <Route exact path="/" >
          <Home />
        </Route>
      }
      {
        isAuth && <Route>
          <Home />
        </Route>
      }
      {
        !isAuth && <Route path="/signup">
          <Signup />
        </Route>
      }
      {
        !isAuth && <Route>
          <Login />
        </Route>
      }
    </Switch>

  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routing />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
