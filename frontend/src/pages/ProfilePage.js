import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit } from 'react-icons/fa';
import '../css/Profile.css';

export default function ProfilePage() {
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({ name: '', dob: '', gender: '', address: '', username: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/auth/profile', {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setUserData(data.userData);
            } else {
                console.error('Error fetching user profile:', data.error);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleEditProfile = () => {
        setIsEditing(true);
        setFormData({
            _id: userData.account._id,
            name: userData.name,
            dob: userData.dob,
            gender: userData.gender,
            address: userData.address,
            username: userData.account.username,
            email: userData.account.email,
        });
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/auth/edit/${userData.account._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                fetchUserProfile();
                setIsEditing(false);
                console.log('Update successful');
            } else {
                console.error('Error updating profile:', data.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
    
        // Đảm bảo rằng month và day luôn có 2 chữ số
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
    
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="user-profile">
            <div className="profile-container">
                <div className="setting-bar">
                    <button onClick={handleEditProfile}>Edit</button>
                </div>
                <div className="user-info">
                    {userData && userData.account && (
                        <>
                            <div><FaUser /> Username: {userData.account.username}</div>
                            <div><FaUser /> Email: {userData.account.email}</div>
                            <div><FaUser /> Name: {userData.name}</div>
                            <div><FaUser /> Date of Birth: {formatDate(userData.dob)}</div>
                            <div><FaUser /> Address: {userData.address}</div>
                            <div><FaUser /> Gender: {userData.gender}</div>
                        </>
                    )}
                </div>
                {isEditing && (
                    <div className="edit-profile-form">
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                value={formData.name}
                                name="name"
                                onChange={handleFormChange}
                                placeholder="Enter name"
                                style={{ width: '200px' }}
                            />
                            <input
                                type="date"
                                value={formData.dob}
                                name="dob"
                                onChange={handleFormChange}
                                placeholder="Select date of birth"
                                style={{ width: '200px' }}
                            />
                            <select
                                value={formData.gender}
                                name="gender"
                                onChange={handleFormChange}
                                style={{ width: '200px' }}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <input
                                type="text"
                                value={formData.address}
                                name="address"
                                onChange={handleFormChange}
                                placeholder="Enter address"
                                style={{ width: '300px', marginTop: '20px' }}
                            />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                placeholder="Enter username"
                                onChange={handleFormChange}
                                style={{ width: '200px' }}
                            />
                            <input
                                type="text"
                                name="username"
                                value={formData.email}
                                placeholder="Enter username"
                                onChange={handleFormChange}
                                style={{ width: '200px' }}
                            />
                            <button type="submit" onClick={handleFormSubmit}>Save</button>
                            <button type="button" onClick={handleCancelEdit}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}