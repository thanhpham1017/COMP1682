import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logoImage from '../src/img/logo.png';
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
const socket = io.connect('http://localhost:4000');
export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); 

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);


  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }
  const username = userInfo?.username;
  
  useEffect(() => {
    console.log(socket);
    socket.on('new-pin', (newPin) => {
      setNotifications([...notifications, newPin]);
    });
    // Hủy kết nối khi component unmount
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <header className="top-bar">
      <div className="logo">
        <Link to="/" className="logo">
          <img src={logoImage} alt="MyBlog Logo" />
        </Link>
      </div>
      <div className="menu">
        <a href="/">Home</a>
        <a href="#">Blog</a>
        <a href="/admin">Admin</a>
      </div>
      <nav>
        <div className="user-info">
          {username && (
            <>
              <div className="username" onClick={() => setDropdownOpen(!dropdownOpen)}>{username}</div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/create" className="create-post">Create new post</Link>
                  <Link to="/profile/settings" className="profile-username">Profile</Link>
                  <button onClick={logout} className="logout-btn">Logout</button>
                </div>
              )}
            </>
          )}
          {!username && (
            <div className="auth-links">
              <Link to="/login" className="login">Login</Link>
              <Link to="/register" className="register">Register</Link>
            </div>
          )}
        </div>
        <div className="notification">
          <FaBell onClick={() => setDropdownOpen(!dropdownOpen)} />
          {dropdownOpen && (
            <div className="notification-list">
              {notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {/* Hiển thị nội dung của thông báo */}
                  <p>{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
