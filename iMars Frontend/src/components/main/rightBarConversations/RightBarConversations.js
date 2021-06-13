import React, {useEffect, useState} from 'react';
import '../rightBar/rightBar.css';
import axios from "axios";
import UsersConversations from "../usersConversations/UsersConversations";
import UsersFriendsList from "../usersFriendsList/UsersFriendsList";

const RightBarConversations = ({ setCurrentChat, setSecondUser, updateConversations }) => {

    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const getFriends = async () => {
            try {
                const res = await axios.get(`/allusers`);
                if (isMounted) setUsers(res.data.users);
            } catch (e) {
                console.log(e);
            }
        }
        getFriends();
        return () => { isMounted = false}
    }, [])

    useEffect(() => {
        let isMounted = true;
        const getConversations = async () => {
            try {
                const conversationsList = await axios.get(`/conversations`);
                if (isMounted) setConversations(conversationsList.data);
            } catch (e) {
                console.log(e);
            }
        }
        getConversations();
        return () => { isMounted = false}
    }, [updateConversations])

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">

                <div className="gameRecordsContainer bg-white-90">
                    <h3 className="friendsListTitle">Conversations</h3>
                    <ul className="friendsList">
                        {conversations.map((c) => (
                            <div className="dim" onClick={() => setCurrentChat(c)}>
                                <UsersConversations key={c.conv.id} conversation={c.conv} secondUser={c.secondUser}/>
                            </div>
                        ))}
                    </ul>
                </div>

                <div className="friendsListContainer bg-white-90">
                    <h3 className="friendsListTitle">Users</h3>
                    <ul className="friendsList">
                        {users.map((u) => (
                            <div className="dim" onClick={() => setSecondUser(u)}>
                                <UsersFriendsList key={u} user={u} conversation/>
                            </div>
                        ))}
                    </ul>
                </div>


            </div>
        </div>
    );
};


export default RightBarConversations;
