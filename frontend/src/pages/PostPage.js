import {useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {io} from 'socket.io-client'; 
import '../css/Post.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
var socket;
const ENDPOINT = "http://localhost:4000";
export default function PostPage() {
    const [postInfo,setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [comment, setComment] = useState('');
    const {id} = useParams();
    useEffect(() => {
        if (!socket) {
            socket = io(ENDPOINT);
        }
        console.log(socket);
    
        // Hủy bỏ tất cả các lắng nghe trước đó
        socket.removeAllListeners();
        socket.on("new-comment", (msg) => {
            console.log('New comment received:', msg);
            // Update comments in state
            setPostInfo(prevPostInfo => {
                if (!prevPostInfo) return null;
                return {
                    ...prevPostInfo,
                    comments: [...prevPostInfo.comments, msg] // Assuming msg contains new comment data
                };
            });
        });
        socket.on("add-like", (data) => {
            console.log('Like added:', data);
            if (postInfo && postInfo._id === data.postId) {
                setPostInfo(prevPostInfo => ({
                    ...prevPostInfo,
                    likes: data.likes
                }));
                
            }
        });
        socket.on("remove-like", (data) => {
            console.log('Like removed:', data);
            if (postInfo && postInfo._id === data.postId) {
                setPostInfo(prevPostInfo => ({
                    ...prevPostInfo,
                    likes: data.likes
                }));
            }
        });
    }, []);
    
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`,{
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(postInfo => {
                setPostInfo(postInfo);
            })
            .catch(error => {
                console.error('There was a problem fetching the post:', error);
            });
    }, [id]);

    const addComment = async () => {
        try {
            const response = await fetch(`http://localhost:4000/post/comment/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify({ comment })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success === true) {
                if (socket) {
                    socket.emit("comment", { text: comment }); // Sending the comment text
                }
                setComment('');
                toast.success("Comment added");
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            toast.error("There was a problem adding the comment");
        }
    }

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:4000/post/addLike/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setPostInfo(prevPostInfo => ({
                ...prevPostInfo,
                likes: [...prevPostInfo.likes, userInfo.id]
            }));
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    const handleDislike = async () => {
        try {
            const response = await fetch(`http://localhost:4000/post/removeLike/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
                
            }
            const data = await response.json();
            if (data.success === true) {
                setPostInfo(prevPostInfo => ({
                    ...prevPostInfo,
                    likes: data.post.likes
                }));
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    if (!postInfo) return '';

    return (
        <div className="post-page">
            <div className="post-box">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author.id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${id}`}>
                        Edit
                    </Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
            </div>
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
            <div className="likes-container">
                <button className="like-button" onClick={handleLike}>
                    <FaThumbsUp />
                </button>
                <span className="likes-count">Likes: {postInfo.likes.length}</span>
                <button className="dislike-button" onClick={handleDislike}>
                    <FaThumbsDown />
                </button>
            </div>
            <div className="comments">
                    {postInfo.comments && postInfo.comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.text}</p>
                            <p>Posted by: {comment.postedBy?.username}</p>
                        </div>
                    ))}
                </div>
                {/* Add comment section */}
                <div className="add-comment">
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment here"></textarea>
                    <button onClick={addComment}>Add Comment</button>
                </div>
            </div>
        </div>
    );
}