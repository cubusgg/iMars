import React from 'react';
import './usersConversations.css';

const UsersConversations = ({ secondUser }) => {

    return (
        <li className="friendsItem pointer">
            <div className="friendsListProfileImgContainer">
                {secondUser && <img src={secondUser.avatar ? `http://localhost:8000/storage/${secondUser.avatar}` : `https://eu.ui-avatars.com/api/?name=${secondUser.name + ' ' + secondUser.lastname}`} alt="postProfileImage" className="friendsListProfileImg"/>}
            </div>
            {secondUser && <span className="friendsListUsername">{secondUser.name + ' ' + secondUser.lastname}</span>}
        </li>
    );
};


export default UsersConversations;
