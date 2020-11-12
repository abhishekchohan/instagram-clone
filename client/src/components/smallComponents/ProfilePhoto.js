import React, { useState, useEffect } from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useSelector, useDispatch } from "react-redux";
import { set_loggedUser, update_data } from "../actions";
import { useHistory } from "react-router-dom";
import "./smallComponents.css";

const ProfilePhoto = () => {

    const dispactch = useDispatch();
    const history = useHistory();
    // getting logged user info from state
    const loggedUser = useSelector(state => state.loggedUser);
    // state to know whether user is logged in or not.
    const isAuth = useSelector(state => state.isLogged);
    // Local state to store selected file and display it 
    const [file, setFile] = useState(null)
    //  local state to trigger useEffect to send/upload image to server
    const [send, setSend] = useState(null);
    // state to store image/selected file
    const [image, setImage] = useState(null);
    // ReactCrop component's crop state
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, aspect: 1 / 1 });

    //  ReactCreate provided function to t cropped image after transformation
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

    // controlled form to handle change in file input
    const onChangeHandler = event => {
        const url = event.target.files[0];
        if (url) {
            setFile(URL.createObjectURL(url));
        } else {
            setFile(null);
        }

    }

    // handle actual upload of image to serve
    const handleUpload = e => {
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
                // trigger the useEffect with file url as state
                setSend(data.url);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        // if send is true or has value then execute block
        if (send) {
            fetch('/updateProfilePhoto', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    dp: send,
                    username: loggedUser.username
                })
            })
                .then(resp => resp.json())
                .then(result => {
                    // set new user data to the redux logeduser state
                    dispactch(set_loggedUser(result.user));
                    dispactch(update_data()); // set state to trigger use effects where data needs to be changed in other components
                    history.goBack();   //goback to previous pae
                })
                .catch(er => console.log(er))
        }
        //eslint-disable-next-line
    }, [send])

    return (
        <>
            {  // here only shows the form and image data based on file selected..
                isAuth && <div className="card home card-home">
                    <div>

                        <div>
                            <label htmlFor="file-input" className="btn btn-large blue pp-selectBtn">Select</label>
                            {file && <span style={{ marginLeft: '40%' }} onClick={handleUpload} className="btn btn-large blue pp-selectBtn">Upload</span>}
                        </div>

                        <input style={{ "display": "none" }} id="file-input" type="file" accept="image/png, image/jpeg" files={file} onChange={onChangeHandler} />
                    </div>
                    {
                        file && <div >
                            <ReactCrop onImageLoaded={setImage} src={file} crop={crop} keepSelection circularCrop onChange={setCrop} />
                        </div>
                    }
                </div>

            }
        </>
    )

}

export default ProfilePhoto;