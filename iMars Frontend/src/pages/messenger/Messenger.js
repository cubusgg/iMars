import React, {useEffect, useRef, useState} from "react";
import Navigation from "../../components/main/navigation/Navigation";
import Menu from "../../components/main/menu/Menu";
import './messenger.css';
import RightBarConversations from "../../components/main/rightBarConversations/RightBarConversations";
import axios from "axios";
import Message from "../../components/main/Message/Message";

const Messenger = () => {

    const text = useRef();
    const [messages, setMessages] = useState([])
    const [updateMessages, setUpdateMessages] = useState();
    const [currentChat, setCurrentChat] = useState(null);
    const [secondUser, setSecondUser] = useState(null);
    const [updateConversations, setUpdateConversations] = useState();
    const scrollRef = useRef();

    useEffect( () => {
        let isMounted = true;
        const fetchMessages = async () => {
            if (currentChat) {
                const res = await axios.get(`/users/${currentChat.secondUser.id}/chat`)
                if (isMounted) setMessages(res.data);
            } else if (secondUser) {
                await axios.get(`/users/${secondUser.id}/chat`)
                setUpdateConversations(Date().toLocaleString())
            }
        };
        fetchMessages();
        return () => { isMounted = false };
    }, [updateMessages, currentChat, secondUser])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages])

    const submitHandler = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("text", text.current.value);

        try {
            await axios.post(`/con/${currentChat.conv.id}/send`, data);
            setUpdateMessages(Date().toLocaleString())
            text.current.value = ''
        } catch (e) {

        }
    }

    return (
        <>
            <Navigation />
            <div className="messengerWrapper">
                <Menu />
                {currentChat
                    ? <div className="messenger">
                        <div className="chat bg-white-90">
                            <div className="messages h-100">
                                {messages.map((p) => (
                                    <div ref={scrollRef}>
                                        <Message key={p.id} message={p.message} user={p.user} />
                                    </div>
                                ))}
                            </div>

                        </div>

                        <div className="mt2">
                            <input placeholder={`Type something..`} className="chatMessageInput" ref={text} />
                            <button className="shareButton" onClick={submitHandler}>Send</button>
                        </div>
                    </div>
                    : <div className="noMessages">To start a chat open conversation.<br/>If you want to start new conversation that does not exist just choose user in Users, then open conversation in Conversations.</div> }

                <RightBarConversations setCurrentChat={(update) => {setCurrentChat(update)}} currentChat={currentChat} setSecondUser={(update) => {setSecondUser(update)}} updateConversations={(update) => {updateConversations(update)}}/>
            </div>
        </>
    )
};

export default Messenger;

