import {useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function PostPage() {
    const [postInfo,setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [comment, setComment] = useState('');
    const {id} = useParams();
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
                setComment('');
                // Update postInfo state with the updated post including comments
                setPostInfo(data.blog);
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
            const postData = await response.json();
            setPostInfo(postData.post);
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
            const postData = await response.json();
            setPostInfo(postData.post);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    if (!postInfo) return '';

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author.id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit
                    </Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
            </div>
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
            <div className="likes-container">
                <button className="like-button" onClick={handleLike}>Like</button>
                <span className="likes-count">Likes: {postInfo.likes.length}</span>
                {/* <button className="dislike-button" onClick={handleDislike}>Dislike</button> */}
            </div>
            <div className="comments">
                    {postInfo.comments && postInfo.comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.text}</p>
                            <p>Posted by: {comment.postedBy.username}</p>
                        </div>
                    ))}
                </div>

                {/* Add comment section */}
                <div className="add-comment">
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment here"></textarea>
                    <button onClick={addComment}>Add Comment</button>
                </div>
            </div>
    );
}