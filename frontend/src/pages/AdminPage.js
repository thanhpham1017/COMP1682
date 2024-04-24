import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [editCategory, setEditCategory] = useState({ _id: '', name: '' });
    const [guests, setGuests] = useState([]);
    const [newGuest, setNewGuest] = useState({ 
        name: '', 
        dob: '', 
        gender: '', 
        address: '', 
        // email: '', 
        // password: '', 
        image: '', // Thêm trường hình ảnh
        account: '' // Thêm trường tài khoản
    });
    const [editGuest, setEditGuest] = useState({ 
        _id: '', 
        name: '', 
        dob: '', 
        gender: '', 
        address: '', 
        // email: '', 
        // password: '', 
        image: '', // Thêm trường hình ảnh
        account: '' // Thêm trường tài khoản
    });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditCategoryTab, setShowEditCategoryTab] = useState(false);
    const [showEditGuestTab, setShowEditGuestTab] = useState(false);
    const [sidebarItem, setSidebarItem] = useState('');

    const navigate = useNavigate();

    // Function to fetch categories from the server
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:4000/category', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Function to add a new category
    const handleAddCategory = async () => {
        try {
            const response = await fetch('http://localhost:4000/category/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to add category');
            }
            await fetchCategories();
            setNewCategory({ name: '' });
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    // Function to edit a category
    const handleEditCategory = async () => {
        try {
            const response = await fetch(`http://localhost:4000/category/edit/${editCategory._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editCategory),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to edit category');
            }
            await fetchCategories();
            setShowEditCategoryTab(false);
            setEditCategory({ _id: '', name: '' });
        } catch (error) {
            console.error('Error editing category:', error);
        }
    };

    // Function to delete a category
    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/category/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete category');
            }
            await fetchCategories();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Function to fetch guests from the server
    const fetchGuests = async () => {
        try {
            const response = await fetch('http://localhost:4000/guest', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch guests');
            }
            const data = await response.json();
            setGuests(data);
        } catch (error) {
            console.error('Error fetching guests:', error);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    // Function to add a new guest
    const handleAddGuest = async () => {
        try {
            debugger;
            const response = await fetch('http://localhost:4000/guest/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGuest),
                credentials: 'include',
            });
            console.log('response:', response); 
            if (!response.ok) {
                throw new Error('Failed to add guest');
            }
            await fetchGuests();
            console.log('New guest added:', newGuest); 
            setNewGuest({ 
                
                name: '', 
                dob: '', 
                gender: '', 
                address: '', 
                // email: '', 
                // password: '', 
                image: '', 
                account: '' 
            });
            console.log('setNewGuest:', setNewGuest);
        } catch (error) {
            console.error('Error adding guest:', error);
        }
    };

    // Function to edit a guest
    const handleEditGuest = async () => {
        try {
            const response = await fetch(`http://localhost:4000/guest/edit/${editGuest._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editGuest),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to edit guest');
            }
            await fetchGuests();
            setShowEditGuestTab(false);
            setEditGuest({ 
                _id: '', 
                name: '', 
                dob: '', 
                gender: '', 
                address: '', 
                // email: '', 
                // password: '', 
                image: '', 
                account: '' 
            });
        } catch (error) {
            console.error('Error editing guest:', error);
        }
    };

    // Function to delete a guest
    const handleDeleteGuest = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/guest/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete guest');
            }
            await fetchGuests();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    // Render delete confirmation modal
    const renderDeleteConfirmation = () => {
        return (
            <div className="delete-confirmation">
                <p>Are you sure you want to delete this category?</p>
                <button onClick={() => handleDeleteCategory(editCategory._id)}>Yes, Delete</button>
                <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                <p>Are you sure you want to delete this guest?</p>
                <button onClick={() => handleDeleteGuest(editGuest._id)}>Yes, Delete</button>
                <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
            </div>
        );
    };

    // Render edit category tab
    const renderEditCategoryTab = () => {
        return (
            <div>
                <h2>Edit Category</h2>
                <input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                />
                <button onClick={handleEditCategory}>Edit Category</button>
            </div>
        );
    };

    // Render category list as a table
    const renderCategoryList = () => {
        return (
            <div className="category-container">
                <h2>Categories</h2>
                {categories.length === 0 && <p>No category, please add</p>}
                <div className="add-category">
                    <h3>Add Category</h3>
                    <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                    <button onClick={handleAddCategory}>Add Category</button>
                </div>
                {categories.length > 0 && (
                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category._id}>
                                    <td>{category._id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button onClick={() => {
                                            setEditCategory({ _id: category._id, name: category.name });
                                            setShowEditCategoryTab(true);
                                        }}>Edit</button>
                                        <button onClick={() => {
                                            setShowDeleteConfirmation(true);
                                            setEditCategory({ _id: category._id, name: category.name });
                                        }}>Delete Category</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    // Render edit guest tab
    const renderEditGuestTab = () => {
        return (
            <div>
                <h2>Edit Guest</h2>
                <input
                    type="text"
                    value={editGuest.name}
                    onChange={(e) => setEditGuest({ ...editGuest, name: e.target.value })}
                />
                <input
                    type="date"
                    value={editGuest.dob}
                    onChange={(e) => setEditGuest({ ...editGuest, dob: e.target.value })}
                />
                <select
                        value={newGuest.gender}
                        onChange={(e) => setNewGuest({ ...newGuest, gender: e.target.value })}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                <input
                    type="text"
                    value={editGuest.address}
                    onChange={(e) => setEditGuest({ ...editGuest, address: e.target.value })}
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                />
                <input
                    type="text"
                    value={editGuest.account}
                    onChange={(e) => setEditGuest({ ...editGuest, account: e.target.value })}
                />
                <button onClick={handleEditGuest}>Edit Guest</button>
            </div>
        );
    };

    // Render guest list as a table
    const renderGuestList = () => {
        return (
            <div className="guest-container">
                <h2>Guests</h2>
                {guests.length === 0 && <p>No guests, please add</p>}
                <div className="add-guest">
                    <h3>Add Guest</h3>
                    <input
                        type="text"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    />
                    <input
                        type="date"
                        value={newGuest.dob}
                        onChange={(e) => setNewGuest({ ...newGuest, dob: e.target.value })}
                    />
                    <select
                        value={newGuest.gender}
                        onChange={(e) => setNewGuest({ ...newGuest, gender: e.target.value })}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input
                        type="text"
                        value={newGuest.address}
                        onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                    />
                    <input
                            type="file"
                            onChange={handleImageChange}
                    />
                    <input
                        type="text"
                        value={newGuest.account}
                        onChange={(e) => setNewGuest({ ...newGuest, account: e.target.value })}
                    />
                    <button onClick={handleAddGuest}>Add Guest</button>
                </div>
                {guests.length > 0 && (
                    <table className="guest-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Image</th>
                                <th>Account</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest._id}>
                                    <td>{guest._id}</td>
                                    <td>{guest.name}</td>
                                    <td>{guest.dob}</td>
                                    <td>{guest.gender}</td>
                                    <td>{guest.address}</td>
                                    <td><img src={guest.image} alt="Guest" /></td>
                                    <td>{guest.account}</td>
                                    <td>
                                        <button onClick={() => {
                                            setEditGuest({ _id: guest._id, ...guest });
                                            setShowEditGuestTab(true);
                                        }}>Edit</button>
                                        <button onClick={() => {
                                            setShowDeleteConfirmation(true);
                                            setEditGuest({ _id: guest._id, ...guest });
                                        }}>Delete Guest</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the first file from the list of selected files
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the file
            setNewGuest({ ...newGuest, image: imageUrl }); // Save the image URL to the new guest state
        }
    };

    // Render sidebar
    const renderSidebar = () => {
        return (
            <div className="admin-sidebar">
                <button onClick={() => setSidebarItem('category')}>Category</button>
                <button onClick={() => setSidebarItem('guest')}>Guest</button>
                <button onClick={() => setSidebarItem('blogger')}>Blogger</button>
            </div>
        );
    };

    return (
        <div className="admin-container">
            {renderSidebar()}
            <div className="content">
                {sidebarItem === 'category' && renderCategoryList()}
                {sidebarItem === 'guest' && renderGuestList()}
                {showDeleteConfirmation && renderDeleteConfirmation()}
                {showEditCategoryTab && renderEditCategoryTab()}
                {showEditGuestTab && renderEditGuestTab()}
                {/* Add similar blocks for 'blogger' if needed */}
            </div>
        </div>
    );
}
