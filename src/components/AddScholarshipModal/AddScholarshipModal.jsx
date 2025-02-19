import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddScholarshipModal.css';
import { useSelector } from 'react-redux';

const AddScholarshipModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        organization: '',
        description: '',
        eligibility_criteria: '',
        amount: '',
        application_link: '',
        start_date: '',
        last_date: '',
        category: '',
        qualification: '',
        is_featured: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const {isAuthenticated, user} = useSelector((state) => state.user);

    const handleLogin = () => {
        // Implement login logic here
        // For example, redirect to the login page
        window.location.href = '/login';
    };

    const categories = [
        'Merit-based',
        'Need-based',
        'Research',
        'Sports',
        'Cultural',
        'International',
        'Government',
        'Private',
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
                    <h2>Add New Scholarship</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="scholarship-form">
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
                                placeholder="Enter scholarship title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="organization">Organization</label>
                            <input
                                type="text"
                                id="organization"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                required
                                placeholder="Enter organization name"
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
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                placeholder="e.g., ₹50,000 per year"
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
                                placeholder="e.g., 01/01/2024"
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
                                placeholder="e.g., 01/01/2024"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="qualification">Qualification Required</label>
                        <input
                            type="text"
                            id="qualification"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            required
                            placeholder="Enter required qualification"
                        />
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
                            placeholder="Enter scholarship description"
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
                            Featured Scholarship
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        {isAuthenticated && user.role === 'admin' ? (
                            <button type="submit" className="submit-button">
                                Add Scholarship
                            </button>
                        ) : (
                            <button type="button" onClick={handleLogin} className="submit-button">
                                Login to Add Scholarship
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddScholarshipModal;
