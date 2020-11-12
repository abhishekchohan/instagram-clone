import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { set_loggedUser } from "../actions";
import "./smallComponents.css";

const EditProfile = () => {

    const history = useHistory();
    const dispactch = useDispatch();
    // getting logged user info from state
    const loggedUser = useSelector(state => state.loggedUser);
    // state to know whether user is logged in or not.
    const isAuth = useSelector(state => state.isLogged);

    // local state to set data for user inputs in form
    const [data, setData] = useState({
        fullname: loggedUser.fullname,
        username: loggedUser.username,
        email: loggedUser.email
    });

    // controlled from input
    const handleData = e => {
        const name = e.target.name;
        const value = e.target.value;
        setData(prev => { return { ...prev, [name]: value } });
    }

    // on clicking done button will trigger this function that will handle form submission
    const handleSubmit = e => {
        e.preventDefault();
        fetch(`/updateUser`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ id: loggedUser._id, data })
        })
            .then(resp => resp.json())
            .then(result => {
                if (!result.error) {
                    dispactch(set_loggedUser(result.user));
                    history.goBack();
                }
            })
            .catch(er => console.log(er))
    }

    // Destructuring data into required variables
    const { fullname, username, email } = data;

    return <div className="home card card-home" style={{ minHeight: '65vh' }}>
        {
            isAuth && (
                <div>
                    <form onSubmit={handleSubmit} method="post">
                        <div className="post-top-part">
                            <i onClick={history.goBack} className="ep-cancelBtn fas">Cancel</i>
                            <i className="fas ep-headerTitle">Edit Profile</i>
                            <i onClick={handleSubmit} className="blue-text text-darken-2 fas ep-doneBtn">Done</i>
                        </div>
                        <hr />
                        <div>
                            <img style={{ marginLeft: '34%' }} className="profile-img" src={loggedUser.dp || require('../../images/profile-pic.jpg')} alt="profile-img" />
                        </div>
                        <div style={{ marginLeft: '34%' }}>
                            <strong><Link to="/updateProfilePhoto" className="blue-text text-darken-2">Change Profile Photo</Link></strong>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <div className="row">
                                <div className="ep-labelDiv col">Name</div>
                                <input className="col ep-input" type="text" spellCheck="false" autoComplete="off" id="fullname" name="fullname" placeholder="Name" value={fullname} onChange={handleData} />
                            </div>
                            <div className="row">
                                <div className="col ep-labelDiv">Username</div>
                                <input className="col ep-input" type="text" spellCheck="false" autoComplete="off" id="username" name="username" placeholder="Username" value={username} onChange={handleData} />
                            </div>
                            <div className="row">
                                <div className="col ep-labelDiv">Email</div>
                                <input className="col ep-input" type="email" spellCheck="false" autoComplete="off" id="email" name="email" placeholder="Email" value={email} onChange={handleData} />
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
}

export default EditProfile;