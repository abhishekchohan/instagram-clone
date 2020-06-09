import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from 'react-redux';
import { set_islogged, unset_islogged, set_loggedUser, unset_loggedUser } from "../components/actions";
import { Route, Switch } from 'react-router-dom';
import Home from '../components/screens/Home';
import Profile from '../components/screens/Profile';
import Login from '../components/screens/Login';
import Signup from '../components/screens/Signup';


const Routing = () => {
    const isAuth = useSelector(state => state.isLogged);
    const dispatch = useDispatch();
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
                        dispatch(set_loggedUser(data.user))
                        dispatch(set_islogged())
                    }
                    if (data.error) {
                        dispatch(unset_loggedUser())
                        dispatch(unset_islogged())
                        //history.push('/login');
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
                isAuth === false && <Route path="/signup">
                    <Signup />
                </Route>
            }
            {
                isAuth === false && <Route>
                    <Login />
                </Route>
            }
        </Switch>

    )
}

export default Routing;