import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CreatePost from "./CreatePost"
import Post from "../Post";
import { useSelector, useDispatch } from "react-redux";
import { set_hPosts } from "../actions";
import { useParams, useHistory } from 'react-router-dom';



const Home = () => {
    const { id, postId } = useParams();
    //isAuth and posts are two states stored in redux store
    // isAuth tells whether user is logged in or not.
    const isAuth = useSelector(state => state.isLogged);
    const isUpdate = useSelector(state => state.isUpdate);
    // posts conatin aray of posts objects to display  posts on home page.
    const posts = useSelector(state => state.ishposts);
    // loaded state is useed to trigger useEffect after fetch api is loaded and render takes place.
    const [loaded, setLoaded] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        if (isAuth) {
            // // Using ReactDOM.unstable_batchedUpdates to batch the fetch and sts
            ReactDOM.unstable_batchedUpdates(() => {
                // If id is recieved as useParams prop then fetch specific user posts else if postId is recieved then fetch myCollection else home page fetch.
                fetch((id) ? `/user/${id}/posts` : (postId) ? '/myCollections' : '/allposts', {
                    method: (id) ? "post" : "get",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + localStorage.getItem('jwt')
                    }
                })
                    .then(resp => resp.json())
                    .then(resp => {
                        if (!resp.error && resp.posts.length > 0) {
                            dispatch(set_hPosts(resp.posts));
                            if (!loaded) {
                                setLoaded(true);
                            }
                        } else {
                            history.push('/');  //if selected collection or userposts are 0 then display home route.
                        }

                    })
                    .catch(er => console.log(er))
            })
        }
        // eslint-disable-next-line
    }, [isAuth, isUpdate, id, postId]);         // its dependencies

    useEffect(() => {
        // This useEffect will run only when loading is completed and will move the view to the selected div/post 
        if (postId && loaded && posts.find(post => post._id === postId)) {
            document.getElementById(postId).scrollIntoView({ behavior: "smooth", block: "start" })
        }
        // eslint-disable-next-line
    }, [loaded]);

    return (
        <div className="home card-home">
            {
                isAuth &&
                posts && // Only display the block if user is logged in and post array has data from fetch API.
                <div style={{ position: "relative" }}>
                    {(!id && !postId) && <CreatePost />}
                    { // Mapping through the post state array to display all the posts on Page.
                        posts.map(post => {
                            return <Post id={post._id} key={post._id} postId={post._id} post={post} />
                        })
                    }
                </div>
            }
        </div>
    )
}

export default Home;