import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Likes = () => {

    const { postId } = useParams();
    const [likes, setLikes] = useState(null);
    const history = useHistory();

    useEffect(() => {
        fetch(`/${postId}/likes`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(resp => resp.json())
            .then(result => {
                setLikes(result.likes.likes);
            })
            .catch(er => console.log(er))
        //eslint-disable-next-line
    }, [])


    return <div className="home card card-home" style={{ marginTop: '5rem', marginBottom: "1rem", padding: "0.3rem", minHeight: '75vh' }}>
        {
            likes && (
                <div>
                    <div className="post-top-part">
                        <i onClick={history.goBack} style={{ marginTop: '0.4rem' }} className="fas fa-chevron-left fa-2x"></i>
                        <i style={{ marginLeft: 'auto' }} className="fa-2x">Likes</i>
                        <i style={{ marginLeft: 'auto' }}>   </i>
                    </div>
                    <hr />
                    <div style={{ position: 'relative', marginBottom: '4rem' }}>
                        {
                            likes.map(each => {
                                // using random to generate a random key for each comment
                                return <div key={each._id} className="post-top-part post-comments" style={{ margin: '1rem' }}>
                                    <Link to={`/user/${each.username}`} >
                                        <img style={{ marginTop: '-5px', marginRight: '-5px' }} className="post-profile-pic" width="50" height="50" src={each.dp || require('../../images/profile-pic.jpg')} alt="." />
                                    </Link>
                                    <Link to={`/user/${each.username}`} ><div style={{ marginTop: '-0.4rem', Width: '50%' }}>
                                        <h6 className="post-comment-username" style={{ height: '1rem', overflowY: 'hidden' }}><strong>{each.username}</strong></h6>
                                        <h6 className="post-comment-username">{each.fullname}</h6>
                                    </div></Link>
                                    <div className="btn blue" style={{ width: '30%', marginRight: '3rem', marginLeft: 'auto', borderRadius: '0.3rem' }}><strong className="white-text">Follow</strong></div>
                                </div>
                            })
                        }
                    </div>
                </div>
            )
        }
    </div>
}

export default Likes;