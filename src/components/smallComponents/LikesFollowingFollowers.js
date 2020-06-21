import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const LikesFollowingFollowers = () => {

    const { postId, userId, task } = useParams();
    const [data, setData] = useState(null);
    const history = useHistory();
    const loggedUser = useSelector(state => state.loggedUser);
    const isAuth = useSelector(state => state.isLogged);
    const [follow, setFollow] = useState(false);
    useEffect(() => {
        fetch((postId) ? `/${postId}/likes` : `/followersOrFollowings/${userId}/${task}`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => resp.json())
            .then(result => {
                console.log(result);
                if (result.likes) {
                    setData(result.likes.likes);
                } else if (result.followers) {
                    setData(result.followers.followers);
                } else {
                    setData(result.following.following);
                }
            })
            .catch(er => console.log(er))
        //eslint-disable-next-line
    }, [follow])

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
                    setFollow(prev => !prev);
                }
            })
            .catch(er => console.log(er))
    }

    return <div className="home card card-home" style={{ minHeight: '65vh' }}>
        {
            isAuth && data && (
                <div>
                    <div className="post-top-part">
                        <i onClick={history.goBack} style={{ marginTop: '0.4rem' }} className="fas fa-chevron-left fa-2x"></i>
                        <i style={{ marginLeft: 'auto' }} className="fa-2x">{(postId) ? "Likes" : task}</i>
                        <i style={{ marginLeft: 'auto' }}>   </i>
                    </div>
                    <hr />
                    <div style={{ position: 'relative', marginBottom: '4rem' }}>
                        {
                            data.map(each => {
                                // using random to generate a random key for each comment
                                return <div key={each._id} className="post-top-part post-comments" style={{ margin: '1rem 0' }}>
                                    <Link to={`/user/${each.username}`} >
                                        <img style={{ marginTop: '-5px', marginRight: '-5px' }} className="post-profile-pic" width="50" height="50" src={each.dp || require('../../images/profile-pic.jpg')} alt="." />
                                    </Link>
                                    <Link to={`/user/${each.username}`} ><div style={{ marginTop: '-0.4rem', Width: '50%' }}>
                                        <h6 className="post-comment-username" style={{ height: '1rem', overflowY: 'hidden' }}><strong>{each.username}</strong></h6>
                                        <h6 className="post-comment-username">{each.fullname}</h6>
                                    </div></Link>
                                    {
                                        (each._id !== loggedUser._id) && (each.followers.find(id => id === loggedUser._id) ?
                                            < div onClick={(e) => handleFollow(each.username)} className="btn grey" style={{ width: '30%', marginRight: '1rem', marginLeft: 'auto', borderRadius: '0.3rem' }}><strong className="white-text">Unfollow</strong></div>
                                            :
                                            < div onClick={(e) => handleFollow(each.username)} className="btn blue" style={{ width: '30%', marginRight: '1rem', marginLeft: 'auto', borderRadius: '0.3rem' }}><strong className="white-text">Follow</strong></div>)
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