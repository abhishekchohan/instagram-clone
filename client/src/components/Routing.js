import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from 'react-redux';
import { set_islogged, unset_islogged, set_loggedUser, unset_loggedUser } from "../components/actions";
import { Route, Switch } from 'react-router-dom';
import Home from '../components/screens/Home';
import Profile from '../components/screens/Profile';
import Login from '../components/screens/Login';
import Signup from '../components/screens/Signup';
import Comments from './smallComponents/Comments';
import LikesFollowingFollowers from './smallComponents/LikesFollowingFollowers';
import EditProfile from './smallComponents/EditProfile';
import ProfilePhoto from './smallComponents/ProfilePhoto';


const Routing = () => {
    const isAuth = useSelector(state => state.isLogged);
    const isUpdate = useSelector(state => state.isUpdate);
    const dispatch = useDispatch();
    // first thing that will run and identify if user has a session saved or not..
    useEffect(() => {
        //using unstable batch updates so that the setstate functions dont trigger useEffect again and again
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
                        // setting user data to set_isloggedUser state
                        dispatch(set_loggedUser(data.user))
                        // setting state to true for isLogged state using set_islogged action dispatch
                        dispatch(set_islogged())
                    }
                    if (data.error) {
                        // unset the states to false or null
                        dispatch(unset_loggedUser())
                        dispatch(unset_islogged())
                    }
                }).catch(er => console.log(er));
        })
        // eslint-disable-next-line
    }, [isUpdate]);
    return (

        < Switch >
            {
                // all the routes except signup route, when user is not logged in, will redirect to login route.
                // When the user is logged in then all the inactive routes will redirect to home route.
                isAuth && <Route path="/user/:username" >
                    <Profile />
                </Route>
            }
            {
                isAuth && <Route exact path="/" >
                    <Home />
                </Route>
            }
            {
                isAuth && <Route exact path="/myCollection/:postId" >
                    <Home />
                </Route>
            }
            {
                isAuth && <Route exact path="/updateProfilePhoto" >
                    <ProfilePhoto />
                </Route>
            }
            {
                isAuth && <Route path="/:postId/comments" >
                    <Comments />
                </Route>
            }
            {
                isAuth && <Route path="/:postId/likes" >
                    <LikesFollowingFollowers />
                </Route>
            }
            {
                isAuth && <Route path="/profile/edit" >
                    <EditProfile />
                </Route>
            }
            {
                isAuth && <Route path="/followering/:userId/:task" >
                    <LikesFollowingFollowers />
                </Route>
            }
            {
                isAuth && <Route path="/:id/:postId" >
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
        </Switch >

    )
}

export default Routing;