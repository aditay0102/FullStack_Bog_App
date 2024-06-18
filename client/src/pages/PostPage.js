import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import './pagesCss/PostPage.css';

import './pagesCss/CreatePost.css'
export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
    .then((response) => { 
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
       
      });
    });
  }, []);
  
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:4000/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate('/');
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  if (!postInfo) return null;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
         
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit Post
          </Link>
          <button className="delete-btn" onClick={handleDelete}>
            Delete this post
          </button>
        </div>
      )}
      <div id="postimage">
        <img id='postimg' src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
