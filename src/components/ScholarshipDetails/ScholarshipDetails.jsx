import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaArrowLeft,
    FaGraduationCap,
    FaCalendar,
    FaUniversity,
    FaMoneyBill,
    FaEdit,
    FaSave,
    FaStar,
    FaLink,
    FaPlus,
    FaTimes
} from 'react-icons/fa';
import { fetchSingleScholarship, updateScholarship } from '../../store/slices/scholarshipSlice';
import { toast } from 'react-toastify';
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
    const [newKeyword, setNewKeyword] = useState('');

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
            toast.success('Scholarship updated successfully');
        } catch (error) {
            console.error('Failed to update scholarship:', error);
            toast.error('Failed to update scholarship');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedScholarship(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddKeyword = () => {
        if (newKeyword.trim()) {
            const updatedKeywords = [
                ...(editedScholarship.keywords || []),
                newKeyword.trim()
            ];
            
            setEditedScholarship(prev => ({
                ...prev,
                keywords: updatedKeywords
            }));
            
            setNewKeyword(''); // Clear the input after adding
        }
    };

    const handleDeleteKeyword = (keywordToDelete) => {
        const updatedKeywords = (editedScholarship.keywords || [])
            .filter(keyword => keyword !== keywordToDelete);
        
        setEditedScholarship(prev => ({
            ...prev,
            keywords: updatedKeywords
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

    const categoryOptions = [
        'Merit-based', 'Need-based', 'Research', 'Sports', 
        'Cultural', 'International', 'Government', 'Private', 'Other'
    ];

    const qualOptions = [
        'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Graduation', 'Post Graduation', 'Post Graduation Diploma', 'Phd', 'ITI', 'Polytechnic/Diploma', 'Post Doctoral', 'Vocational Course', 'Coaching classes', 'Other'
    ];

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
                                    placeholder="Scholarship Title"
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
                                    placeholder="Organization"
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
                                <select
                                    name="qualification"
                                    value={editedScholarship.qualification || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                >
                                    {qualOptions.map(qual => (
                                        <option key={qual} value={qual}>{qual}</option>
                                    ))}
                                </select>
                            ) : (
                                <span>Qualification: {editedScholarship.qualification}</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="start_date"
                                        value={editedScholarship.start_date || ''}
                                        onChange={handleInputChange}
                                        className="edit-input"
                                        placeholder="Start Date"
                                    />
                                    <input
                                        type="text"
                                        name="last_date"
                                        value={editedScholarship.last_date || ''}
                                        onChange={handleInputChange}
                                        className="edit-input"
                                        placeholder="Last Date"
                                    />
                                </>
                            ) : (
                                <span>
                                    Start Date: {editedScholarship.start_date || 'Not specified'}
                                    <br />
                                    Last Date: {editedScholarship.last_date || 'Not specified'}
                                </span>
                            )}
                        </div>
                        <div className="detail-item">
                            <FaMoneyBill className="icon" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="amount"
                                    value={editedScholarship.amount || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    placeholder="Scholarship Amount"
                                />
                            ) : (
                                <span>Amount: {editedScholarship.amount || 'Not specified'}</span>
                            )}
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="info-grid">
                        <div className="info-item">
                            <FaUniversity className="icon" />
                            {isEditing ? (
                                <select
                                    name="category"
                                    value={editedScholarship.category || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                >
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            ) : (
                                <span>Category: {editedScholarship.category}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <FaStar className="icon" />
                            {isEditing ? (
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={editedScholarship.is_featured || false}
                                        onChange={handleInputChange}
                                    />
                                    Featured Scholarship
                                </label>
                            ) : (
                                <span>Featured: {editedScholarship.is_featured ? 'Yes' : 'No'}</span>
                            )}
                        </div>
                    </div>

                    {/* Description and Eligibility Section */}
                    <div className="description-section">
                        <h3>About the Scholarship</h3>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={editedScholarship.description || ''}
                                onChange={handleInputChange}
                                className="edit-textarea"
                                rows="4"
                                placeholder="Scholarship Description"
                            />
                        ) : (
                            <p>{editedScholarship.description}</p>
                        )}
                        
                        <h4>Eligibility Criteria</h4>
                        {isEditing ? (
                            <textarea
                                name="eligibility_criteria"
                                value={editedScholarship.eligibility_criteria || ''}
                                onChange={handleInputChange}
                                className="edit-textarea"
                                rows="4"
                                placeholder="Eligibility Criteria"
                            />
                        ) : (
                            <p>{editedScholarship.eligibility_criteria || 'No specific eligibility criteria listed'}</p>
                        )}

                        <div className="keywords-management-section">
                        <h4>Keywords</h4>
                        {isEditing ? (
                            <div className="keywords-edit-container">
                                <div className="keyword-input-group">
                                    <input
                                        type="text"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        className="edit-input keyword-input"
                                        placeholder="Enter a new keyword"
                                    />
                                    <button 
                                        onClick={handleAddKeyword} 
                                        className="add-keyword-button"
                                        disabled={!newKeyword.trim()}
                                    >
                                        <FaPlus /> Add Keyword
                                    </button>
                                </div>
                                <div className="existing-keywords">
                                    {editedScholarship.keywords && editedScholarship.keywords.map((keyword, index) => (
                                        <div key={index} className="keyword-tag-edit">
                                            <span>{keyword}</span>
                                            <button 
                                                onClick={() => handleDeleteKeyword(keyword)}
                                                className="delete-keyword-button"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="keywords-list">
                                {editedScholarship.keywords && editedScholarship.keywords.length > 0 ? 
                                    editedScholarship.keywords.map((keyword, index) => (
                                        <span key={index} className="keyword-tag">{keyword}</span>
                                    ))
                                    : 
                                    <span>No keywords</span>
                                }
                            </div>
                        )}
                    </div>
                    </div>

                    {/* Search Description */}
                    <div className="search-description-section">
                        <h4>Search Description</h4>
                        {isEditing ? (
                            <textarea
                                name="searchDescription"
                                value={editedScholarship.searchDescription || ''}
                                onChange={handleInputChange}
                                className="edit-textarea"
                                rows="3"
                                placeholder="Search Description"
                            />
                        ) : (
                            <p>{editedScholarship.searchDescription || 'No search description provided'}</p>
                        )}
                    </div>

                    {/* Additional Fields */}
                    <div className="additional-fields">
                        <div className="info-item">
                            <FaLink className="icon" />
                            {isEditing ? (
                                <input
                                    type="url"
                                    name="application_link"
                                    value={editedScholarship.application_link || ''}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                    placeholder="Application Link"
                                />
                            ) : (
                                <a 
                                    href={editedScholarship.application_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="apply-button"
                                >
                                    Apply Now
                                </a>
                            )}
                        </div>

                        <div className="slug-section">
                        <h4>Slug</h4>
                        {isEditing ? (
                            <input
                                type="text"
                                name="slug"
                                value={editedScholarship.slug || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                                placeholder="Enter scholarship slug"
                            />
                        ) : (
                            <span>Slug: {editedScholarship.slug || 'Not generated'}</span>
                        )}
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
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