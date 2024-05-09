import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";
import '../src/css/Post.css';

export default function Post({_id,title,summary,cover,content,createdAt,author}) {

  return (
    <div className="post-container">
      <div className="blog-box">
        <div className="blog-img">
          <Link to={`/post/${_id}`}>
            <img src={`http://localhost:4000/${cover}`} alt="blog" />
          </Link>
        </div>
        <div className="blog-text">
          <span>{formatISO9075(new Date(createdAt))}</span>
          <Link to={`/post/${_id}`} className="blog-title">
            <h2>{title}</h2>
          </Link>
          <p>{summary}</p>
          <Link to={`/post/${_id}`}>Read More</Link>
        </div>
    </div>
    </div>
  );
}