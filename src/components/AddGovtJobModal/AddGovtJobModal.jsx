import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddGovtJobModal.css';
import { useSelector } from 'react-redux';

const AddGovtJobModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        job_type: '',
        department: '',
        location: '',
        organization: '',
        post_date: new Date().toISOString().split('T')[0],
        eligibility_criteria: '',
        application_link: '',
        salary_range: '',
        last_date: '',
        valid_until: '',
        result_link: '',
        description: '',
        qualifications: '',
        role: '',
        vacancy: '',
        post: '',
        notification_about: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const {isAuthenticated, user} = useSelector((state) => state.user);

    const fieldTypes = {
        notification_about: {
            type: 'select',
            label: 'Government Job Type',
            options: [
                'UPSC',
                'SSC (Staff Selection Commission)',
                'IBPS and Banking Jobs',
                'Teaching and Academia',
                'Railway Recruitment',
                'Defense and Paramilitary',
                'State Government Jobs',
                'Public Sector Undertakings (PSUs)',
                'Medical Sector',
                'Judiciary and Legal Services',
                'Insurance Sector Jobs',
                'Teaching & Research',
                'Post Office Jobs',
                'Agriculture and Rural Development',
                'Indian Railways',
                'Defense Research and Development',
                'Law and Judiciary',
                'Environment and Forest Services',
                'Economic and Statistical Services',
                'Media and Communication',
                'Public Sector Energy Companies',
                'Social and Welfare Sector',
                'Customs and Excise',
                'Taxation Services',
                'Cooperative Sector Jobs',
                'Transport and Civil Aviation',
                'Tourism and Hospitality',
                'Cultural and Heritage Jobs',
                'Science and Technology',
                'Meteorological Department Jobs'
            ]
        },
        job_type: { 
            type: 'select', 
            label: 'Job Type',
            options: ['Full Time', 'Part Time', 'Contract']
        },
        department: { type: 'string', label: 'Department' },
        location: { type: 'string', label: 'Location' },
        organization: { type: 'string', label: 'Organization' },
        post_date: { type: 'date', label: 'Post Date' },
        eligibility_criteria: { type: 'string', label: 'Eligibility Criteria', multiline: true },
        application_link: { type: 'string', label: 'Application Link' },
        salary_range: { type: 'string', label: 'Salary Range' },
        last_date: { type: 'text', label: 'Last Date to Apply' },
        valid_until: { type: 'text', label: 'Valid Until' },
        result_link: { type: 'string', label: 'Result Link' },
        description: { type: 'string', label: 'Description', multiline: true },
        qualifications: { type: 'string', label: 'Qualifications', multiline: true },
        role: { type: 'string', label: 'Role' },
        vacancy: { type: 'string', label: 'Number of Vacancies' },
        post: { type: 'string', label: 'Post Name' }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const onLogin = () => {
        window.location.href = '/login';
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format dates for submission
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
                    <h2>Add New Government Job</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="job-form">
                    {Object.entries(fieldTypes).map(([fieldName, fieldInfo]) => (
                        <div key={fieldName} className="form-group">
                            <label htmlFor={fieldName}>
                                {fieldInfo.label}
                                <span className="field-type">
                                    ({fieldInfo.type}
                                    {fieldInfo.required === false ? ', optional' : ''})
                                </span>
                            </label>
                            {fieldInfo.type === 'select' ? (
                                <select
                                    id={fieldName}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                    required={fieldInfo.required !== false}
                                    className="form-select"
                                >
                                    <option value="">Select {fieldInfo.label}</option>
                                    {fieldInfo.options.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : fieldInfo.type === 'boolean' ? (
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id={fieldName}
                                        name={fieldName}
                                        checked={formData[fieldName]}
                                        onChange={handleChange}
                                        className="form-checkbox"
                                    />
                                    <span className="checkbox-label">
                                        {formData[fieldName] ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            ) : fieldInfo.multiline ? (
                                <textarea
                                    id={fieldName}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                    required={fieldInfo.required !== false}
                                    rows={4}
                                    placeholder={`Enter ${fieldInfo.label.toLowerCase()}`}
                                />
                            ) : (
                                <input
                                    type={fieldInfo.type === 'url' ? 'url' : 'text'}
                                    id={fieldName}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                    required={fieldInfo.required !== false}
                                    placeholder={`Enter ${fieldInfo.label.toLowerCase()}`}
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
                                Add Government Job
                            </button>
                        ) : (
                            <button type="button" className="submit-button" onClick={onLogin}>
                                Login to Add Job
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGovtJobModal;