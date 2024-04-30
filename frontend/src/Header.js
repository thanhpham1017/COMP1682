import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logoImage from '../src/img/logo.png';
import { FaBell } from 'react-icons/fa';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notification, setNotification] = useState(null);

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
        <div className="notification" onClick={() => setNotification(!notification)}>
          <FaBell />
          {notification && (
            <div className="dropdown">
              <p>Ngoc123 wants to add pin</p>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
