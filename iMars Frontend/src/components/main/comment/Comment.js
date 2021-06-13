import React, {useContext, useRef, useState} from 'react';
import './comment.css';
import rocketPng from '../../../assets/post/rocket.png';
import likedRocketPng from '../../../assets/post/likedrocket.png';
import axios from "axios";
import { format } from 'timeago.js';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {AuthContext} from "../../../context/AuthContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";

const Comment = ({ comment, likes, liked, commentUser, getComments }) => {

    const textField = useRef('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [numberOfLikes, setNumberOfLikes] = useState(likes);
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(liked);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const { user } = useContext(AuthContext);

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
            await axios.delete(`/comments/${comment.id}`);
            handleClose();
            getComments(comment.post_id);
        } catch (e) {
            console.log(e)
        }
    }

    const handleEdit = async () => {
        try {
            await axios.patch(`/comments/${comment.id}`, { body: textField.current.value })
            handleClose();
            getComments(comment.post_id);
        } catch (e) {
            console.log(e)
        }
    }

    const rocketHandler = async () => {
        try {
            const res = await axios.get(`/comments/${comment.id}/like`)
            if (likedByCurrentUser) {
                setNumberOfLikes(res.data.likes);
                setLikedByCurrentUser(res.data.liked);
            } else {
                setNumberOfLikes(res.data.likes);
                setLikedByCurrentUser(res.data.liked);
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="commentWrapper bg-white">
            <div className="commentTop">
                <div className="commentTopLeft">
                    <Link to={`/profile/${commentUser.id}`}>
                        {commentUser && <img src={commentUser.avatar ? `http://localhost:8000/storage/${commentUser.avatar}` : `https://eu.ui-avatars.com/api/?name=${commentUser.name + ' ' + commentUser.lastname}`} alt="commentProfileImage" className="commentProfileImage"/>}
                    </Link>
                    {commentUser && <span className="commentUsername">{commentUser.name} {commentUser.lastname}</span>}
                    <span className="commentDate">{format(comment.created_at)}</span>
                </div>
                    {user.id === comment.user_id &&  <div className="commentTopRight">

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
                                        To edit this comment, enter a different content below.
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

            <div className="commentCenter">
                <span className="commentText">{comment.body}</span>
            </div>

            <div className="commentBottom">
                <div className="commentBottomLeft">
                    <img className="rocketCommentButton" src={likedByCurrentUser ? likedRocketPng : rocketPng} onClick={rocketHandler} alt="rocketpng"/>
                    <span className="commentRocketCounter">{numberOfLikes} people launched it into space</span>
                </div>
            </div>
        </div>
    );
};

export default Comment;
