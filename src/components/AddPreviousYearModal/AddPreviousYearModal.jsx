import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddPreviousYearModal.css';
import { useSelector } from 'react-redux';

const AddPreviousYearModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        exam_name: '',
        description: '',
        subject: '',
        year: new Date().getFullYear(),
        difficulty_level: '',
        category: '',
        paper_link: '',
        solution_link: '',
        is_featured: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const {isAuthenticated, user} = useSelector((state) => state.user);

    const categories = [
        'Engineering',
        'Medical',
        'Civil Services',
        'Banking',
        'Railways',
        'Teaching',
        'Defence',
        'State Services',
        'Other'
    ];

    const difficultyLevels = [
        'Easy',
        'Medium',
        'Hard',
        'Very Hard'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogin = () => {
        // Handle login logic (e.g., redirect to login page)
        window.location.href = '/login';
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    // Generate year options (last 20 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add Previous Year Paper</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="previous-year-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter paper title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exam_name">Exam Name</label>
                            <input
                                type="text"
                                id="exam_name"
                                name="exam_name"
                                value={formData.exam_name}
                                onChange={handleChange}
                                required
                                placeholder="Enter exam name"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="Enter subject name"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="year">Year</label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="difficulty_level">Difficulty Level</label>
                            <select
                                id="difficulty_level"
                                name="difficulty_level"
                                value={formData.difficulty_level}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select difficulty</option>
                                {difficultyLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Enter paper description"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="paper_link">Question Paper Link</label>
                        <input
                            type="url"
                            id="paper_link"
                            name="paper_link"
                            value={formData.paper_link}
                            onChange={handleChange}
                            required
                            placeholder="Enter question paper URL"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="solution_link">Solution Link (Optional)</label>
                        <input
                            type="url"
                            id="solution_link"
                            name="solution_link"
                            value={formData.solution_link}
                            onChange={handleChange}
                            placeholder="Enter solution paper URL"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                            />
                            Featured Paper
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        {isAuthenticated && user?.role === 'admin' ? (
                            <button type="submit" className="submit-button">
                                Add Paper
                            </button>
                        ) : (
                            <button type="submit" className="submit-button" onClick={handleLogin}>
                                Login to Add Paper
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPreviousYearModal;
