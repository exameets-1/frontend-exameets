import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { fetchSingleAdmission, updateAdmission } from "../../store/slices/admissionSlice";
import Spinner from "../Spinner/Spinner";
import './AdmissionDetails.css';

const AdmissionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedAdmission, setEditedAdmission] = useState(null);
    const [newKeyword, setNewKeyword] = useState('');

    const admission = useSelector((state) => state.admissions.admission);
    const loading = useSelector((state) => state.admissions.loading);
    const error = useSelector((state) => state.admissions.error);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    
    useEffect(() => {
        if (id) {
            dispatch(fetchSingleAdmission(id));
        }
    }, [dispatch, id]);
    
    useEffect(() => {
        if (admission) {
            setEditedAdmission({
                ...admission,
                keywords: admission.keywords || []
            });
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
        setEditedAdmission((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditedAdmission((prev) => ({
            ...prev,
            [name]: checked
        }));
    };
    
    const handleAddKeyword = () => {
        if (newKeyword.trim()) {
            setEditedAdmission((prev) => ({
                ...prev,
                keywords: [...(prev.keywords || []), newKeyword.trim()]
            }));
            setNewKeyword('');
        }
    };
    
    const handleRemoveKeyword = (index) => {
        setEditedAdmission((prev) => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index)
        }));
    };
    
    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;
    if (!admission || !editedAdmission) return <div>Loading admission details...</div>;
    
    return (
        <div className="job-details-container">
            <button className="back-button" onClick={handleBack}>
                <FaArrowLeft /> Back
            </button>
            
            {isAuthenticated && user?.role === 'admin' && (
                <div className="edit-controls">
                    {isEditing ? (
                        <button className="save-button" onClick={handleSave}>
                            <FaSave /> Save Changes
                        </button>
                    ) : (
                        <button className="edit-button" onClick={handleEdit}>
                            <FaEdit /> Edit
                        </button>
                    )}
                </div>
            )}
            
            <div className="job-header">
                <h1>
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={editedAdmission?.title || ''}
                            onChange={handleInputChange}
                            placeholder="Title"
                        />
                    ) : (
                        editedAdmission?.title
                    )}
                </h1>
            </div>
            
            <div className="section">
                <h2>Organization Details</h2>
                <p>
                    <strong>Institute Name: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="institute"
                            value={editedAdmission?.institute || ''}
                            onChange={handleInputChange}
                            placeholder="Organization name"
                        />
                    ) : (
                        editedAdmission?.institute
                    )}
                </p>
                <p>
                    <strong>Location: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="location"
                            value={editedAdmission?.location || ''}
                            onChange={handleInputChange}
                            placeholder="Location"
                        />
                    ) : (
                        editedAdmission?.location
                    )}
                </p>
                <p>
                    <strong>Category: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="category"
                            value={editedAdmission?.category || ''}
                            onChange={handleInputChange}
                            placeholder="Field"
                        />
                    ) : (
                        editedAdmission?.field || 'Not specified'
                    )}
                </p>
            </div>

            <div className="section">
                <h2>Admission Details</h2>
                <p>
                    <strong>Description: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="description"
                            value={editedAdmission?.description || ''}
                            onChange={handleInputChange}
                            placeholder="Description"
                        />
                    ) : (
                        editedAdmission?.description
                    )}
                </p>
                <p>
                    <strong>Course: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="course"
                            value={editedAdmission?.course || ''}
                            onChange={handleInputChange}
                            placeholder="Internship type"
                        />
                    ) : (
                        editedAdmission?.course
                    )}
                </p>
                <p>
                    <strong>Fees: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="fees"
                            value={editedAdmission?.fees || ''}
                            onChange={handleInputChange}
                            placeholder="Fees"
                        />
                    ) : (
                        editedAdmission?.fees
                    )}
                </p>
                <p>
          <strong>Featured: </strong>
                {isEditing ? (
                    <input
                    type="checkbox"
                    name="is_featured"
                    checked={editedAdmission?.is_featured || false}
                    onChange={handleCheckboxChange}
                    />
                ) : (
                    editedAdmission?.is_featured ? 'Yes' : 'No'
                )}
                </p>
                <p>
                    <strong>Eligibility: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="eligibility_criteria"
                            value={editedAdmission?.eligibility_criteria || ''}
                            onChange={handleInputChange}
                            placeholder="Eligibility"
                        />
                    ) : (
                        editedAdmission?.eligibility_criteria
                    )}
                </p>
                <p>
                    <strong>Start Date: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="start_date"
                            value={editedAdmission?.start_date || ''}
                            onChange={handleInputChange}
                            placeholder="Start Date"
                        />
                    ) : (
                        editedAdmission?.start_date
                    )}
                </p>
                <p>
                    <strong>Last Date: </strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="last_date"
                            value={editedAdmission?.last_date || ''}
                            onChange={handleInputChange}
                            placeholder="Last Date"
                        />
                    ) : (
                        editedAdmission?.last_date
                    )}
                </p>
            </div>

            <div className="section">
                <h2>Keywords</h2>
                {isEditing ? (
                <div className="edit-array-field">
                    <div className="add-item-form">
                    <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add a keyword"
                    />
                    <button onClick={handleAddKeyword}><FaPlus /></button>
                    </div>
                    <ul className="editable-list">
                    {editedAdmission?.keywords?.map((keyword, index) => (
                        <li key={index}>
                        {keyword}
                        <button onClick={() => handleRemoveKeyword(index)}><FaTimes /></button>
                        </li>
                    ))}
                    </ul>
                </div>
                ) : (
                <div className="keywords-container">
                    {editedAdmission?.keywords?.length > 0 ? 
                    editedAdmission.keywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                    )) : 
                    <p>No keywords specified</p>
                    }
                </div>
                )}
            </div>

            <div className="section">
                <h2>SEO Fields</h2>
                {isEditing ? (
        <div className="section">
          <h2>URL Slug</h2>
          <input
            type="text"
            name="slug"
            value={editedAdmission?.slug || ''}
            onChange={handleInputChange}
            placeholder="URL-friendly slug"
          />
          <p className="field-hint">This will be used in the URL (must be unique)</p>
        </div>
      ) : (
        <div className="section">
          <h2>URL Slug</h2>
          <p>{editedAdmission?.slug || 'Not specified'}</p>
        </div>
      )}
                <div className="section">
        <h2>Search Description</h2>
        {isEditing ? (
          <textarea
            name="searchDescription"
            value={editedAdmission?.searchDescription || ''}
            onChange={handleInputChange}
            rows="3"
            placeholder="Brief description for search results"
          />
        ) : (
          <p>{editedAdmission?.searchDescription || 'Not provided'}</p>
        )}
      </div>
            </div>
        </div>
    );
};

export default AdmissionDetails;
                
            
    

                
            
    
