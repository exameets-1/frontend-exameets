import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddJobModal.css';
import { useSelector } from 'react-redux';

const AddJobModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        job_type: '',
        organization: '',
        location: '',
        role: '',
        experience_required: '',
        skills_required: '',
        post_date: new Date().toISOString().split('T')[0],
        eligibility_criteria: '',
        application_link: '',
        description: '',
        salary_range: '',
        category: '',
        last_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
        vacancy: '',
        qualification: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const {isAuthenticated, user} = useSelector((state) => state.user);

    const handleLogin = () => {
        // Handle login logic (e.g., redirect to login page)
        window.location.href = '/login';
    };

    const fieldTypes = {
        category: {
            type: 'select',
            label: 'Category',
            options: ['IT','NON-IT']
        },
        job_type: { 
            type: 'select', 
            label: 'Job Type',
            options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']
        },
        organization: { type: 'string', label: 'Organization' },
        location: { type: 'string', label: 'Location' },
        role: { type: 'string', label: 'Role' },
        experience_required: { type: 'string', label: 'Experience Required' },
        skills_required: { type: 'array', label: 'Skills Required (comma-separated)' },
        post_date: { type: 'date', label: 'Post Date' },
        eligibility_criteria: { type: 'string', label: 'Eligibility Criteria', multiline: true },
        application_link: { type: 'url', label: 'Application Link' },
        description: { type: 'string', label: 'Description', multiline: true },
        salary_range: { type: 'string', label: 'Salary Range' },
        last_date: { type: 'date', label: 'Last Date to Apply' },
        valid_until: { type: 'date', label: 'Valid Until' },
        vacancy: { type: 'string', label: 'Number of Vacancies' },
        qualification: { type: 'string', label: 'Qualification', multiline: true }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'skills_required') {
            setFormData(prev => ({
                ...prev,
                [name]: value // Store the raw string input
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert skills string to array before submission
        const skillsArray = formData.skills_required
            ? formData.skills_required.split(',').map(skill => skill.trim()).filter(Boolean)
            : [];

        // Validate skills
        if (skillsArray.length === 0) {
            alert('Please enter at least one required skill');
            return;
        }

        // Validate dates
        const today = new Date();
        const postDate = new Date(formData.post_date);
        const lastDate = new Date(formData.last_date);
        const validUntil = new Date(formData.valid_until);

        if (postDate > lastDate) {
            alert('Post date cannot be after last date to apply');
            return;
        }

        if (lastDate > validUntil) {
            alert('Last date to apply cannot be after valid until date');
            return;
        }

        if (validUntil < today) {
            alert('Valid until date must be in the future');
            return;
        }

        // Submit with processed skills array
        onSubmit({
            ...formData,
            skills_required: skillsArray,
            post_date: new Date(formData.post_date).toISOString(),
            last_date: new Date(formData.last_date).toISOString(),
            valid_until: new Date(formData.valid_until).toISOString()
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Job</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="job-form">
                    {Object.entries(fieldTypes).map(([fieldName, fieldInfo]) => (
                        <div key={fieldName} className="form-group">
                            <label htmlFor={fieldName}>
                                {fieldInfo.label}
                                <span className="field-type">({fieldInfo.type})</span>
                            </label>
                            {fieldInfo.type === 'select' ? (
                                <select
                                    id={fieldName}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select {fieldInfo.label}</option>
                                    {fieldInfo.options.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : fieldInfo.multiline ? (
                                <textarea
                                    id={fieldName}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder={`Enter ${fieldInfo.label.toLowerCase()}`}
                                />
                            ) : (
                                <input
                                    type={fieldInfo.type === 'date' ? 'date' : fieldInfo.type === 'url' ? 'url' : 'text'}
                                    id={fieldName}
                                    name={fieldName}
                                    value={fieldInfo.type === 'array' 
                                        ? formData[fieldName]
                                        : formData[fieldName]}
                                    onChange={handleChange}
                                    required
                                    placeholder={fieldInfo.type === 'array' 
                                        ? "Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                                        : `Enter ${fieldInfo.label.toLowerCase()}`}
                                />
                            )}
                        </div>
                    ))}
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        {isAuthenticated && user?.role === 'admin' ? (
                            <button type="submit" className="submit-button">
                                Add Job
                            </button>
                        ) : (
                            <button type="button" onClick={handleLogin} className="login-button">
                                Login to Add Job
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJobModal;
