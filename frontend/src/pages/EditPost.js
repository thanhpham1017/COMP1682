import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import '../css/Post.css';
export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
      .catch(error => {
        console.error('There was a problem fetching the post:', error);
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    if (!title || !summary || !content || !files?.[0]) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  async function deletePost() {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/post/delete/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          setRedirect(true);
        } else {
          const data = await response.json();
          console.error('Error deleting post:', data.error);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={updatePost} className="edit-post-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          className="post-input"
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={ev => setSummary(ev.target.value)}
          className="post-input"
        />
        <input
          type="file"
          onChange={ev => setFiles(ev.target.files)}
          className="file-input"
        />
        <Editor value={content} onChange={setContent} />
        <button className="update-button">Update Post</button>
        <button type="button" onClick={deletePost} className="delete-button">
          Delete Post
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}
