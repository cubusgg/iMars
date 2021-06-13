import React, {useContext, useEffect, useState} from 'react';
import './rightBar.css';
import UsersFriendsList from "../usersFriendsList/UsersFriendsList";
import UsersGameRecords from "../usersGameRecords/UsersGameRecords";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";

const RightBar = ({ id, updateFriends, updateUser }) => {

    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const getFriends = async () => {
            try {
                const friendsList = await axios.get(`/users/${user.id}/friends`);
                if (isMounted) setFriends(friendsList.data.friends);
            } catch (e) {
                console.log(e);
            }
        }
        getFriends();
        return () => { isMounted = false}
    }, [user.id, updateFriends])

    useEffect(() => {
        let isMounted = true;
        const getRecords = async () => {
            try {
                const res = id
                    ? await axios.get(`/games/${id}`)
                    : await axios.get("/games/top3")
                if (isMounted) setRecords(res.data);
            } catch (e) {
                console.log(e);
            }
        }
        getRecords();
        return () => { isMounted = false}
    }, [id, updateUser])

    const HomeRightbar = () => {
        return (
            <>
                <h3 className="gameRecordsTitle">Top 3 game records</h3>
                <ul className="gameRecordsList">
                    {records.map((u) => {
                        return <UsersGameRecords key={u.game.id} points={u.game.points} user={u.user} />
                    })}
                </ul>
            </>
        )
    }

    const ProfileRightbar = () => {
        return (
            <>
                <h3 className="gameRecordsTitle">Personal's game records</h3>
                <ul className="gameRecordsList">
                    {records.map((u) => {
                        return <UsersGameRecords key={u.game.id} points={u.game.points} user={u.user} />
                    })}
                </ul>
            </>
        )
    }

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <div className="gameRecordsContainer bg-white-90">
                    {id ? <ProfileRightbar /> : <HomeRightbar />}
                </div>

                <div className="friendsListContainer bg-white-90">
                    <h3 className="friendsListTitle">Followed list</h3>
                    <ul className="friendsList">
                        {friends.map((u) => (
                            <UsersFriendsList key={u.id} user={u} />
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default RightBar;
