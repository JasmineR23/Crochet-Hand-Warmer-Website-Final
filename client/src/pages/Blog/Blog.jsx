import React, { useEffect, useState } from "react";
import "./Blog.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Blog = ({ currentUser, setCurrentUser }) => {
  const [handWarmers, setHandWarmers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:4000/handwarmers")
      .then(res => setHandWarmers(res.data))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    if (!activeId) return;

    axios.get(`http://localhost:4000/comments/${activeId}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [activeId]);

  const submitComment = async () => {
    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    if (!message.trim()) return;

    try {
      const res = await axios.post("http://localhost:4000/comments", {
        content: message,
        userId: currentUser.id,
        handWarmerId: activeId,
      });

      const newComment = res.data;


      setMessage("");


      setComments(prev => [newComment, ...prev]);


      if (setCurrentUser) {
        setCurrentUser(prev => ({
          ...prev,
          comments: [...prev.comments, newComment]
        }));
      }

    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  return (
    <div className="container">
      <div className="blog">


        <div className="left-sidebar">
          <h3 className="sidebar-title">Hand Warmers</h3>

          <div className="sidebar-list">
            {handWarmers.map(hw => (
              <div
                key={hw.id}
                className={`sidebar-item ${activeId === hw.id ? "active" : ""}`}
                onClick={() => setActiveId(hw.id)}
              >
                <img
                  src={`http://localhost:4000/uploads/${hw.image}`}
                  alt={hw.name}
                  className="sidebar-img"
                />
                <div className="sidebar-name">{hw.name}</div>
              </div>
            ))}
          </div>
        </div>

  
        <div className="main-section">

          <div className="display">
            {activeId ? (
              comments.length > 0 ? (
                comments.map(c => (
                  <div key={c.id} className="comment">
                    <strong>{c.user.username}:</strong> {c.content}
                  </div>
                ))
              ) : (
                <div>No comments yet.</div>
              )
            ) : (
              <div>Select a hand warmer to view comments.</div>
            )}
          </div>


          <div className="new-blog">
            <input
              type="text"
              className="input-blog"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
            />
            <button onClick={submitComment}>Submit</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Blog;
