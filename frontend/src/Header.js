import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logoImage from '../src/img/logo.png';
import { FaBell } from 'react-icons/fa';
import {io} from 'socket.io-client'; 
import './css/Header.css';
var socket;
const ENDPOINT = "http://localhost:4000";
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

  // useEffect(() => {
  //   const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
  //   if (storedNotifications) {
  //     setNotifications(storedNotifications);
  //   }
  // }, []);
  
  // Khi nhận được một thông báo mới
  
  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
    }
    console.log(socket);

    // Hủy bỏ tất cả các lắng nghe trước đó
    socket.removeAllListeners();
    socket.on('newPin', (newPin) => {
      console.log('New notification received:', newPin);
      setNotifications(prevNotifications => {
        const updatedNotifications = [...prevNotifications, newPin];
        //localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Lưu thông báo vào Local Storage
        return updatedNotifications;
      });
    });  
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
                  {/* {isAdmin && <a href="/admin">Admin</a>}  */}
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
              {notifications.length === 0 ? (
                <div className="notification-item">
                  <p>No notification</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <p>{notification.email} requests to add new location</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
