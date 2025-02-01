import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddResultModal.css';
import { useSelector } from 'react-redux';

const AddResultModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        exam_title: '',
        result_date: new Date().toISOString().split('T')[0],
        exam_date: '',
        organization: '',
        result_link: '',
        description: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const {isAuthenticated, user} = useSelector((state) => state.user);

    const fieldTypes = {
        exam_title: { type: 'string', label: 'Exam Title' },
        result_date: { type: 'date', label: 'Result Date' },
        exam_date: { type: 'date', label: 'Exam Date' },
        organization: { type: 'string', label: 'Organization' },
        result_link: { type: 'url', label: 'Result Link' },
        description: { type: 'string', label: 'Description', multiline: true }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = () => {
        // Handle login logic (e.g., redirect to login page)
        window.location.href = '/login';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate dates
        const examDate = new Date(formData.exam_date);
        const resultDate = new Date(formData.result_date);

        if (resultDate < examDate) {
            alert('Result date cannot be before exam date');
            return;
        }

        // Format dates for submission
        const formattedData = {
            ...formData,
            exam_date: new Date(formData.exam_date).toISOString(),
            result_date: new Date(formData.result_date).toISOString()
        };

        onSubmit(formattedData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Result</h2>
                    <button onClick={onClose} className="close-button">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="result-form">
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
                                    type={fieldInfo.type === 'date' ? 'date' : fieldInfo.type === 'url' ? 'url' : 'text'}
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
                                Add Result
                            </button>
                        ) : (
                            <button type="submit" className="submit-button" onClick={handleLogin}>
                                Login to Add Result
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResultModal;
