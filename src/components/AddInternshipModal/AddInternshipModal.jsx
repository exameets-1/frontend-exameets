import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddInternshipModal.css';
import { useSelector } from 'react-redux';

const AddInternshipModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        internship_type: '',
        title: '',
        start_date: '',
        duration: '',
        skills_required: '',
        stipend: '',
        post_date: new Date().toISOString().split('T')[0],
        organization: '',
        location: '',
        qualification: '',
        eligibility_criteria: '',
        application_link: '',
        last_date: '',
        is_featured: false,
        field: '',
        description: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const {isAuthenticated, user} = useSelector((state) => state.user);

    const internshipTypes = [
        'Full-time',
        'Part-time',
        'Remote',
        'Work from Home',
        'Hybrid'
    ];

    const fields = [
        'Software Development',
        'Data Science',
        'Web Development',
        'Mobile Development',
        'UI/UX Design',
        'Digital Marketing',
        'Content Writing',
        'Business Development',
        'Human Resources',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'skills_required') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleLogin = () => {
        window.location.href = '/login';
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert skills string to array
        const formattedData = {
            ...formData,
            skills_required: formData.skills_required.split(',').map(skill => skill.trim()),
            post_date: new Date().toISOString(),
            start_date: new Date(formData.start_date).toISOString(),
            last_date: new Date(formData.last_date).toISOString()
        };

        onSubmit(formattedData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Internship</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="internship-form">
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
                                placeholder="Enter internship title"
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
                            <label htmlFor="internship_type">Internship Type</label>
                            <select
                                id="internship_type"
                                name="internship_type"
                                value={formData.internship_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select type</option>
                                {internshipTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="field">Field</label>
                            <select
                                id="field"
                                name="field"
                                value={formData.field}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select field</option>
                                {fields.map(field => (
                                    <option key={field} value={field}>{field}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_date">Start Date</label>
                            <input
                                type="date"
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
                                type="date"
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
                            <label htmlFor="duration">Duration</label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 3 months"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stipend">Stipend</label>
                            <input
                                type="text"
                                id="stipend"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleChange}
                                required
                                placeholder="e.g., ₹10,000/month"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter location"
                            />
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="skills_required">Skills Required (comma-separated)</label>
                        <input
                            type="text"
                            id="skills_required"
                            name="skills_required"
                            value={formData.skills_required}
                            onChange={handleChange}
                            required
                            placeholder="e.g., React, Node.js, MongoDB"
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
                            placeholder="Enter internship description"
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
                            Featured Internship
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        {isAuthenticated && user?.role === "admin" ? (
                            <button type="submit" className="submit-button">
                                Add Internship
                            </button>
                        ) : (
                            <button type="button" onClick={handleLogin} className="submit-button">
                                Login to Add Internship
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInternshipModal;
