import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminPage.css';
export default function AdminPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [editCategory, setEditCategory] = useState({ _id: '', name: '' });
    const [guests, setGuests] = useState([]);
    const [pendingPins, setPendingPins] = useState([]);
    const [newGuest, setNewGuest] = useState({ name: '', dob: '', gender: '', address: '',username:'', email: '' ,password: '' });
    const [editGuest, setEditGuest] = useState({ _id: '', name: '', dob: '', gender: '', address: '', username: '',email: '' ,password: '' });
    const [bloggers, setBloggers] = useState([]);
    const [newBlogger, setNewBlogger] = useState({ name: '', dob: '', gender: '', address: '',username: '',email: '',password: ''});
    const [editBlogger, setEditBlogger] = useState({ _id: '', name: '', dob: '', gender: '', address: '',username: '',email: '',password: '' });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditCategoryTab, setShowEditCategoryTab] = useState(false);
    const [showEditGuestTab, setShowEditGuestTab] = useState(false);
    const [showEditBloggerTab, setShowEditBloggerTab] = useState(false);
    const [sidebarItem, setSidebarItem] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Hàm hiển thị Toast
    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);

        // Ẩn Toast sau 3 giây
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

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
        if (!newCategory.name.trim()) {
            setErrorMessage('Please enter category name');
            return;
        }
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
        if (!editCategory.name.trim()) {
            setErrorMessage('Please enter category name');
            return;
        }
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
        if (!newGuest.name.trim() || !newGuest.dob || !newGuest.gender || !newGuest.address || !newGuest.username || !newGuest.email || !newGuest.password) {
            setErrorMessage('Please enter all guest details');
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/guest/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGuest),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to add guest');
            }
            await fetchGuests();
            setNewGuest({ name: '', dob: '', gender: '', address: '', username: '',email: '', password: '',});
        } catch (error) {
            console.error('Error adding guest:', error);
        }
    };

    // Function to edit a guest
    const handleEditGuest = async () => {
        if (!editGuest.name.trim() || !editGuest.dob || !editGuest.gender || !editGuest.address || !editGuest.username || !editGuest.email || !editGuest.password) {
            setErrorMessage('Please enter all guest details');
            return;
        }
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
            setEditGuest({ _id: '', name: '', dob: '', gender: '', address: '', username: '',email: '', password: ''});
        } catch (error) {
            console.error('Error editing guest:', error);
        }
    };

 
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

    const fetchBloggers = async () => {
        try {
            const response = await fetch('http://localhost:4000/blogger', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch bloggers');
            }
            const data = await response.json();
            setBloggers(data);
        } catch (error) {
            console.error('Error fetching bloggers:', error);
        }
    };

    useEffect(() => {
        fetchBloggers();
    }, []);

    const handleAddBlogger = async () => {
        if (!newBlogger.name.trim() || !newBlogger.dob || !newBlogger.gender || !newBlogger.address || !newBlogger.username || !newBlogger.email || !newBlogger.password) {
            setErrorMessage('Please enter all blogger details');
            return;
        }
        debugger;
        try {
            const response = await fetch('http://localhost:4000/blogger/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBlogger),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to add blogger');
            }
            await fetchBloggers();
            setNewBlogger({ name: '', dob: '', gender: '', address: '',username: '',email: '',password: '',  });
        } catch (error) {
            console.error('Error adding blogger:', error);
        }
    };

    const handleEditBlogger = async () => {
        if (!editBlogger.name.trim() || !editBlogger.dob || !editBlogger.gender || !editBlogger.address || !editBlogger.username || !editBlogger.email || !editBlogger.password) {
            setErrorMessage('Please enter all blogger details');
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/blogger/edit/${editBlogger._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editBlogger),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to edit blogger');
            }
            await fetchBloggers();
            setShowEditBloggerTab(false);
            setEditBlogger({ _id: '', name: '', dob: '', gender: '', address: '', username: '',email: '', password: '' });
        } catch (error) {
            console.error('Error editing blogger:', error);
        }
    };

    const handleDeleteBlogger = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/admin/blogger/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete blogger');
            }
            await fetchBloggers();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting blogger:', error);
        }
    };

    const fetchPendingPins = async () => {
        try {
            const response = await fetch('http://localhost:4000/pins/pending', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch pending pins');
            }
            const data = await response.json();
            setPendingPins(data);
        } catch (error) {
            console.error('Error fetching pending pins:', error);
            setErrorMessage('Failed to fetch pending pins');
        }
    };

    useEffect(() => {
        fetchPendingPins();
    }, []);

    const handleApprovePin = async (pinId) => {
        try {
            const response = await fetch(`http://localhost:4000/pin/approve/${pinId}`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to approve pin');
            }
            showToastMessage("Pin đã được thêm vào bản đồ!");
            // Cập nhật lại danh sách pins đang chờ duyệt
            await fetchPendingPins();
            
            // Hiển thị thông báo hoặc thực hiện các hành động khác
        } catch (error) {
            console.error('Error approving pin:', error);
        }
    };
    
    const handleRejectPin = async (pinId) => {
        try {
            const response = await fetch(`http://localhost:4000/pin/delete/${pinId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to reject pin');
            }
            // Cập nhật lại danh sách pins đang chờ duyệt
            showToastMessage("Pin đã bị từ chối!");
            await fetchPendingPins();
            // Hiển thị thông báo hoặc thực hiện các hành động khác
        } catch (error) {
            console.error('Error rejecting pin:', error);
        }
    };

    const confirmPinApproval = async (pinId) => {
        if (window.confirm('Are you sure you want to add this pin to the map?')) {
            await handleApprovePin(pinId);
        } else {
            console.log('User refused to add pin to map.');
        }
    };
    const confirmPinRejection = async (pinId) => {
        if (window.confirm('Are you sure you want to decline adding this pin to the map?')) {
            await handleRejectPin(pinId);
        } else {
            console.log('User refused to add pin to map.');
        }
    };

    const renderPendingPinsTable = () => {
        return (
            <div className="guest-container">
            <h2>Pending Pins</h2>
            {pendingPins.length === 0 && <p>No pending pins</p>}
            {pendingPins.length > 0 && (
                <table className="guest-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Rating</th>
                            <th>Long</th>
                            <th>Lat</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPins.map(pin => (
                            <tr key={pin._id}>
                                <td>{pin._id}</td>
                                <td>{pin.title}</td>
                                <td>{pin.desc}</td>
                                <td>{pin.rating}</td>
                                <td>{pin.long}</td>
                                <td>{pin.lat}</td>
                                <td>
                                    <button onClick={() => confirmPinApproval(pin._id)}>Yes</button>
                                    <button onClick={() => confirmPinRejection(pin._id)}>No</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        );
    };


    const renderDeleteConfirmation = () => {
        return (
            <div className="delete-confirmation">
                <p>Are you sure you want to delete this category?</p>
                <button onClick={() => handleDeleteCategory(editCategory._id)}>Yes, Delete</button>
                <p>Are you sure you want to delete this guest?</p>
                <button onClick={() => handleDeleteGuest(editGuest._id)}>Yes, Delete</button>
                <p>Are you sure you want to delete this blogger?</p>
                <button onClick={() => handleDeleteBlogger(editBlogger._id)}>Yes, Delete</button>
                <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
            </div>
        );
    };

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

    const renderCategoryList = () => {
        return (
            <div className="category-container">
                <h2>Categories</h2>
                {console.log(categories)}
                {categories.length === 0 && <p>No category, please add</p>}
                <div className="add-category">
                    <h3>Add Category</h3>
                    <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Enter category"
                    />
                    <button onClick={handleAddCategory}>Add Category</button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
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

    const renderEditGuestTab = () => {
        const formatDate = (dateString) => {
            return dateString.split('T')[0]; // Cắt bớt chuỗi ngày tháng năm từ chuỗi đầu vào
        };
        return (
            <div>
                <h2>Edit Guest</h2>
                <input
                    type="text"
                    value={editGuest.name}
                    onChange={(e) => setEditGuest({ ...editGuest, name: e.target.value })}
                    style={{ width: '200px' }}
                />
                <input
                    type="date"
                    value={formatDate(editGuest.dob)}
                    onChange={(e) => setEditGuest({ ...editGuest, dob: e.target.value })}
                    style={{ width: '200px' }}
                />
                <select
                    value={editGuest.gender}
                    onChange={(e) => setEditGuest({ ...editGuest, gender: e.target.value })}
                    style={{ width: '200px' }}
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
                <button onClick={handleEditGuest}>Edit Guest</button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        );
    };

    const renderGuestList = () => {
        const formatDate = (dateString) => {
            return dateString.split('T')[0]; // Cắt bớt chuỗi ngày tháng năm từ chuỗi đầu vào
        };
    
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
                        placeholder="Enter name"
                        style={{ width: '200px' }}
                    />
                    <input
                        type="date"
                        value={formatDate(newGuest.dob)}
                        onChange={(e) => setNewGuest({ ...newGuest, dob: e.target.value })}
                        placeholder="Select date of birth"
                        style={{ width: '200px' }}
                    />
                    <select
                        value={newGuest.gender}
                        onChange={(e) => setNewGuest({ ...newGuest, gender: e.target.value })}
                        style={{ width: '200px' }}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input
                        type="text"
                        value={newGuest.address}
                        onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                        placeholder="Enter address"
                        style={{ width: '500px' }}
                    />
                    <input
                        type="text"
                        value={newGuest.username}
                        onChange={(e) => setNewGuest({ ...newGuest, username: e.target.value })}
                        placeholder="Enter username"
                        style={{ width: '200px' }}
                    />
                    <input
                        type="text"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                        placeholder="Enter email"
                        style={{ width: '200px' }}
                    />
                    <input
                        type="text"
                        value={newGuest.password}
                        onChange={(e) => setNewGuest({ ...newGuest, password: e.target.value })}
                        placeholder="Enter password"
                        style={{ width: '200px' }}
                    />
                    <button onClick={handleAddGuest}>Add Guest</button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
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
                                <th>Email</th>
                                <th>UserName</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map(guest => (
                                <tr key={guest._id}>
                                    <td>{guest._id}</td>
                                    <td>{guest.name}</td>
                                    <td>{formatDate(guest.dob)}</td>
                                    <td>{guest.gender}</td>
                                    <td>{guest.address}</td>
                                    <td>{guest.account.email}</td>
                                    <td>{guest.account.username}</td>
                                    <td>
                                        <button onClick={() => {
                                            setEditGuest({ _id: guest._id, ...guest });
                                            setShowEditGuestTab(true);
                                        }}>Edit</button>
                                        <button onClick={() => {
                                            setShowDeleteConfirmation(true);
                                        }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };
    
    const renderEditBloogerTab = () => {
        const formatDate = (dateString) => {
            return dateString.split('T')[0]; // Cắt bớt chuỗi ngày tháng năm từ chuỗi đầu vào
        };
        return (
            <div>
                <h2>Edit Blogger</h2>
                <input
                    type="text"
                    value={editBlogger.name}
                    onChange={(e) => setEditBlogger({ ...editBlogger, name: e.target.value })}
                    style={{ width: '200px' }}
                />
                <input
                    type="date"
                    value={formatDate(editBlogger.dob)}
                    onChange={(e) => setEditBlogger({ ...editBlogger, dob: e.target.value })}
                    style={{ width: '200px' }}
                />
                <select
                    value={editBlogger.gender}
                    onChange={(e) => setEditBlogger({ ...editBlogger, gender: e.target.value })}
                    style={{ width: '200px' }}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input
                    type="text"
                    value={editBlogger.address}
                    onChange={(e) => setEditBlogger({ ...editBlogger, address: e.target.value })}
                />
                
                <button onClick={handleEditBlogger}>Edit Blogger</button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        );
    };

    const renderBloggerList = () => {
        const formatDate = (dateString) => {
            return dateString.split('T')[0]; // Cắt bớt chuỗi ngày tháng năm từ chuỗi đầu vào
        };
    
        return (
            <div className="blogger-container">
                <h2>Bloggers</h2>
                {bloggers.length === 0 && <p>No bloggers, please add</p>}
                <div className="add-blogger">
                    <h3>Add Blogger</h3>
                    <input
                        type="text"
                        value={newBlogger.name}
                        onChange={(e) => setNewBlogger({ ...newBlogger, name: e.target.value })}
                        placeholder="Enter name"
                        style={{ width: '200px' }}
                    />
                    <input
                        type="date"
                        value={formatDate(newBlogger.dob)}
                        onChange={(e) => setNewBlogger({ ...newBlogger, dob: e.target.value })}
                        placeholder="Select date of birth"
                        style={{ width: '200px' }}
                    />
                    <select
                        value={newBlogger.gender}
                        onChange={(e) => setNewBlogger({ ...newBlogger, gender: e.target.value })}
                        style={{ width: '200px' }}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input
                        type="text"
                        value={newBlogger.address}
                        onChange={(e) => setNewBlogger({ ...newBlogger, address: e.target.value })}
                        placeholder="Enter address"
                        style={{ width: '500px' }}
                    />
                    <input
                        type="text"
                        value={newBlogger.username}
                        onChange={(e) => setNewBlogger({ ...newBlogger, username: e.target.value })}
                        placeholder="Enter username"
                        style={{ width: '200px' }}
                    />
                    <input
                        type="text"
                        value={newBlogger.email}
                        onChange={(e) => setNewBlogger({ ...newBlogger, email: e.target.value })}
                        placeholder="Enter email"
                        style={{ width: '200px' }}
                    />
                    <input
                        type="text"
                        value={newBlogger.password}
                        onChange={(e) => setNewBlogger({ ...newBlogger, password: e.target.value })}
                        placeholder="Enter password"
                        style={{ width: '200px' }}
                    />
                    <button onClick={handleAddBlogger}>Add Blogger</button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
                {bloggers.length > 0 && (
                    <table className="blogger-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th>UserName</th> 
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bloggers.map(blogger => (
                                <tr key={blogger._id}>
                                    <td>{blogger._id}</td>
                                    <td>{blogger.name}</td>
                                    <td>{formatDate(blogger.dob)}</td>
                                    <td>{blogger.gender}</td>
                                    <td>{blogger.address}</td>
                                    <td>{blogger.account.email}</td>
                                    <td>{blogger.account.username}</td>
                                    {/* Render other blogger details */}
                                    <td className="action-buttons">
                                        <button onClick={() => {
                                            setEditBlogger({ _id: blogger._id, ...blogger });
                                            setShowEditBloggerTab(true);
                                        }}>Edit</button>
                                        <button onClick={() => {
                                            setShowDeleteConfirmation(true);
                                        }}>Delete</button>
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

    const handleImageChangeBlogger = (e) => {
        const file = e.target.files[0]; // Get the first file from the list of selected files
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the file
            setNewBlogger({ ...newBlogger, image: imageUrl }); // Save the image URL to the new blogger state 
        }
    };

    

    const renderSidebar = () => {
        return (
            <div className="admin-sidebar">
                <button onClick={() => setSidebarItem('category')}>Category</button>
                <button onClick={() => setSidebarItem('guest')}>Guest</button>
                <button onClick={() => setSidebarItem('blogger')}>Blogger</button>
                <button onClick={() => setSidebarItem('pin')}>Pins</button>
            </div>
        );
    };

    return (
        <div className="admin-container">
            {showToast && <div className="toast">{toastMessage}</div>}
            {renderSidebar()}
            <div className="content">
                {sidebarItem === 'category' && renderCategoryList()}
                {sidebarItem === 'guest' && renderGuestList()}
                {sidebarItem === 'blogger' && renderBloggerList()}
                {sidebarItem === 'pin' && renderPendingPinsTable()}
                {showDeleteConfirmation && renderDeleteConfirmation()}
                {showEditCategoryTab && renderEditCategoryTab()}
                {showEditGuestTab && renderEditGuestTab()}
                {showEditBloggerTab && renderEditBloogerTab()}
            </div>
        </div>
    );
}
