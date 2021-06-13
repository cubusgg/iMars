import React from 'react';
import './userCard.css';
import {Link} from "react-router-dom";

const UserCard = ({ user }) => {
    return (
        <Link to={`/profile/${user.id}`} className="usersLink">
            <article className="bg-white-90 h5 br3 ma2 pa3 grow shadow-5 articleWrapper">
                <div className="tc">

                        {user && <img src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="profileImage" className="userImage"/>}

                    {user && <h1 className="f4 usersName">{user.name + ' ' + user.lastname}</h1>}

                    <hr className="mw3 bb bw1 b--black-10" />
                </div>
                <p className="lh-copy measure center f6 black-70 tc">
                    {user && <span className="userInfoDesc">{user.location}</span>}
                </p>
            </article>
        </Link>
    )
};

export default UserCard;



