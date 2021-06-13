import React from 'react';
import './usersFriendsList.css';
import {Link} from "react-router-dom";

const UsersFriendsList = ({ user, conversation }) => {

    return (
            <li className="friendsItem">
                <div className="friendsListProfileImgContainer">
                    {conversation ?
                        <img src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="postProfileImage" className="friendsListProfileImg" />
                    :
                        <Link to={`/profile/${user.id}`} className="usersFriendListLink">
                            {user && <img src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="postProfileImage" className="friendsListProfileImg dim pointer"/>}
                        </Link>
                    }
                    {/*<span className="friendsListOnline">*/}
                    {/*</span>*/}
                </div>
                <span className="friendsListUsername">{user.name + ' ' + user.lastname}</span>
            </li>

    );
};


export default UsersFriendsList;
