import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddAdmitCardModal.css';
import { useSelector } from 'react-redux';

const AddAdmitCardModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        description: '',
        exam_date: '',
        registration_start_date: '',
        registration_end_date: '',
        eligibility_criteria: '',
        download_link: '',
        organization: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const {isAuthenticated, user} = useSelector((state) => state.user);

    const handleLogin = () => {
        // Implement login logic here
        // For example, redirect to the login page
        window.location.href = '/login';
    };

    const fieldTypes = {
        title: { type: 'string', label: 'Title' },
        organization: { type: 'string', label: 'Organization' },
        description: { type: 'string', label: 'Description', multiline: true },
        exam_date: { type: 'text', label: 'Exam Date' },
        registration_start_date: { type: 'text', label: 'Registration Start Date' },
        registration_end_date: { type: 'text', label: 'Registration End Date' },
        eligibility_criteria: { type: 'string', label: 'Eligibility Criteria', multiline: true },
        download_link: { type: 'url', label: 'Download Link' }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                    <h2>Add New Admit Card</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="admit-card-form">
                    {Object.entries(fieldTypes).map(([fieldName, fieldInfo]) => (
                        <div key={fieldName} className="form-group">
                            <label htmlFor={fieldName}>
                                {fieldInfo.label}
                                <span className="field-type">({fieldInfo.type})</span>
                            </label>
                            {fieldInfo.multiline ? (
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
                                    type={fieldInfo.type === 'url' ? 'url' : 'text'}
                                    id={fieldName}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                    required
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
                            Add Admit Card
                        </button>
                        ) : (
                            <button className="submit-button" onClick={handleLogin}>
                                Login to Add Admit Card
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdmitCardModal;
