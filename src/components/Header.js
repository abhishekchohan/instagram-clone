import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unset_islogged, unset_loggedUser } from "./actions/index";

const Header = () => {

    // isAuth is state for user to be logged in or not.
    // dispatch and history are initialised for using them later to set state and redirect respectively.
    const isAuth = useSelector(state => state.isLogged);
    const { username } = useSelector(state => state.loggedUser) || "username";
    const dispatch = useDispatch();
    const history = useHistory();

    // Logout function to logout user
    const logout = () => {
        localStorage.clear();   // clear the localstorage and token for this domain.
        dispatch(unset_islogged());   // set state to false // user logged out .
        dispatch(unset_loggedUser());
        history.push("/login"); // redirect user to login page.
    }

    // naviagtion bar component and using isAuth to decide what link should redirect to what screens.
    return (<nav className="white">
        <div className="nav-wrapper">
            <Link to={isAuth ? "/" : "/login"} className="brand-logo insta-font left">Instagram</Link>
            <ul className="right">
                {
                    isAuth ? // after login links..
                        <>
                            <li><Link to="/"><i className="fas fa-home-lg-alt"></i></Link></li>
                            <li><a href={`/user/${username}`}><i className="fas fa-2x fa-user-circle"></i></a></li>
                            <li onClick={logout}><Link to=""><i className="fas fa-2x fa-sign-out-alt"></i></Link></li>

                        </>
                        :   // before login links..
                        <>
                            <li><Link to="/login"><i className="fas fa-2x fa-sign-in-alt"></i></Link></li>
                            <li><Link to="/signup"><i className="fas fa-2x fa-user-plus"></i></Link></li>
                        </>
                }



            </ul>
        </div>
    </nav>)
}

export default Header;