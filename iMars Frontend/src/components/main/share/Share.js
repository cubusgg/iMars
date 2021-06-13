import React, {useContext, useRef, useState} from 'react';
import './share.css';
import {Cancel, PermMedia} from "@material-ui/icons";
import {AuthContext} from "../../../context/AuthContext";
import axios from "axios";

const Share = ({ setState }) => {

    const { user } = useContext(AuthContext);
    const desc = useRef();

    const [file, setFile] = useState(null);

    const submitHandler = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("body", desc.current.value);

        if (file) {
            data.append("image", file);
        }

        try {
            await axios.post("/posts", data);
            setState(Date().toLocaleString())
            desc.current.value = ''
            setFile(null)
        } catch (e) {

        }
    }

    return (
        <div className="share bg-white-90 shadow-5">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareImage" src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="logo"/>
                    <input placeholder={`What's in your mind ${user.name}?`} className="shareInput" ref={desc}/>
                </div>
                <hr className="shareHr"/>
                {file && (
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(file)} alt="" />
                        <Cancel className="shareCancel" onClick={() => setFile(null)}/>
                    </div>


                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <label htmlFor="file" className="shareOptions">
                        <div className="shareOption">
                            <PermMedia className="shareIcon"/>
                            <span className="shareOptionText">Photo or Video</span>
                            <input type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])}/>
                        </div>
                    </label>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    );
};

export default Share;
