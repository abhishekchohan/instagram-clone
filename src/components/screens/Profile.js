import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from 'react-redux';


const Profile = () => {
    const { username } = useParams();
    const history = useHistory();
    const isAuth = useSelector(state => state.isLogged);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        fetch(`/user/${username}`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(result => result.json())
            .then(result => {
                if (result.user) {
                    setUserData(result.user);
                }
                else {
                    history.push('/');
                }
            })
            .catch(er => console.log(er))
        //eslint-disable-next-line
    }, [])
    return (
        isAuth && userData ?
            <div className="profile card-home home">
                <div className="profile-info row">
                    <div className="col s4 left">
                        <img className="profile-img" src={userData.dp || require('../../images/profile-pic.jpg')} alt="profile-img" />
                    </div>
                    <div className="col s8 profile-data">
                        <div className={"profile-flex"} >
                            <span className="username profile-flex-item">{username}</span>
                            <div onClick={() => M.toast({ html: 'Edit Profile Button' })} className="profile-flex-item edit-btn white">Edit Profile</div>
                            <Link className="flex-settings" to="/createpost"><i className="profile-flex-item fas fa-cog fa-2x"></i></Link>
                        </div>
                    </div>
                </div>
                <span className="full-name"><strong>{userData.fullname}</strong></span><br /><br />
                {
                    <div className="btn blue" style={{ width: '100%', marginRight: '3rem', marginLeft: 'auto', borderRadius: '0.3rem' }}><strong className="white-text">Follow</strong></div>
                }
                <hr className="hr-profile" />
                <div className="row center">
                    <span className="col s4"><strong>{userData.posts.length}</strong><br />posts</span>
                    <span className="col s4"><strong>{userData.followers.length}</strong><br />followers</span>
                    <span className="col s4"><strong>{userData.following.length}</strong><br />following</span>
                </div>
                <hr className="hr-profile" />
                <div className="my-posts">
                    {
                        userData.posts.map(post => {
                            return <img key={post._id + Math.random()} style={{ width: '100%', height: '8rem' }} src={post.url} alt="posts" />
                        })
                    }
                </div>
            </div>
            :
            null
    )
}

export default Profile;