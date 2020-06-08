import React from "react";

const Post = (props) => {
    // Destructuring the post info into apropriate labels then use them accordingly...
    const { url, caption, _id: id, postedBy: { username }, likes } = props.post;
    /*
    card-home is class overriden of class card which belongs to Materialize-css
    post-top-part = Top part/bottom part of post component where we see user pic, username who posted post along with more buttons like heart, comment,etc.
    image-card => class is from materialize-css
    post-like-part -> Small profile img of current username.
    post-liked-username  -> People who liked the post ( their names, etc..)
    post-comments  -> its a small flex box with 2 elements only and has been used numerous times for different purposes.
    */
    return (
        <div id={id} className="card card-home" style={{ marginBottom: "1rem", padding: "0.3rem" }}>
            <div className="post-top-part">
                <img className="post-profile-pic" width="40" height="40" src={require("../images/profile-pic.jpg")} alt="profile pic" />
                <h6 className="post-username">{username}</h6>
                <i className="post-top-more fas fa-ellipsis-h"></i>
            </div>
            <div className="image-card center">
                <img src={url} alt="img" />
            </div>
            <div className="post-top-part">
                <i className="far fa-heart fa-2x"></i>
                <i className="far fa-comment fa-2x"></i>
                <i className="fab fa-telegram-plane fa-2x"></i>
                <i className="far fa-bookmark fa-2x"></i>
            </div>
            <div className="post-top-part post-like-part">
                {
                    likes.length === 0 ? null : <img className="post-profile-pic" width="20" height="20" src={require("../images/profile-pic.jpg")} alt="profile pic" />
                }
                <h6 className="post-liked-username">
                    {
                        likes.length === 0 ? null : (likes.length === 1 ? <>Liked by {likes[0].username}</> : likes.length === 2 ? <>Liked by {likes[0].username} and {likes[1].username}</> : <>Liked by {likes[0].username} and {likes.length - 1} others</>)
                    }</h6>
            </div>
            <div className="post-top-part post-comments">
                <h6 className="post-comment-username">{username}</h6>
                <h6 className="comment">{caption}</h6>
            </div>
            <div className="post-top-part post-comments">
                <img className="post-profile-pic" width="20" height="20" src={require("../images/profile-pic.jpg")} alt="profile pic" />
                <input className="comment-add" placeholder="Add a comment" type="text" name="comment" />
            </div>
            <div className="post-top-part post-comments">
                <h6 className="post-comment-username">abhi922</h6>
                <h6 className="comment">That's kinda cool </h6>
            </div>
            <div className="post-top-part post-comments">
                <h6 className="post-comment-username">Parnpal</h6>
                <h6 className="comment">This could be little better...</h6>
            </div>
        </div>
    )
}

export default Post;