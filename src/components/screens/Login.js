import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import M from "materialize-css";
import { useDispatch, useSelector } from "react-redux";
import { set_islogged, set_loggedUser } from "../actions";

const Login = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    // isAuth to verify if user is already logged in or not.
    const isAuth = useSelector(state => state.isLogged);
    // local state to decide wether to display login page or not
    const [display, setDisplay] = useState(null);
    // usestate hook that contains object which carry email and passsword values.
    const [formData, setFormData] = useState({ email: "", password: "" });
    // Destructuring values from formData object.
    const { email, password } = formData;

    // Whenever any form elemnet values changes handleFormData is called and make appropriate changes to state.
    // Controlled form elements.
    const handleFormData = e => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(prevSate => {
            return { ...prevSate, [name]: value } // destructring the prev state and adding new at the end to overwite the changes.
        })
    }

    // Handle Login form data and make a request to server to login user.
    const handleLogin = e => {
        e.preventDefault();
        // eslint-disable-next-line
        if (email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            && password.length > 3) {
            // Chaecking whether the email and password is valid or not
            // Anyways server will validaes the data too..

            fetch("/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        // If data json response does conatin a error property then notify user with a toast.
                        M.toast({ html: data.error, classes: "red darken-1" })
                    } else {
                        // clear form
                        setFormData({ email: "", password: "" })
                        // Saving token and user data in localStorage
                        localStorage.setItem("jwt", data.token)
                        dispatch(set_loggedUser(data.user))
                        dispatch(set_islogged());
                        // Redirect user to Home page.. 
                        history.push("/");
                        // Send a toast to user regarding successfull Login..
                        M.toast({ html: data.message, classes: "blue darken-1" })
                    }
                })
                .catch(err => console.log(err));
        } else {
            // if the fields are invalid then send this toast instead.
            M.toast({ html: "Invalid email or other fields<br>Please check your inputs again.", classes: "red darken-1" })
        }
    }


    useEffect(() => {
        if (isAuth) {
            history.push("/");
        }
        else {
            setDisplay(true);
        }
        // eslint-disable-next-line
    }, [isAuth]);



    return (

        display && <>
            <form method="post" className="card card-login" onSubmit={handleLogin}>
                <h2 className="insta-font">Instagram</h2>
                <input type="email" autoComplete="off"
                    name="email" placeholder="Email" required
                    value={email} onChange={handleFormData} />
                <input type="password" name="password" required minLength="4"
                    placeholder="Password" value={password} onChange={handleFormData} />
                <br />
                <button className="btn blue insta-btn">
                    Log In
            </button>
                <div className="or-container">
                    <hr />OR<hr />
                </div>
                <br />
                <Link className="blue-text  text-darken-4" to="/Login">forgot password ?</Link>
            </form>
            <div className="card card-login signup-card">
                Don't have an account? <Link className="blue-text" to="/Signup"> Sign up</Link>
            </div>
            <div className="card card-login signup-card app-card">
                <div> Get the app </div><br />
                <div>
                    <button className="btn black">
                        <i className="fab fa-google-play"> </i> Google Play
                    </button>
                    {
                        isMobile ? <span><br /><br /></span> : <span>  </span>
                    }
                    <button className="btn black">
                        <i className="fab fa-app-store"> </i> App Store<i className="text-transparent">ss</i>
                    </button></div>
            </div>
        </>
    );
}

export default Login;