import React from 'react';
import './usersGameRecords.css';
import {Link} from "react-router-dom";
import {DateRange, InsertInvitation, Today} from "@material-ui/icons";

const UsersGameRecords = ({ user, points, gamePage, bests }) => {

    const gamePageRecords = () => {
        return (
            <div>
                <li className="gameRecordsHorizontal">
                    <div className="recordsItem">
                        <Today fontSize='large'/>
                        <span className="gameRecordsText">Today</span>
                        <span className="gameRecordsCounterHorizontal">{bests.today}</span>
                    </div>
                    <div className="recordsItem">
                        <InsertInvitation fontSize='large'/>
                        <span className="gameRecordsText">This week</span>
                        <span className="gameRecordsCounterHorizontal">{bests.week}</span>
                    </div>
                    <div className="recordsItem">
                        <DateRange fontSize='large'/>
                        <span className="gameRecordsText">All time</span>
                        <span className="gameRecordsCounterHorizontal">{bests.all}</span>
                    </div>
                </li>
            </div>
        )
    }

    const usersRecords = () => {
        return (
            <Link to={`/profile/${user.id}`} className="usersRecordsListLink">
                <li className="gameRecordsItem dim">
                    <div className="gameRecordsProfileImgContainer">
                        <img className="gameRecordsProfileImg" src={user.avatar ? `http://localhost:8000/storage/${user.avatar}` : `https://eu.ui-avatars.com/api/?name=${user.name + ' ' + user.lastname}`} alt="profileimg" />
                    </div>
                    <span className="gameRecordsUsername">{user.name + ' ' + user.lastname}</span>
                    <span className="gameRecordsCounter">{points}</span>
                </li>
            </Link>
        )
    }

    return (
        gamePage ? gamePageRecords() : usersRecords()
    );
};


export default UsersGameRecords;
