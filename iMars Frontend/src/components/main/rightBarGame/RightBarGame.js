import React, {useContext, useEffect, useState} from 'react';
import './rightBarGame.css';
import UsersGameRecords from "../usersGameRecords/UsersGameRecords";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";

const RightBarGame = ({ update }) => {

    const { user } = useContext(AuthContext);
    const [top3, setTop3] = useState([]);
    const [personalRecords, setPersonalRecords] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const getTop3 = async () => {
            try {
                const res = await axios.get('/games/top3');
                if (isMounted) setTop3(res.data);
            } catch (e) {
                console.log(e);
            }
        }
        getTop3();
        return () => { isMounted = false }
    }, [update])

    useEffect(() => {
        let isMounted = true;
        const getPersonalRecords = async () => {
            try {
                const res = await axios.get(`/games/best`)
                if (isMounted) setPersonalRecords(res.data);
            } catch (e) {
                console.log(e);
            }
        }
        getPersonalRecords();
        return () => { isMounted = false }
    }, [update])

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <div className="gameRecordsContainer bg-white-90">
                    <h3 className="gameRecordsTitle">Top 3 game records</h3>
                    <ul className="gameRecordsList">
                        {top3.map((u) => {
                            return <UsersGameRecords key={u.game.id} points={u.game.points} user={u.user} />
                        })}
                    </ul>
                </div>

                <div className="gameRecordsContainer bg-white-90">
                    <h3 className="gameRecordsTitle">Personal's records</h3>
                    <ul className="gameRecordsList">
                        <UsersGameRecords bests={personalRecords} gamePage/>
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default RightBarGame;
