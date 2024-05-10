import React, { useState, useEffect } from 'react';
import { FaUser, FaCog, FaBell, FaLock, FaQuestionCircle, FaEdit } from 'react-icons/fa';
import '../css/Profile.css';

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({ name: '', dob: '', gender: '', address: '', username:'', email: '' ,password: '' });
    const [isEditing, setIsEditing] = useState(false); // Add this line

    useEffect(() => {
        // Gọi API endpoint để lấy thông tin người dùng khi component được tải lần đầu
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            // Lấy token từ local storage (hoặc nơi khác bạn lưu trữ)
            const token = localStorage.getItem('token');
            // Gọi API endpoint để lấy thông tin người dùng
            const response = await fetch('http://localhost:4000/auth/profile', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    
    const handleEditProfile = () => {
        setIsEditing(true);
        // Thiết lập giá trị mặc định cho các trường trong form chỉnh sửa
        setFormData({
            _id: '', name: '', dob: '', gender: '', address: '', username: '',email: '', password: ''
        });
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API endpoint để cập nhật thông tin người dùng
            const response = await fetch(`http://localhost:4000/auth/edit/${userData.AccountData._id}`, {
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
                // Cập nhật thành công, hiển thị thông báo hoặc thực hiện các thao tác cần thiết
                console.log('Update successful');
            } else {
                // Xử lý khi có lỗi
                console.error('Error updating profile:', data.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };


    return (
        <div className="user-profile">
            <div className="profile-container">
                <div className="setting-bar">
                    {/* Các nút setting */}
                    <button onClick={handleEditProfile}>Edit</button>
                </div>
                <div className="user-info">
                    {console.log(userData)}
                    {userData && (
                        <>
                            <div><FaUser /> {userData.username}</div>
                            <div><FaUser /> {userData.email}</div>
                        </>
                    )}
                </div>
                {isEditing && (
                <div className="edit-profile-form">
                    {/* Form chỉnh sửa thông tin */}
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
                            style={{ width: '500px' }}
                        />
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            placeholder="Enter username"
                            onChange={handleFormChange}
                        />
                        {/* Thêm các trường thông tin khác cần chỉnh sửa ở đây */}
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}
            </div>
        </div>
    );
}
