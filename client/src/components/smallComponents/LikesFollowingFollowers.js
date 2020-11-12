import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./smallComponents.css";

const LikesFollowingFollowers = () => {

    const history = useHistory();
    // postId, userId and task are props recievd from Link
    const { postId, userId, task } = useParams();
    //  local state to store likes, followrs or following data respectively
    const [data, setData] = useState(null);
    // getting logged user info from state
    const loggedUser = useSelector(state => state.loggedUser);
    // state to know whether user is logged in or not.
    const isAuth = useSelector(state => state.isLogged);
    // follow state to triger useEffect to fetch new data
    const [follow, setFollow] = useState(false);

    useEffect(() => {
        //  if we recieve postId in Link then run first fetch else other for task => following or followers 
        fetch((postId) ? `/${postId}/likes` : `/followersOrFollowings/${userId}/${task}`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => resp.json())
            .then(result => {
                // if we recieve likes key in response object
                if (result.likes) {
                    setData(result.likes.likes);
                } else if (result.followers) {    // else if object returns followers else followings
                    setData(result.followers.followers);
                } else {
                    setData(result.following.following);
                }
            })
            .catch(er => console.log(er))
        //eslint-disable-next-line
    }, [follow])

    // whenver follow or unfollow button is clicked, handlefollow handles the request
    const handleFollow = (username) => {
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
                    // trigger the useEffect to fetch new data
                    setFollow(prev => !prev);
                }
            })
            .catch(er => console.log(er))
    }

    return <div className="home card card-home lff-card">
        {
            isAuth && data && (
                <div>
                    <div className="post-top-part">
                        {/* Top header part with back btn and respective heading */}
                        <i onClick={history.goBack} style={{ marginTop: '0.4rem' }} className="fas fa-chevron-left fa-2x"></i>
                        <i style={{ marginLeft: 'auto' }} className="fa-2x">{(postId) ? "Likes" : task}</i>
                        <i style={{ marginLeft: 'auto' }}>   </i>
                    </div>
                    <hr />
                    <div className="llf-DataDiv">
                        {
                            data.map(each => {
                                // using random to generate a random key for each comment
                                return <div key={each._id} className="post-top-part post-comments" style={{ margin: '1rem 0' }}>
                                    <Link to={`/user/${each.username}`} >
                                        <img className="llf-img post-profile-pic" width="50" height="50" src={each.dp || require('../../images/profile-pic.jpg')} alt="." />
                                    </Link>
                                    {/* username and full name of user in the list */}
                                    <Link to={`/user/${each.username}`} ><div className="lff-userDetails">
                                        <h6 style={{ paddingBottom: '0.2rem' }} className="post-comment-username"><strong>{each.username}</strong></h6>
                                        <h6 className="post-comment-username">{each.fullname}</h6>
                                    </div></Link>
                                    {
                                        // if we are already following the user then grey colored unfollow btn else blue follow
                                        (each._id !== loggedUser._id) && (each.followers.find(id => id === loggedUser._id) ?
                                            < div onClick={(e) => handleFollow(each.username)} className="btn grey lff-followBtn"><strong className="white-text">Unfollow</strong></div>
                                            :
                                            < div onClick={(e) => handleFollow(each.username)} className="btn blue lff-followBtn"><strong className="white-text">Follow</strong></div>)
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            )
        }
    </div>
}

export default LikesFollowingFollowers;