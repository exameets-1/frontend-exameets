import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { fetchSingleInternship, updateInternship } from '../../store/slices/internshipSlice';
import Spinner from '../Spinner/Spinner';
import './InternshipDetails.css';
import { toast } from 'react-toastify';

const InternshipDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInternship, setEditedInternship] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newEligibilityCriteria, setNewEligibilityCriteria] = useState('');
  
  const internship = useSelector((state) => state.internships.internship);
  const loading = useSelector((state) => state.internships.loading);
  const error = useSelector((state) => state.internships.error);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleInternship(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (internship) {
      setEditedInternship({
        ...internship,
        skills_required: internship.skills_required || [],
        keywords: internship.keywords || [],
        eligibility_criteria: internship.eligibility_criteria || []
      });
    }
  }, [internship]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateInternship({ internshipId: id, updatedData: editedInternship }));
      setIsEditing(false);
      toast.success('Internship updated successfully');
    } catch (error) {
      console.error('Failed to update internship:', error);
      toast.error('Failed to update internship');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInternship((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedInternship((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setEditedInternship((prev) => ({
        ...prev,
        skills_required: [...(prev.skills_required || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setEditedInternship((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((_, i) => i !== index)
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setEditedInternship((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setEditedInternship((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleAddEligibilityCriteria = () => {
    if (newEligibilityCriteria.trim()) {
      setEditedInternship((prev) => ({
        ...prev,
        eligibility_criteria: [...(prev.eligibility_criteria || []), newEligibilityCriteria.trim()]
      }));
      setNewEligibilityCriteria('');
    }
  };

  const handleRemoveEligibilityCriteria = (index) => {
    setEditedInternship((prev) => ({
      ...prev,
      eligibility_criteria: prev.eligibility_criteria.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!internship || !editedInternship) return <div>Loading internship details...</div>;

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
              value={editedInternship?.title || ''}
              onChange={handleInputChange}
              placeholder="Title"
            />
          ) : (
            editedInternship?.title
          )}
        </h1>
      </div>

      <div className="section">
        <h2>Organization Details</h2>
        <p>
          <strong>Company: </strong>
          {isEditing ? (
            <input
              type="text"
              name="organization"
              value={editedInternship?.organization || ''}
              onChange={handleInputChange}
              placeholder="Organization name"
            />
          ) : (
            editedInternship?.organization
          )}
        </p>
        <p>
          <strong>Location: </strong>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={editedInternship?.location || ''}
              onChange={handleInputChange}
              placeholder="Location"
            />
          ) : (
            editedInternship?.location
          )}
        </p>
        <p>
          <strong>Field: </strong>
          {isEditing ? (
            <input
              type="text"
              name="field"
              value={editedInternship?.field || ''}
              onChange={handleInputChange}
              placeholder="Field"
            />
          ) : (
            editedInternship?.field || 'Not specified'
          )}
        </p>
      </div>

      <div className="section">
        <h2>Internship Details</h2>
        <p>
          <strong>Type: </strong>
          {isEditing ? (
            <input
              type="text"
              name="internship_type"
              value={editedInternship?.internship_type || ''}
              onChange={handleInputChange}
              placeholder="Internship type"
            />
          ) : (
            editedInternship?.internship_type
          )}
        </p>
        <p>
          <strong>Duration: </strong>
          {isEditing ? (
            <input
              type="text"
              name="duration"
              value={editedInternship?.duration || ''}
              onChange={handleInputChange}
              placeholder="Duration"
            />
          ) : (
            editedInternship?.duration
          )}
        </p>
        <p>
          <strong>Stipend: </strong>
          {isEditing ? (
            <input
              type="text"
              name="stipend"
              value={editedInternship?.stipend || ''}
              onChange={handleInputChange}
              placeholder="Stipend amount"
            />
          ) : (
            editedInternship?.stipend
          )}
        </p>
        <p>
          <strong>Qualification: </strong>
          {isEditing ? (
            <input
              type="text"
              name="qualification"
              value={editedInternship?.qualification || ''}
              onChange={handleInputChange}
              placeholder="Required qualification"
            />
          ) : (
            editedInternship?.qualification || 'Not specified'
          )}
        </p>
        <p>
          <strong>Featured: </strong>
          {isEditing ? (
            <input
              type="checkbox"
              name="is_featured"
              checked={editedInternship?.is_featured || false}
              onChange={handleCheckboxChange}
            />
          ) : (
            editedInternship?.is_featured ? 'Yes' : 'No'
          )}
        </p>
      </div>

      <div className="section">
        <h2>Skills Required</h2>
        {isEditing ? (
          <div className="edit-array-field">
            <div className="add-item-form">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
              />
              <button onClick={handleAddSkill}><FaPlus /></button>
            </div>
            <ul className="editable-list">
              {editedInternship?.skills_required?.map((skill, index) => (
                <li key={index}>
                  {skill}
                  <button onClick={() => handleRemoveSkill(index)}><FaTimes /></button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul>
            {editedInternship?.skills_required?.length > 0 ? 
              editedInternship.skills_required.map((skill, index) => (
                <li key={index}>{skill}</li>
              )) : 
              <li>No specific skills mentioned</li>
            }
          </ul>
        )}
      </div>

      <div className="section">
        <h2>Description</h2>
        {isEditing ? (
          <textarea
            name="description"
            value={editedInternship?.description || ''}
            onChange={handleInputChange}
            rows="5"
            placeholder="Internship description"
          />
        ) : (
          <p>{editedInternship?.description}</p>
        )}
      </div>

      <div className="section">
        <h2>Search Description</h2>
        {isEditing ? (
          <textarea
            name="searchDescription"
            value={editedInternship?.searchDescription || ''}
            onChange={handleInputChange}
            rows="3"
            placeholder="Brief description for search results"
          />
        ) : (
          <p>{editedInternship?.searchDescription || 'Not provided'}</p>
        )}
      </div>

      <div className="section">
        <h2>Eligibility Criteria</h2>
        {isEditing ? (
          <div className="edit-array-field">
            <div className="add-item-form">
              <input
                type="text"
                value={newEligibilityCriteria}
                onChange={(e) => setNewEligibilityCriteria(e.target.value)}
                placeholder="Add eligibility criteria"
              />
              <button onClick={handleAddEligibilityCriteria}><FaPlus /></button>
            </div>
            <ul className="editable-list">
              {editedInternship?.eligibility_criteria?.map((criteria, index) => (
                <li key={index}>
                  {criteria}
                  <button onClick={() => handleRemoveEligibilityCriteria(index)}><FaTimes /></button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul>
            {editedInternship?.eligibility_criteria?.length > 0 ? 
              editedInternship.eligibility_criteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              )) : 
              <li>No specific eligibility criteria mentioned</li>
            }
          </ul>
        )}
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
              {editedInternship?.keywords?.map((keyword, index) => (
                <li key={index}>
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(index)}><FaTimes /></button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="keywords-container">
            {editedInternship?.keywords?.length > 0 ? 
              editedInternship.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">{keyword}</span>
              )) : 
              <p>No keywords specified</p>
            }
          </div>
        )}
      </div>

      <div className="section important-dates">
        <h2>Important Dates</h2>
        <ul>
          <li>
            <span>Start Date: </span>
            {isEditing ? (
              <input
                type="text"
                name="start_date"
                value={editedInternship?.start_date || ''}
                onChange={handleInputChange}
                placeholder="Start date"
              />
            ) : (
              editedInternship?.start_date || 'Not specified'
            )}
          </li>
          <li>
            <span>Last Date to Apply: </span>
            {isEditing ? (
              <input
                type="text"
                name="last_date"
                value={editedInternship?.last_date || ''}
                onChange={handleInputChange}
                placeholder="Application deadline"
              />
            ) : (
              editedInternship?.last_date || 'Not specified'
            )}
          </li>
        </ul>
      </div>

      <div className="section important-links">
        <h2>How to Apply</h2>
        <ul>
          <li>
            <strong>Application Link: </strong>
            {isEditing ? (
              <input
                type="url"
                name="application_link"
                value={editedInternship?.application_link || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/apply"
              />
            ) : (
              <a
                href={editedInternship?.application_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </a>
            )}
          </li>
        </ul>
      </div>

      {isEditing ? (
        <div className="section">
          <h2>URL Slug</h2>
          <input
            type="text"
            name="slug"
            value={editedInternship?.slug || ''}
            onChange={handleInputChange}
            placeholder="URL-friendly slug"
          />
          <p className="field-hint">This will be used in the URL (must be unique)</p>
        </div>
      ) : (
        <div className="section">
          <h2>URL Slug</h2>
          <p>{editedInternship?.slug || 'Not specified'}</p>
        </div>
      )}
    </div>
  );
};

export default InternshipDetails;