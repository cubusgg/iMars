import React, {useContext, useEffect, useState} from 'react';
import { format } from 'timeago.js';
import {AuthContext} from "../../../context/AuthContext";
import './message.css';
import {Link} from "react-router-dom";

const Message = ({ message, user }) => {

    const { user: userContext } = useContext(AuthContext);
    const [currentUserMessage, setCurrentUserMessage] = useState();

    useEffect( () => {
        userContext.id === user.id ? setCurrentUserMessage(true) : setCurrentUserMessage(false)
    }, [user.id, userContext.id])

    return (
        <div className={currentUserMessage ? 'messageWrapper bg-white' : 'messageWrapper bg-black-20'}>
            <div className="messageTop">
                <Link to={`/profile/${user.id}`}>
                    {user && <img src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="messageProfileImage" className="messageProfileImage"/>}
                </Link>

                {user && <span className="messageUsername">{user.name} {user.lastname}</span>}

            </div>

            <div className="messageCenter">
                    {user && <span className='messageText'>{message.body}</span>}
            </div>
        </div>
    );
};

export default Message;






