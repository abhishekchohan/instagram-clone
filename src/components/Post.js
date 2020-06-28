import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { update_data } from "../components/actions";
import isMobile from "react-device-detect";
import { Link } from "react-router-dom";
import M from "materialize-css";

const Post = (props) => {
    const mydata = useSelector(state => state.loggedUser);
    const dispatch = useDispatch();
    // Destructuring the post info into apropriate labels then use them accordingly...
    const { url, caption, _id: id, postedBy: { _id: postedId, username, dp }, likes, comments } = props.post;
    // stste management for comment form field
    const [comment, setComment] = useState("");

    // like button functionality..
    const like = () => {
        fetch("/like", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ postId: id })
        })
            .then(data => data.json())
            .then(data => dispatch(update_data()))
            .catch(er => console.log(er));
    }

    const handleFavPost = () => {
        fetch("/post/favPost", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ postId: id })
        })
            .then(data => data.json())
            .then(data => dispatch(update_data()))
            .catch(er => console.log(er));
    }



    // post comment function..
    const postcomment = e => {
        e.preventDefault();
        fetch("/postcomment", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ postId: id, comment })
        })
            .then(data => data.json())
            .then(data => dispatch(update_data()))
            .catch(er => console.log(er));
        setComment("");
    }

    // controlled input form
    const handleComment = e => {
        const value = e.target.value;
        setComment(value);
    }

    const handleDelete = e => {
        const id = e.target.parentElement.parentElement.parentElement.id;
        // if (!confirm("Do you really want to delete this post ?")) return;
        if (username === mydata.username) {
            fetch(`/${id}/delete`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem('jwt')
                }
            })
                .then(result => result.json())
                .then(result => dispatch(update_data()))
                .catch(er => console.log(er))
        }
    }

    const handleShare = e => {
        const id = e.target.parentElement.parentElement.parentElement.id;
        const username = e.target.parentElement.parentElement.parentElement.dataset.username;
        let link = String(window.location).split('/', 3);
        alert(`Share with your friends -> ${link[0]}//${link[2]}/${username}/${id}`);
    }

    /*
    card-home is class overriden of class card which belongs to Materialize-css
    post-top-part = Top part/bottom part of post component where we see user pic, username who posted post along with more buttons like heart, comment,etc.
    image-card => class is from materialize-css
    post-like-part -> Small profile img of current username.
    post-liked-username  -> People who liked the post ( their names, etc..)
    post-comments  -> its a small flex box with 2 elements only and has been used numerous times for different purposes.
    */
    return (
        <div id={id} data-username={postedId} className="card card-home" style={{ marginBottom: "1rem", padding: "0.3rem" }}>
            <div className="post-top-part">
                <Link to={`/user/${username}`}><img style={{ marginTop: '0.5rem' }} className="post-profile-pic" width="40" height="40" src={dp || require('../images/profile-pic.jpg')} alt="profile pic" /></Link>
                <h6 className="post-username"><strong><Link to={`/user/${username}`}>{username}</Link></strong></h6>
                {
                    username === mydata.username ?
                        <i onClick={(e) => M.Dropdown.init(e.target).open()} data-target='dropdown1' style={{ padding: '0.5rem 1rem' }} className="post-top-more fas fa-ellipsis-h"></i>
                        :
                        <i onClick={(e) => M.Dropdown.init(e.target).open()} data-target='dropdown2' style={{ padding: '0.5rem 1rem' }} className="post-top-more fas fa-ellipsis-h"></i>
                }
                {
                    username === mydata.username ?
                        <ul id='dropdown1' className='dropdown-content'>
                            <li className="dropdown-options" onClick={handleDelete}>Delete</li>
                            <li className="dropdown-options" onClick={handleShare}>Share</li>
                        </ul>
                        :
                        <ul id='dropdown2' className='dropdown-content'>
                            <li className="dropdown-options" onClick={handleShare}>Share</li>
                        </ul>
                }
            </div>

            <div className="image-card center">
                <img onDoubleClick={like} style={isMobile && { cursor: 'pointer' }} src={url} alt="img" width="100%" />
            </div>

            <div className="post-top-part">
                {
                    // Checking whether the current user liked the post or not to display heart in red or white color
                    likes.find(my => my.username === mydata.username) === undefined ?
                        <i onClick={like} className="far fa-heart fa-2x"></i> :
                        <i onClick={like} className="fa red-text fa-heart fa-2x" aria-hidden="true"></i>
                }
                <Link to={`/${id}/comments`}><i className="far fa-comment fa-2x"></i></Link>
                <i data-id={props.postId} onClick={handleDelete} className="fab fa-telegram-plane fa-2x"></i>
                {
                    mydata.favPosts.find(eachFav => eachFav === id) === undefined ? <i onClick={handleFavPost} className="far fa-bookmark fa-2x"></i> :
                        <i onClick={handleFavPost} className="fas fa-bookmark fa-2x"></i>
                }
            </div>
            <div className="post-top-part post-like-part">
                <span style={{ marginLeft: "1rem" }}></span>
                <h6 className="post-liked-username">
                    {
                        // Liked by bla bla and others ... conditions
                        likes.length === 0 ? null : (likes.length === 1 ? <>Liked by <Link to={`/user/${likes[0].username}`} ><strong>{likes[0].username}</strong></Link></> : likes.length === 2 ? <>Liked by <Link to={`/user/${likes[0].username}`} ><strong>{likes[0].username}</strong></Link> and <Link to={`/user/${likes[1].username}`} ><strong>{likes[1].username}</strong></Link></> : <>Liked by <Link to={`/user/${likes[0].username}`} ><strong>{likes[0].username}</strong></Link> and <Link to={`/user/${likes[1].username}`} ></Link> <Link to={`/${id}/likes`} ><strong>{likes.length - 1} others</strong></Link></>)
                    }</h6>
            </div>
            {
                // caption and username // kind of comment but part of post
            }
            <div className="post-top-part post-comments">
                <h6 className="post-comment-username" style={{ paddingBottom: '0.2rem' }}><Link to={`/user/${username}`}><strong>{username}</strong></Link></h6>
                <h6 className="comment">{caption}</h6>
            </div>
            {
                // slicing the comments to extract latest 2 comments only to display
                comments.slice(-1, comments.length).map(each => {
                    // using random to generate a random key for each comment
                    return <div key={each.by._id + Math.random()} className="post-top-part post-comments">
                        <h6 className="post-comment-username" style={{ paddingBottom: '0.2rem' }}> <Link to={`/user/${each.by.username}`}><strong>{each.by.username}</strong></Link></h6>
                        <h6 className="comment">{each.comment} </h6>
                    </div>
                })
            }
            {
                // text only displayed if there are more than 1 comment or atleast 2..
                comments.length > 1 && <div style={{ marginLeft: '1rem' }}><Link to={`/${id}/comments`}><strong>View all comments.</strong></Link></div>
            }
            <div className="post-top-part post-comments">
                <img className="post-profile-pic" width="18" height="18" src={mydata.dp || require('../images/profile-pic.jpg')} alt="profile pic" />
                <form className="comment-add" onSubmit={postcomment}>
                    <input className="comment-add" placeholder="Add a comment"
                        type="text" name="comment" value={comment} onChange={handleComment} autoComplete="off" spellCheck={false} />
                </form>
            </div>
        </div>
    )
}

export default Post;