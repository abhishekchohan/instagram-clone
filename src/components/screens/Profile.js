import React from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import M from "materialize-css";
import { useSelector } from 'react-redux';


const Profile = () => {
    const isAuth = useSelector(state => state.isLogged);
    const profileData = {
        username: "abhishek_chohan",
        fullName: "Abhi 922",
        posts: 10,
        followers: 15,
        following: 5,
        profilePic: "../../images/profile-pic.jpg"
    };
    return (
        isAuth ?
            <div className="profile">
                <div className="profile-info row">
                    <div className="col s4 left">
                        <img className="profile-img" src={require("../../images/profile-pic.jpg")} alt="profile-img" />
                    </div>
                    <div className="col s8 profile-data">
                        <div className={!isMobile ? "profile-flex" : undefined} >
                            <span className="username profile-flex-item">{profileData.username}</span>
                            {
                                isMobile ? <Link to="/Signup"><i className="fas fa-cog fa-2x"></i></Link>
                                    : <div onClick={() => M.toast({ html: 'Edit Profile Button' })} className="profile-flex-item edit-btn white">Edit Profile</div>
                            }

                            {
                                isMobile ? <div><br /><div onClick={() => M.toast({ html: 'Edit Profile Button' })} className="edit-btn white">Edit Profile</div></div>
                                    : <Link className="flex-settings" to="/createpost"><i className="profile-flex-item fas fa-cog fa-2x"></i></Link>
                            }
                        </div>
                    </div>
                </div>
                <span className="full-name"><strong>{profileData.fullName}</strong></span>
                <hr className="hr-profile" />
                <div className="row center">
                    <span className="col s4"><strong>{profileData.posts}</strong><br />posts</span>
                    <span className="col s4"><strong>{profileData.followers}</strong><br />followers</span>
                    <span className="col s4"><strong>{profileData.following}</strong><br />following</span>
                </div>
                <hr className="hr-profile" />
                <div className="my-posts">
                    <img className="img-posts" src={require('../../images/posts.jpg')} alt="posts" />
                    <img className="img-posts" src={require('../../images/posts.jpg')} alt="posts" />
                    <img className="img-posts" src={require('../../images/posts.jpg')} alt="posts" />
                </div>
            </div>
            :
            null
    )
}

export default Profile;