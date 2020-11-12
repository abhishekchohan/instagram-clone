import React from 'react';
import Header from "./components/Header"
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from "redux";
import allReducers from "./components/reducers";
import { Provider } from 'react-redux';
import Routing from "./components/Routing";


// Redux store.
const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


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
