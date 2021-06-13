import React, {useContext, useEffect, useRef, useState} from 'react';
import Navigation from "../../components/main/navigation/Navigation";
import {default as MenuComponent} from "../../components/main/menu/Menu";
import RightBar from "../../components/main/rightBar/RightBar";
import './profile.css';
import Feed from "../../components/main/feed/Feed";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
import swal from "sweetalert";
import {Add, Cancel, Remove} from '@material-ui/icons';
import {AuthContext} from "../../context/AuthContext";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {deleteUserCall, updateCall} from "../../apiCalls";

const Profile = () => {

    const { user: currentUser, dispatch } = useContext(AuthContext);

    const [user, setUser] = useState({});
    const paramsUserId = useParams().id;
    const history = useHistory();
    const [isFriend, setIsFriend] = useState(false);
    const [updateFriends, setUpdateFriends] = useState();
    const [updateUser, setUpdateUser] = useState();
    const [file, setFile] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const nameField = useRef(currentUser.name);
    const [name] = useState(currentUser.name)

    const lastnameField = useRef(currentUser.lastname);
    const [lastname] = useState(currentUser.lastname)

    const genderField = useRef(currentUser.gender);
    const [gender] = useState(currentUser.gender)

    const locationField = useRef(currentUser.location);
    const [location] = useState(currentUser.location)



    const handleDelete = async () => {
        try {
            deleteUserCall(dispatch)
            handleClose();
            history.push('/welcome');
            await swal("Success!", "You deleted account correctly!", "success");
        } catch (e) {
            console.log(e)
        }
    }

    const handleClickButton = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickOpenEdit = () => {
        setOpenEdit(true)
    };

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenEdit(false);
        setOpenDelete(false);
    };


    useEffect(() => {
        let isMounted = true;

        const isFriend = async () => {
            try {
                const res = await axios.get(`/friends/${paramsUserId}`);
                if (isMounted) setIsFriend(res.data.friend)
            } catch (e) {
                console.log(e);
            }
        }
        isFriend();
        return () => { isMounted = false }
    }, [paramsUserId])

    useEffect( () => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users/${paramsUserId}`);
                if (res.data.id) {
                    isMounted && setUser(res.data)
                } else {
                    history.push('/')
                    await swal("Ops!", `User with ID ${paramsUserId} does not exist!`, "error");
                }
            } catch (e) {
                console.log(e);
            }
        }
        fetchUser();
        return () => { isMounted = false }
    }, [paramsUserId, history, updateUser])

    const handleClick = async () => {
        try {
            await axios.get(`/users/${paramsUserId}/friend`)
            setIsFriend(!isFriend)
            setUpdateFriends(Date().toLocaleString())
        } catch (err) {

        }
    }

    const acceptHandler = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", nameField.current.value);
        data.append("lastname", lastnameField.current.value);
        file && data.append("image", file);
        data.append("gender", genderField.current.value);
        data.append("location", locationField.current.value);
        data.append("_method", "PATCH");

        try {
            updateCall(data, dispatch);
            setUpdateUser(Date().toLocaleString())
        } catch (e) {
            await swal("Ops!", `You have to provide data!`, "error");
        }
    }

    return (
        <>
            <Navigation updateUser={updateUser} />
            <div className="profileWrapper">
                <MenuComponent />

                <div className="profile">

                    <div className="bg bg-white-80">

                        <div className="profileTop">
                            {currentUser.id === parseInt(paramsUserId) &&
                            <Button aria-controls="simple-menu" aria-haspopup="true" className="editButton" onClick={handleClickButton}>
                                <b>...</b>
                            </Button>}

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
                                        To edit user info, fill fields below.
                                    </DialogContentText>
                                    <form onSubmit={acceptHandler}>
                                        Avatar:
                                        <br />
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Avatar
                                            <input
                                                type="file"
                                                hidden
                                                id="file"
                                                accept=".png,.jpeg,.jpg"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                        </Button>
                                        {file && (
                                        <div className="updateImgContainer">
                                            <img className="h4 w4 updateImage" src={URL.createObjectURL(file)} alt="" />
                                            <Cancel className="updateCancel" onClick={() => setFile(null)}/>
                                        </div>
                                        )}
                                        <br /><br />
                                        Name:
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            type="text"
                                            defaultValue={name}
                                            inputRef={nameField}
                                            fullWidth
                                        />
                                        Lastname:
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="lastname"
                                            type="text"
                                            defaultValue={lastname}
                                            inputRef={lastnameField}
                                            fullWidth
                                        />
                                        Gender:
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="gender"
                                            type="text"
                                            defaultValue={gender}
                                            inputRef={genderField}
                                            fullWidth
                                        />
                                        Location:
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="location"
                                            type="text"
                                            defaultValue={location}
                                            inputRef={locationField}
                                            fullWidth
                                        />
                                        <button className="editSubmitButton" type="submit" onClick={handleClose} autoFocus>Accept</button>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        <b>Cancel</b>
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
                                            Do you really want to delete your account?
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

                            {user.name && <img className="profileUserImg" src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="profileimg"/>}
                        </div>

                        <div className="profileInfo black">
                            {user && <span className="profileInfoName">{user.name} {user.lastname}</span>}
                            {user && <span className="profileInfoDesc">{user.location}</span>}
                            {user && <span className="profileInfoDesc">{user.date_of_birth}</span>}
                            {user && <span className="profileInfoDesc">{user.gender}</span>}

                            {currentUser.id !== parseInt(paramsUserId) && (
                                user.name && <button className="profileFollowButton dim" onClick={handleClick}>
                                    {isFriend ? "Unfollow" : "Follow"}
                                    {isFriend ? <Remove /> : <Add />}
                                </button>
                            )}
                        </div>


                    </div>


                    <div className="profileBottom">
                        <Feed id={paramsUserId} updateUser={updateUser}/>
                    </div>
                </div>
                <RightBar id={paramsUserId} updateFriends={updateFriends} updateUser={updateUser} />
            </div>

        </>
    )
};


export default Profile;

