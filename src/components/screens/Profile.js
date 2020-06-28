import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

const Profile = () => {
    const { username } = useParams();
    const history = useHistory();
    // isAuth to verify if user is already logged in or not.
    const isAuth = useSelector(state => state.isLogged);
    // logged user will get logged user info from store.
    const loggedUser = useSelector(state => state.loggedUser);
    // local states for handling profile data.
    const [userData, setUserData] = useState(null);
    // local state to trigger useEffect after follow or unfollow a user
    const [follow, setFollow] = useState(false);
    //local state to triger  useEffect to fetch different data.
    const [favPosts, setFavPosts] = useState(false);
    // a counter to put in as a uniue key for map array.
    let count = 0;

    useEffect(() => {
        // Fetch my favposts or myposts depending on the  favPosts state.
        fetch((favPosts) ? `/retrieve/favposts` : `/user/${username}`, {
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
    }, [follow, favPosts])


    const handleFollow = () => {
        // Handle follow/unfollow requests
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
                    // triggers useEffect to re-render updated view.
                    setFollow(prev => !prev);
                }
            })
            .catch(er => console.log(er))
    }
    return (
        isAuth && userData ?
            <div className="profile card-home home">
                {/* Top part with user dp & username */}
                <div className="profile-info row">
                    <div className="col s4 left">
                        <img className="profile-img" src={userData.dp || require('../../images/profile-pic.jpg')} alt="profile-img" />
                    </div>
                    <div className="col s8 profile-data">
                        <div className={"profile-flex"} >
                            <span className="username profile-flex-item">{username}</span>
                        </div>
                    </div>
                </div>
                {/* Prinitng full name of user */}
                <span className="full-name"><strong>{userData.fullname}</strong></span><br /><br />
                {
                    /* if its logged user's own profile then display follow & unfollow button else edit profile and show fav/mypost buttons. */
                    (userData._id !== loggedUser._id) ? (userData.followers.find(id => id === loggedUser._id) ?
                        < div onClick={handleFollow} className="btn grey" style={{ width: '100%', borderRadius: '0.3rem' }}><strong className="white-text">Unfollow</strong></div>
                        :
                        < div onClick={handleFollow} className="btn blue" style={{ width: '100%', borderRadius: '0.3rem' }}><strong className="white-text">Follow</strong></div>)
                        :
                        <div>
                            <Link to="/profile/edit" >< div className="btn black" style={{ width: '48%', marginLeft: '2%', borderRadius: '0.3rem' }}><strong className="white-text">Edit Profile</strong></div></Link>
                            {(favPosts) ? < div className="btn black" onClick={() => setFavPosts(false)} style={{ width: '48%', marginLeft: '2%', borderRadius: '0.3rem' }}><strong className="white-text">Show My Posts</strong></div> :
                                < div className="btn black" onClick={() => setFavPosts(true)} style={{ width: '48%', marginLeft: '2%', borderRadius: '0.3rem' }}><strong className="white-text">Show Favourites</strong></div>}
                        </div>
                }
                <hr className="hr-profile" />
                {/* Display of number of posts, followers, followings for the user */}
                <div className="row center">
                    <span className="col s4"><strong>{userData.posts.length}</strong><br />posts</span>
                    <Link to={`/followering/${userData._id}/followers`}><span className="col s4"><strong>{userData.followers.length}</strong><br />followers</span></Link>
                    <Link to={`/followering/${userData._id}/following`}><span className="col s4"><strong>{userData.following.length}</strong><br />following</span></Link>
                </div>
                <hr className="hr-profile" />
                {/* display favposts or myposts depending on the state of favPosts */}
                <div className="my-posts">
                    {
                        (favPosts) ?
                            userData.favPosts.slice(0).reverse().map(post => <Link key={++count} to={{ pathname: `/myCollection/${post._id}` }}><img style={{ width: '100%', height: '8rem' }} src={post.url} alt="posts" /></Link>)
                            :
                            userData.posts.slice(0).reverse().map(post => <Link key={++count} to={{ pathname: `/${userData._id}/${post._id}` }}><img style={{ width: '100%', height: '8rem' }} src={post.url} alt="posts" /></Link>)
                    }
                </div>
            </div>
            :
            null
    )
}

export default Profile;