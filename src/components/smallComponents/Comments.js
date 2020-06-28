import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./smallComponents.css";

const Comments = () => {

    //postId is recieved as a prop from Link
    const { postId } = useParams();
    const history = useHistory();
    // comments is local state that store all the comments
    const [comments, setComments] = useState(null);
    // comment is a local state that store single comment posted by user
    const [comment, setComment] = useState("");
    // update is used as a state to trigger useEffect whenever there is some new data to be fetch..
    const [update, setUpdate] = useState(false);
    // Destructuring of logged user state into dp, username constants to use later 
    const { dp, username } = useSelector(state => state.loggedUser);

    useEffect(() => {
        // Fetch all comments on selected post from database
        fetch(`/${postId}/comments`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => resp.json())
            .then(result => {
                if (!result.error) {
                    // set all received comments from response to comments state
                    setComments(result.comments.comments);
                }
            })
            .catch(er => console.log(er))
        //eslint-disable-next-line
    }, [update]);

    // post comment function..
    const postcomment = e => {
        e.preventDefault();
        fetch("/postcomment", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ postId, comment })
        })
            .then(data => data.json())
            //we will trigger the useEffect to run again to fetch new data
            .then(data => setUpdate(prev => !prev))
            .catch(er => console.log(er));
        // reset the state to empty
        setComment("");
    }

    // controlled input form
    const handleComment = e => {
        const value = e.target.value;
        setComment(value);
    }
    return (
        <div className="card card-home comment-card">
            {
                comments && (
                    <div className="mainDiv">
                        {/* Top part with a back button, Title and send message icon */}
                        <div className="post-top-part">
                            <i onClick={history.goBack} style={{ marginTop: '0.4rem' }} className="fas fa-chevron-left fa-2x"></i>
                            <i style={{ marginLeft: 'auto' }} className="fa-2x">Comments</i>
                            <i style={{ marginLeft: 'auto' }} className="fab fa-telegram-plane fa-2x"></i>
                        </div>
                        <hr />
                        {/*  Below is the list of all the comments on particular post */}
                        <div className="commentsDiv">
                            {
                                comments.map(each => {
                                    // using random to generate a random key for each comment
                                    return <div key={each._id} className="post-top-part post-comments" style={{ padding: '5px' }}>
                                        <Link to={`/user/${each.by.username}`} >
                                            <img style={{ marginTop: '-5px', marginRight: '-5px' }} className="post-profile-pic" width="35" height="35" src={each.by.dp || require('../../images/profile-pic.jpg')} alt="profile pic" />
                                        </Link>
                                        <h6 className="post-comment-username"><Link to={`/user/${each.by.username}`} ><strong>{each.by.username}</strong></Link></h6>
                                        <h6 className="comment">{each.comment} </h6>
                                    </div>
                                })
                            }
                        </div>
                        <div className="post-top-part post-comments" style={{ position: 'absolute', bottom: 10 }}>
                            <Link to={`/user/${username}`} ><img className="post-profile-pic newCommentImg" width="35" height="35" src={dp || require('../../images/profile-pic.jpg')} alt="profile pic" /></Link>
                            <form className="comment-add" onSubmit={postcomment}>
                                <input className="comment-add" placeholder="Add a comment"
                                    type="text" name="comment" value={comment} onChange={handleComment} autoComplete="off" spellCheck={false} />
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Comments;