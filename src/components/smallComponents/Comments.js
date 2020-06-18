import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Comments = () => {

    const { postId } = useParams();
    const [comments, setComments] = useState(null);
    const history = useHistory();
    const [comment, setComment] = useState("");
    const [update, setUpdate] = useState();
    const { dp, username } = useSelector(state => state.loggedUser);
    useEffect(() => {
        fetch(`/${postId}/comments`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => resp.json())
            .then(result => {
                setComments(result.comments.comments);
            })
            .catch(er => console.log(er))
        //eslint-disable-next-line
    }, [update])
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
            .then(data => setUpdate(true))
            .catch(er => console.log(er));
        setComment("");
    }

    // controlled input form
    const handleComment = e => {
        const value = e.target.value;
        setComment(value);
    }
    return (
        <div className="home card card-home" style={{ marginTop: '5rem', marginBottom: "1rem", padding: "0.3rem", minHeight: '75vh' }}>
            {
                comments && (
                    <div>
                        <div className="post-top-part">
                            <i onClick={history.goBack} style={{ marginTop: '0.4rem' }} className="fas fa-chevron-left fa-2x"></i>
                            <i style={{ marginLeft: 'auto' }} className="fa-2x">Comments</i>
                            <i style={{ marginLeft: 'auto' }} className="fab fa-telegram-plane fa-2x"></i>
                        </div>
                        <hr />
                        <div style={{ position: 'relative', marginBottom: '4rem' }}>
                            {
                                comments.map(each => {
                                    // using random to generate a random key for each comment
                                    return <div key={each._id} className="post-top-part post-comments" style={{ margin: '1rem' }}>
                                        <Link to={`/user/${each.by.username}`} >
                                            <img style={{ marginTop: '-5px', marginRight: '-5px' }} className="post-profile-pic" width="35" height="35" src={each.by.dp} alt="profile pic" />
                                        </Link>
                                        <h6 className="post-comment-username"><Link to={`/user/${each.by.username}`} ><strong>{each.by.username}</strong></Link></h6>
                                        <h6 className="comment">{each.comment} </h6>
                                    </div>
                                })
                            }
                        </div>
                        <div className="post-top-part post-comments" style={{ position: 'absolute', bottom: 10 }}>
                            <Link to={`/user/${username}`} ><img style={{ marginTop: '-5px', marginLeft: '2rem' }} className="post-profile-pic" width="35" height="35" src={dp} alt="profile pic" /></Link>
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