import React, { useState, useEffect } from 'react';

export default function AdminPage() {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        address: '',
        email: '',
        password: '',
        image: null
    });

    useEffect(() => {
        // Fetch all admins
        fetch('/api/admin')
            .then(res => res.json())
            .then(data => {
                setAdmins(data);
            })
            .catch(err => {
                console.error('Error fetching admins:', err);
            });
    }, []);

    const handleEdit = (adminId) => {
        // Fetch admin details for editing
        fetch(`/api/admin/edit/${adminId}`)
            .then(res => res.json())
            .then(data => {
                setSelectedAdmin(data);
            })
            .catch(err => {
                console.error('Error fetching admin details:', err);
            });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = () => {
        // Submit form for editing admin
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        fetch(`/api/admin/edit/${selectedAdmin._id}`, {
            method: 'POST',
            body: formDataToSend
        })
            .then(res => res.json())
            .then(data => {
                // Handle success
                console.log('Admin updated successfully');
            })
            .catch(err => {
                // Handle error
                console.error('Error updating admin:', err);
            });
    };

    return (
        <div className="admin-container">
            <form className="admin-form">
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="form-input" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="dob">Date of Birth:</label>
                <input 
                type="date" 
                name="dob" 
                id="dob" 
                value={formData.dob} 
                onChange={handleInputChange} 
                className="form-input" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="gender">Gender:</label>
                <input 
                type="text" 
                name="gender" 
                id="gender" 
                value={formData.gender} 
                onChange={handleInputChange} 
                className="form-input" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input 
                type="text" 
                name="address" 
                id="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="form-input" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="form-input" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input 
                type="password" 
                name="password" 
                id="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className="form-input" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input 
                type="file" 
                name="image" 
                id="image" 
                onChange={handleFileChange} 
                className="form-input" 
                />
            </div>
            <button type="button" onClick={handleSubmit} className="submit-button">Submit</button>
            </form>
        </div>
    );
}
