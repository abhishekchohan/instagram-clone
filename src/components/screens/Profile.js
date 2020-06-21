import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';


const Profile = () => {
    const { username } = useParams();
    const history = useHistory();
    const isAuth = useSelector(state => state.isLogged);
    const loggedUser = useSelector(state => state.loggedUser);
    const [userData, setUserData] = useState(null);
    const [follow, setFollow] = useState(false);
    useEffect(() => {
        fetch(`/user/${username}`, {
            method: 'post',
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
    }, [follow])
    const handleFollow = () => {
        fetch(`/user/${username}/follow`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(result => result.json())
            .then(result => {
                if (!result.error) {
                    setFollow(prev => !prev);
                }
            })
            .catch(er => console.log(er))
    }
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

                            <Link className="flex-settings" to="/createpost"><i className="profile-flex-item fas fa-cog fa-2x"></i></Link>
                        </div>
                    </div>
                </div>
                <span className="full-name"><strong>{userData.fullname}</strong></span><br /><br />
                {
                    (userData._id !== loggedUser._id) ? (userData.followers.find(id => id === loggedUser._id) ?
                        < div onClick={handleFollow} className="btn grey" style={{ width: '100%', borderRadius: '0.3rem' }}><strong className="white-text">Unfollow</strong></div>
                        :
                        < div onClick={handleFollow} className="btn blue" style={{ width: '100%', borderRadius: '0.3rem' }}><strong className="white-text">Follow</strong></div>)
                        :
                        <Link to="/profile/edit" >< div className="btn black" style={{ width: '100%', borderRadius: '0.3rem' }}><strong className="white-text">Edit Profile</strong></div></Link>
                }
                <hr className="hr-profile" />
                <div className="row center">
                    <span className="col s4"><strong>{userData.posts.length}</strong><br />posts</span>
                    <Link to={`/${userData._id}/followers`}><span className="col s4"><strong>{userData.followers.length}</strong><br />followers</span></Link>
                    <Link to={`/${userData._id}/following`}><span className="col s4"><strong>{userData.following.length}</strong><br />following</span></Link>
                </div>
                <hr className="hr-profile" />
                <div className="my-posts">
                    {
                        userData.posts.slice(0).reverse().map(post => <Link key={post._id + Math.random()} to={{ pathname: `/${userData._id}/${post._id}` }}><img style={{ width: '100%', height: '8rem' }} src={post.url} alt="posts" /></Link>)
                    }
                </div>
            </div>
            :
            null
    )
}

export default Profile;