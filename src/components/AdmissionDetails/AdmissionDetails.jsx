import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaArrowLeft,
    FaEdit,
    FaSave
} from 'react-icons/fa';
import { fetchSingleAdmission, resetAdmissionDetails, updateAdmission } from '../../store/slices/admissionSlice';
import { useTheme } from '../../App';
import Spinner from '../Spinner/Spinner';
import './AdmissionDetails.css';

const AdmissionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedAdmission, setEditedAdmission] = useState(null);
    
    const { darkMode } = useTheme();

    const admission = useSelector((state) => state.admissions.admission);
    const loading = useSelector((state) => state.admissions.loading);
    const error = useSelector((state) => state.admissions.error);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleAdmission(id));
        }
        return () => {
            dispatch(resetAdmissionDetails());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (admission) {
            setEditedAdmission(admission);
        }
    }, [admission]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await dispatch(updateAdmission({ admissionId: id, updatedData: editedAdmission }));
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update admission:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAdmission(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">An error occurred while fetching admission details.</p>
                <button onClick={handleBack} className="more-btn">
                    Go Back
                </button>
            </div>
        );
    }

    if (!editedAdmission) {
        return (
            <div className="no-data-container">
                <p className="no-data-message">No admission details found</p>
                <button onClick={handleBack} className="more-btn">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className={`admission-details-container ${darkMode ? 'dark' : ''}`}>
            <div className="admission-details-header">
                <button onClick={handleBack} className="back-button">
                    <FaArrowLeft /> Back to Admissions
                </button>
                {isAuthenticated && user?.role === 'admin' && (
                    isEditing ? (
                        <button onClick={handleSave} className="edit-button">
                            <FaSave /> Save Changes
                        </button>
                    ) : (
                        <button onClick={handleEdit} className="edit-button">
                            <FaEdit /> Edit
                        </button>
                    )
                )}
            </div>

            <div className="admission-header">
                {isEditing ? (
                    <input
                        type="text"
                        name="title"
                        value={editedAdmission.title || ''}
                        onChange={handleInputChange}
                        className="edit-input title-input"
                    />
                ) : (
                    <h1>{editedAdmission.title}</h1>
                )}
                <p className="institution">
                    {isEditing ? (
                        <input
                            type="text"
                            name="institution"
                            value={editedAdmission.institution || ''}
                            onChange={handleInputChange}
                            className="edit-input"
                        />
                    ) : (
                        editedAdmission.institution
                    )}
                </p>
            </div>

            <section className="section">
                <h2>Course Details</h2>
                {isEditing ? (
                    <textarea
                        name="course_details"
                        value={editedAdmission.course_details || ''}
                        onChange={handleInputChange}
                        className="edit-textarea"
                    />
                ) : (
                    <p>{editedAdmission.course_details}</p>
                )}
            </section>

            <section className="section">
                <h2>Important Dates</h2>
                <div className="important-dates">
                    <div className="date-item">
                        <span>Application Start:</span>
                        {isEditing ? (
                            <input
                                type="date"
                                name="application_start"
                                value={editedAdmission.application_start ? new Date(editedAdmission.application_start).toISOString().split('T')[0] : ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{editedAdmission.application_start ? new Date(editedAdmission.application_start).toLocaleDateString() : 'Not specified'}</span>
                        )}
                    </div>
                    <div className="date-item">
                        <span>Application Deadline:</span>
                        {isEditing ? (
                            <input
                                type="date"
                                name="application_deadline"
                                value={editedAdmission.application_deadline ? new Date(editedAdmission.application_deadline).toISOString().split('T')[0] : ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{editedAdmission.application_deadline ? new Date(editedAdmission.application_deadline).toLocaleDateString() : 'Not specified'}</span>
                        )}
                    </div>
                </div>
            </section>

            <section className="section">
                <h2>Eligibility Criteria</h2>
                {isEditing ? (
                    <textarea
                        name="eligibility_criteria"
                        value={editedAdmission.eligibility_criteria || ''}
                        onChange={handleInputChange}
                        className="edit-textarea"
                    />
                ) : (
                    <p>{editedAdmission.eligibility_criteria}</p>
                )}
            </section>

            <section className="section">
                <h2>Fee Structure</h2>
                {isEditing ? (
                    <textarea
                        name="fee_structure"
                        value={editedAdmission.fee_structure || ''}
                        onChange={handleInputChange}
                        className="edit-textarea"
                    />
                ) : (
                    <p>{editedAdmission.fee_structure}</p>
                )}
            </section>

            <section className="section">
                <h2>How to Apply</h2>
                {isEditing ? (
                    <div className="application-process">
                        <textarea
                            name="application_process"
                            value={editedAdmission.application_process || ''}
                            onChange={handleInputChange}
                            className="edit-textarea"
                            placeholder="Application process details..."
                        />
                        <input
                            type="url"
                            name="application_link"
                            value={editedAdmission.application_link || ''}
                            onChange={handleInputChange}
                            className="edit-input"
                            placeholder="Application URL"
                        />
                    </div>
                ) : (
                    <div className="application-process">
                        <p>{editedAdmission.application_process}</p>
                        {editedAdmission.application_link && (
                            <a
                                href={editedAdmission.application_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="apply-button"
                            >
                                Apply Now
                            </a>
                        )}
                    </div>
                )}
            </section>

            <section className="section">
                <h2>Additional Information</h2>
                {isEditing ? (
                    <textarea
                        name="additional_info"
                        value={editedAdmission.additional_info || ''}
                        onChange={handleInputChange}
                        className="edit-textarea"
                    />
                ) : (
                    <p>{editedAdmission.additional_info}</p>
                )}
            </section>
        </div>
    );
};

export default AdmissionDetails;