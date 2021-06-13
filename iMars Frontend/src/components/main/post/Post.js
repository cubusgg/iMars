import React, {useContext, useRef, useState} from 'react';
import './post.css';
import rocketPng from '../../../assets/post/rocket.png';
import likedRocketPng from '../../../assets/post/likedrocket.png';
import axios from "axios";
import { format } from 'timeago.js';
import {Link} from "react-router-dom";
import Comment from "../comment/Comment";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {AuthContext} from "../../../context/AuthContext";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";

const Post = ({ post, likes, liked, postUser, setState}) => {
    const { user } = useContext(AuthContext);

    const textField = useRef('');
    const desc = useRef('');

    const [numberOfLikes, setNumberOfLikes] = useState(likes);
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [visibility, setVisibility] = useState(false);
    const [comments, setComments] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickButton = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickOpenEdit = () => {
        setOpenEdit(true)
    };

    const handleClickOpenDelete = () => {
        setOpenDelete(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenEdit(false);
        setOpenDelete(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/posts/${post.id}`);
            handleClose();
            setState(Date().toLocaleString())
        } catch (e) {
            console.log(e)
        }
    }

    const handleEdit = async () => {
        try {
            await axios.patch(`/posts/${post.id}`, { body: textField.current.value })
            handleClose();
            setState(Date().toLocaleString())
        } catch (e) {
            console.log(e)
        }
    }

    const rocketHandler = async () => {
        const res = await axios.get(`/posts/${post.id}/like`)
        if (likedByCurrentUser) {
            setNumberOfLikes(res.data.likes);
            setLikedByCurrentUser(res.data.liked);
        } else {
            setNumberOfLikes(res.data.likes);
            setLikedByCurrentUser(res.data.liked);
        }
    }

    const toggleComents = () => {
        getComments(post.id)
        setVisibility(!visibility);
    }

    const getComments = async (id) => {
        const res = await axios.get(`/posts/${id}/comments`)
        setComments(res.data)
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("body", desc.current.value);
        desc.current.value = ''
        try {
            await axios.post(`/posts/${post.id}/comments`, data);
            getComments(post.id)
        } catch (e) {

        }
    }

    return (
        <div className="post bg-white-90 shadow-5">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${postUser.id}`}>
                            {postUser && <img src={postUser.avatar ? `http://localhost:8000/storage/${postUser.avatar}` : `https://eu.ui-avatars.com/api/?name=${postUser.name + ' ' + postUser.lastname}`} alt="postProfileImage" className="postProfileImage"/>}
                        </Link>
                        {postUser && <span className="postUsername">{postUser.name} {postUser.lastname}</span>}
                        <span className="postDate">{format(post.created_at)}</span>
                    </div>
                    {user.id === post.user_id && <div className="postTopRight">

                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickButton}>
                            <b>...</b>
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClickOpenEdit}>Edit</MenuItem>
                            <Dialog open={openEdit} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        To edit this post, enter a different content below.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="content"
                                        type="text"
                                        inputRef={textField}
                                        fullWidth
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleEdit} color="primary">
                                        Agree
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <MenuItem onClick={handleClickOpenDelete}>Delete</MenuItem>
                            <Dialog
                                open={openDelete}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Do you really want to delete this post?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        Disagree
                                    </Button>
                                    <Button onClick={handleDelete} color="primary" autoFocus>
                                        Agree
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Menu>

                    </div>}
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.body}</span>
                    {post.image && <img className="postImage" src={`http://localhost:8000/storage/${post.image}`} alt="imgpost"/>}
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="rocketButton" src={likedByCurrentUser ? likedRocketPng : rocketPng} onClick={rocketHandler} alt="rocketpng"/>
                        <span className="postRocketCounter">{numberOfLikes} people launched it into space</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText" onClick={toggleComents}>comments</span>
                    </div>
                </div>

                {visibility && (
                    <div>
                        <form className="postComments" onSubmit={submitHandler}>
                            <input placeholder="Write a comment..." className="commentInput bg-white-90" ref={desc}/>
                            <button className="shareButton" type="submit" onClick={submitHandler}>Share</button>
                        </form>

                        <div className="comments">
                        {comments.map((p) => (
                            <Comment key={p.comment.id} comment={p.comment} likes={p.likes} liked={p.liked} commentUser={p.user} getComments={getComments} />
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Post;
