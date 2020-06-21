import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { set_loggedUser } from "../actions"

const EditProfile = () => {

    const history = useHistory();
    const isAuth = useSelector(state => state.isLogged);
    const loggedUser = useSelector(state => state.loggedUser);
    const dispactch = useDispatch();
    const [data, setData] = useState({
        fullname: loggedUser.fullname,
        username: loggedUser.username,
        email: loggedUser.email
    });
    const handleData = e => {
        const name = e.target.name;
        const value = e.target.value;
        setData(prev => { return { ...prev, [name]: value } });
    }
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
    const { fullname, username, email } = data;

    return <div className="home card card-home" style={{ minHeight: '65vh' }}>
        {
            isAuth && (
                <div>
                    <form onSubmit={handleSubmit} method="post">
                        <div className="post-top-part">
                            <i onClick={history.goBack} style={{ margin: '1rem', fontSize: '1.4rem', cursor: 'pointer' }} className="fas">Cancel</i>
                            <i style={{ margin: '1.1rem auto', fontSize: '1.5rem' }} className="fas">Edit Profile</i>
                            <i style={{ marginLeft: 'auto', margin: '1rem', fontSize: '1.4rem', cursor: 'pointer' }} onClick={handleSubmit} className="blue-text text-darken-2 fas">Done</i>
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
                                <div style={{ fontSize: '1.3rem', width: '27%', marginTop: '0.5rem' }} className="col">Name</div>
                                <input style={{ maxWidth: '70%', borderColor: 'white !important', marginRight: '3%' }} className="col" type="text" spellCheck="false" autoComplete="off" id="fullname" name="fullname" placeholder="Name" value={fullname} onChange={handleData} />
                            </div>
                            <div className="row">
                                <div style={{ fontSize: '1.3rem', width: '27%', marginTop: '0.5rem' }} className="col">Username</div>
                                <input style={{ maxWidth: '70%', borderColor: 'white !important', marginRight: '3%' }} className="col" type="text" spellCheck="false" autoComplete="off" id="username" name="username" placeholder="Username" value={username} onChange={handleData} />
                            </div>
                            <div className="row">
                                <div style={{ fontSize: '1.3rem', width: '27%', marginTop: '0.5rem' }} className="col">Email</div>
                                <input style={{ maxWidth: '70%', borderColor: 'white !important', marginRight: '3%' }} className="col" type="email" spellCheck="false" autoComplete="off" id="email" name="email" placeholder="Email" value={email} onChange={handleData} />
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
}

export default EditProfile;