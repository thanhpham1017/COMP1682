import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name: ''
    });
    const [editCategory, setEditCategory] = useState({
        _id: '',
        name: ''
    });
    const navigate = useNavigate();

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

    const handleEditCategory = async () => {
        try {
            const response = await fetch(`http://localhost:4000/category/edit/:id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editCategory.name }),
            });
            if (!response.ok) {
                throw new Error('Failed to edit category');
            }
            await fetchCategories();
            setEditCategory({ _id: '', name: '' });
        } catch (error) {
            console.error('Error editing category:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/category/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete category');
            }
            await fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="admin-container">
            <h1>Categories</h1>
            {categories.length === 0 && <p>No category, please add</p>}
            <div>
                <h2>Add Category</h2>
                <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <button onClick={handleAddCategory}>Add Category</button>
            </div>
            {categories.length > 0 && (
                <>
                    <div>
                        <h2>Edit Category</h2>
                        <select
                            value={editCategory._id}
                            onChange={(e) => {
                                const selectedCategory = categories.find(category => category._id === e.target.value);
                                setEditCategory({ ...editCategory, _id: e.target.value, name: selectedCategory.name });
                            }}
                        >
                            <option value="">Select Category to Edit</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={editCategory.name}
                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                        />
                        <button onClick={handleEditCategory}>Edit Category</button>
                    </div>
                    <div>
                        <h2>Delete Category</h2>
                        <select onChange={(e) => handleDeleteCategory(e.target.value)}>
                            <option value="">Select Category to Delete</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}
        </div>
    );
}
