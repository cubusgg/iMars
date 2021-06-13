import React, {useState, useEffect, useContext} from 'react';
import './feed.css';
import Share from "../share/Share";
import Post from "../post/Post";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";

const Feed = ({ id, updateUser }) => {

    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [update, setUpdate] = useState('');

    useEffect( () => {
        let isMounted = true;
        const fetchPosts = async () => {
            const res = id
                ? await axios.get(`/users/${id}/posts`)
                : await axios.get("/posts")
            if (isMounted) setPosts(res.data);
        };

        fetchPosts();
        return () => { isMounted = false };
    }, [id, update, updateUser])


    return (
        <div className={`${id ? "profileCenterPosts" : "centerPosts"}`}>
            <div className="centerPostsWrapper">
                {(!id || id === user.id) && <Share setState={(update) => {setUpdate(update)}}/>}
                {posts.map((p) => (
                    <Post key={p.post.id} post={p.post} likes={p.likes} liked={p.liked} postUser={p.user} setState={(update) => {setUpdate(update)}} />
                ))}
            </div>
        </div>
    )
};

export default Feed;
