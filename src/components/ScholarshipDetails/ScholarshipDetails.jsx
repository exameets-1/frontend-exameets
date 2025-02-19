import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaArrowLeft,
    FaGraduationCap,
    FaMapMarker,
    FaCalendar,
    FaUniversity,
    FaMoneyBill,
    FaEdit,
    FaSave
} from 'react-icons/fa';
import { fetchSingleScholarship, updateScholarship } from '../../store/slices/scholarshipSlice';
import './ScholarshipDetails.css';

const ScholarshipDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const scholarship = useSelector((state) => state.scholarships.scholarship);
    const loading = useSelector((state) => state.scholarships.loading);
    const error = useSelector((state) => state.scholarships.error);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editedScholarship, setEditedScholarship] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleScholarship(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (scholarship) {
            setEditedScholarship(scholarship);
        }
    }, [scholarship]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await dispatch(updateScholarship(id, editedScholarship));
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update scholarship:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedScholarship(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!editedScholarship) {
        return <div className="error">Scholarship not found</div>;
    }

    return (
        <div className="scholarship-details">
            <div className="back-navigation">
                <div className="back-link" onClick={handleBack}>
                    <FaArrowLeft />
                    <span>Back to Scholarships</span>
                </div>
            </div>
            
            <div className="container">
                <div className="content-wrapper">
                    {/* Header Section */}
                    <div className="header-section">
                        <h1 className="title">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="title"
                                    value={editedScholarship.title || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                />
                            ) : (
                                editedScholarship.title
                            )}
                        </h1>
                        <h2 className="organization">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="organization"
                                    value={editedScholarship.organization || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                />
                            ) : (
                                editedScholarship.organization
                            )}
                        </h2>
                    </div>

                    {/* Key Details Section */}
                    <div className="details-grid">
                        <div className="detail-item">
                            <FaGraduationCap className="icon" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="educationLevel"
                                    value={editedScholarship.educationLevel || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    placeholder="Education Level"
                                />
                            ) : (
                                <span>{editedScholarship.educationLevel || 'Eligibility criteria not specified'}</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <FaMapMarker className="icon" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="country"
                                    value={editedScholarship.country || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    placeholder="Country"
                                />
                            ) : (
                                <span>{editedScholarship.country}</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="deadline"
                                    value={editedScholarship.deadline}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                />
                            ) : (
                                <span>Deadline: {editedScholarship.deadline ? new Date(editedScholarship.deadline).toLocaleDateString() : 'Not specified'}</span>
                            )}
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="info-grid">
                        <div className="info-item">
                            <FaUniversity className="icon" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="category"
                                    value={editedScholarship.category || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    placeholder="Category"
                                />
                            ) : (
                                <span>Type: {editedScholarship.category}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <FaMoneyBill className="icon" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="amount"
                                    value={editedScholarship.amount || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    placeholder="Amount"
                                />
                            ) : (
                                <span>Amount: {editedScholarship.amount}</span>
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="description-section">
                        <h3>About the Scholarship</h3>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={editedScholarship.description || ''}
                                onChange={handleInputChange}
                                className="edit-textarea"
                                rows="4"
                            />
                        ) : (
                            <p>{editedScholarship.description}</p>
                        )}
                        
                        <h4>Requirements</h4>
                        {isEditing ? (
                            <textarea
                                name="requirements"
                                value={Array.isArray(editedScholarship.requirements) ? editedScholarship.requirements.join('\n') : ''}
                                onChange={(e) => {
                                    const requirements = e.target.value.split('\n').filter(req => req.trim());
                                    handleInputChange({
                                        target: {
                                            name: 'requirements',
                                            value: requirements
                                        }
                                    });
                                }}
                                className="edit-textarea"
                                rows="4"
                                placeholder="Enter each requirement on a new line"
                            />
                        ) : (
                            <ul className="requirements-list">
                                {editedScholarship.requirements ? 
                                    editedScholarship.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))
                                    :
                                    ['No specific requirements listed'].map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))
                                }
                            </ul>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        {isEditing ? (
                            <input
                                type="url"
                                name="applicationLink"
                                value={editedScholarship.applicationLink || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                                placeholder="Application Link"
                            />
                        ) : (
                            <a 
                                href={editedScholarship.applicationLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="apply-button"
                            >
                                Apply Now
                            </a>
                        )}
                        
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
                </div>
            </div>
        </div>
    );
};

export default ScholarshipDetails;
