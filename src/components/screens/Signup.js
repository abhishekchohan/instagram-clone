import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import M from "materialize-css";


const Signup = () => {
    const history = useHistory();
    // formdata is state which has object with different key-pairs.
    const [formData, setFormData] = useState({ email: "", username: "", password: "", fullname: "" });
    // Destructuring the formaData into required lables/variables to make it little easy to work with these.
    const { email, password, fullname, username } = formData;

    // Whenever any form elemnet values changes handleFormData is called and make appropriate changes to state.
    // Controlled form elements.
    const handleFormData = e => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(prevSate => {
            return { ...prevSate, [name]: value }  // destructring the prev state and adding new at the end to overwite the changes.
        })
    }

    // Handle Signup form data and make a request to server to signup new user.
    const handleSignup = e => {
        e.preventDefault();
        // eslint-disable-next-line
        if (email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            && fullname.length > 3 && username.length > 3 && password.length > 3) {
            // Chaecking whether the email and other data is valid or not
            // Anyways server will validaes the data too..

            fetch("/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    fullname,
                    password,
                    username
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        // If data json response does conatin a error property then notify user with a toast.
                        M.toast({ html: data.error, classes: "red darken-1" })
                    } else {
                        // clear form // redirect user to login page.. // send a toast to user regarding successfull signup..
                        setFormData({ email: "", username: "", password: "", fullname: "" })
                        history.push("/login");
                        M.toast({ html: data.message, classes: "blue darken-1" })
                    }
                })
                .catch(err => console.log(err));
        } else {
            // if the fields are invalid then send this toast instead.
            M.toast({ html: "Invalid email or other fields<br>Please check your inputs again.", classes: "red darken-1" })
        }
    }

    return (
        <>
            <form method="post" className="card card-login" onSubmit={handleSignup}>
                <h2 className="insta-font">Instagram</h2>
                <h5 className="grey-text  text-darken-1">Sign up to see photos and videos from your friends.</h5>
                <input type="email" autoComplete="off"
                    name="email" placeholder="Email" required
                    value={email} onChange={handleFormData} />
                <input type="text" autoComplete="off"
                    name="fullname" placeholder="Full Name" required minLength="4"
                    value={fullname} onChange={handleFormData} />
                <input type="text" autoComplete="off" required minLength="4"
                    name="username" placeholder="Username"
                    value={username} onChange={handleFormData} />
                <input type="password" name="password" required minLength="4"
                    placeholder="Password" value={password} onChange={handleFormData} />
                <br />
                <button className="btn blue insta-btn">
                    Sign Up
                </button>
            </form>
            <div className="card card-login signup-card">
                Have an account?  <Link className="blue-text" to="/Login"> Log in</Link>
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
                    </button>
                </div>
            </div>
        </>
    );
}

export default Signup;