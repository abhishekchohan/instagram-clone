import React, { useState, useEffect } from 'react';
import M from "materialize-css";
import { useSelector, useDispatch } from "react-redux";
import { update_hPosts } from '../actions';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Create Post Component..
const CreatePost = () => {
    // global redux store state..
    const isAuth = useSelector(state => state.isLogged);
    const dispatch = useDispatch();
    const [post, setPost] = useState({
        file: null,
        caption: "",
        url: ""
    });
    // using this local state to trigger send in useState..
    const [send, setSend] = useState(false);
    const { file, caption, url } = post;
    // local states..
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 30, width: 100 });

    // This function is provided by the ReactCrop component to process image
    function getCroppedImg(image, crop) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );
        return canvas.toDataURL('image/png');
    }

    // Form on change event handler
    const onChangeHandler = event => {
        if (event.target.name === "caption") {  // checking if the event is triggered by caption input
            const caption = event.target.value;
            setPost(prev => {
                return { ...prev, caption }
            });
        } else { // else its a file input change event
            if (event.target.files[0]) {
                const uri = event.target.files[0];
                const file = URL.createObjectURL(event.target.files[0]);
                setPost(prev => {
                    return { ...prev, file: file, url: uri }
                });
            } else {
                setPost({ caption: "", url: "", file: null });
            }
        }
    }


    // File upload to cloudinary api....
    const handleForm = e => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", getCroppedImg(image, crop));
        data.append("upload_preset", `${process.env.REACT_APP_upload_preset}`);
        data.append("cloud_name", `${process.env.REACT_APP_cloud_name}`);
        fetch(`${process.env.REACT_APP_IMAGE_API}`, {
            method: "post",
            body: data
        })
            .then(response => response.json())
            .then(data => {
                setPost(prev => { return { ...prev, url: data.url } })
                setSend(prev => !prev)  // here we trigger the useSate to send post data..
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        // first trigger doesnt do anything but then it send only when triggered by the send satate change..
        if (send) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    url: url,
                    caption: caption
                })
            })
                .then(resp => resp.json())
                .then(result => {
                    dispatch(update_hPosts(result.post))
                    if (result.error) {
                        M.toast({ html: result.error, classes: "red darken-1" })
                    }
                    else {
                        setPost({ caption: "", url: "", file: null })
                        M.toast({ html: result.message, classes: "blue darken-1" })
                    }
                })
                .catch(err => console.log(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [send])

    return (<>

        {  // here only shows the form and image data based on file selected..
            isAuth && (
                file ? // display the selected image file and form to home screen
                    <form method="post" className="card-home card" onSubmit={handleForm}>
                        <i onClick={() => setPost({ caption: "", url: "", file: null })} className="fas fa-times fa-2x right"></i>
                        <div >
                            <ReactCrop width="100%" onImageLoaded={setImage} src={file} crop={crop} keepSelection="true" onChange={setCrop} />
                        </div>
                        <label htmlFor="file-input">
                            {/* <img src={file} alt="img"  /> */}
                        </label>
                        <input style={{ "display": "none" }} id="file-input" type="file" accept="image/png, image/jpeg" files={file} onChange={onChangeHandler} />
                        <div className="post-top-part post-comments">
                            <input required={true} style={{ marginLeft: "1rem" }} value={caption} onChange={onChangeHandler} autoFocus="on" className="comment-add" autoComplete="off" type="text" name="caption" id="input_text" maxLength="100" placeholder="Add a caption" />
                            <button style={{ marginTop: "-0.5rem" }} className="blue white-text darken-1 post-comment-username"> Post </button>
                        </div>
                    </form>
                    :   // else display the floating button to add new post..
                    <div>
                        <label htmlFor="file-input">
                            <div style={{ display: "absolute", position: "fixed", zIndex: 8, bottom: 10, right: 20 }}>
                                <span className="btn-floating btn-large red"><i className="fas fa-plus"></i></span>
                            </div>
                        </label>
                        <input style={{ "display": "none" }} id="file-input" type="file" accept="image/png, image/jpeg" files={file} onChange={onChangeHandler} />
                    </div>)

        }
    </>
    )
}

export default CreatePost;