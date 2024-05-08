import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import '../css/Post.css';
export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function createNewPost(ev) {
    ev.preventDefault();
    if (!title || !summary || !content || !files[0]) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={createNewPost} className="create-post-form">
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
        <button type="submit" className="post-button">Create Post</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}
