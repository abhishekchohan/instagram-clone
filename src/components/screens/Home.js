import React, { useEffect } from "react";
import CreatePost from "./CreatePost"
import Post from "../Post";
import { useSelector, useDispatch } from "react-redux";
import { set_hPosts } from "../actions";



const Home = () => {
    //isAuth and posts are two states stored in redux store
    // isAuth tells whether user is logged in or not.
    const isAuth = useSelector(state => state.isLogged);
    // posts conatin aray of posts objects to display  posts on home page.
    const posts = useSelector(state => state.ishposts);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isAuth) {
            // // Using ReactDOM.unstable_batchedUpdates to batch the fetch and sts
            // ReactDOM.unstable_batchedUpdates(() => {
            fetch('/allposts', {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
                .then(resp => resp.json())
                .then(resp => {
                    dispatch(set_hPosts(resp.posts));
                })
                .catch(er => console.log(er))
            // })
        }
        // eslint-disable-next-line
    }, [isAuth]);

    return (
        <div className="home card-home">
            {
                isAuth &&
                posts &&
                <div style={{ position: "relative" }}>
                    <CreatePost />
                    {
                        posts.map(post => {
                            return <Post key={post._id} post={post} />
                        })
                    }
                </div>

            }

        </div>
    )
}

export default Home;