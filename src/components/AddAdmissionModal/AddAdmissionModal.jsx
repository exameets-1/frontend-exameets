import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddAdmissionModal.css';
import {useSelector} from 'react-redux'

const AddAdmissionModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        institute: '',
        description: '',
        eligibility_criteria: '',
        course: '',
        application_link: '',
        start_date: '',
        last_date: '',
        category: '',
        fees: '',
        location: '',
        is_featured: false,
    };

    const [formData, setFormData] = useState(initialFormData);

    const {isAuthenticated, user} = useSelector((state) => state.user);

    const categories = [
        'Engineering',
        'Medical',
        'Arts',
        'Science',
        'Commerce',
        'Management',
        'Law',
        'Design',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            handleLogin();
            return;
        }

        // Format dates to ISO string
        const formattedData = {
            ...formData,
        };

        onSubmit(formattedData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Admission</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="admission-form">
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
                                placeholder="Enter admission title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="institute">Institute</label>
                            <input
                                type="text"
                                id="institute"
                                name="institute"
                                value={formData.institute}
                                onChange={handleChange}
                                required
                                placeholder="Enter institute name"
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
                            <label htmlFor="course">Course</label>
                            <input
                                type="text"
                                id="course"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                placeholder="Enter course name"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_date">Start Date</label>
                            <input
                                type="text"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_date">Last Date to Apply</label>
                            <input
                                type="text"
                                id="last_date"
                                name="last_date"
                                value={formData.last_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fees">Fees</label>
                            <input
                                type="text"
                                id="fees"
                                name="fees"
                                value={formData.fees}
                                onChange={handleChange}
                                required
                                placeholder="Enter course fees"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter institute location"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="eligibility_criteria">Eligibility Criteria</label>
                        <textarea
                            id="eligibility_criteria"
                            name="eligibility_criteria"
                            value={formData.eligibility_criteria}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Enter eligibility criteria"
                        />
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
                            placeholder="Enter admission description"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="application_link">Application Link</label>
                        <input
                            type="url"
                            id="application_link"
                            name="application_link"
                            value={formData.application_link}
                            onChange={handleChange}
                            required
                            placeholder="Enter application URL"
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
                            Featured Admission
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        {isAuthenticated && user?.role === 'admin' ? (
                            <button type="submit" className="submit-button">
                                Add Admission
                            </button>
                        ) : (
                            <button className="submit-button" onClick={handleLogin}>
                                Login to Add Admission
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdmissionModal;
