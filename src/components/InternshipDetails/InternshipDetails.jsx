import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaSave } from 'react-icons/fa';
import { fetchSingleInternship, updateInternship } from '../../store/slices/internshipSlice';
import Spinner from '../Spinner/Spinner';
import './InternshipDetails.css';

const InternshipDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInternship, setEditedInternship] = useState(null);
  
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
      setEditedInternship(internship);
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
    } catch (error) {
      console.error('Failed to update internship:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInternship((prev) => ({
      ...prev,
      [name]: value
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
            />
          ) : (
            editedInternship?.location
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
            />
          ) : (
            editedInternship?.stipend
          )}
        </p>
      </div>

      <div className="section">
        <h2>Description</h2>
        {isEditing ? (
          <textarea
            name="description"
            value={editedInternship?.description || ''}
            onChange={handleInputChange}
            rows="5"
          />
        ) : (
          <p>{editedInternship?.description}</p>
        )}
      </div>

      <div className="section">
        <h2>Requirements</h2>
        {isEditing ? (
          <textarea
            name="eligibility_criteria"
            value={editedInternship?.eligibility_criteria || ''}
            onChange={handleInputChange}
            rows="3"
          />
        ) : (
          <p>{editedInternship?.eligibility_criteria}</p>
        )}
      </div>

      <div className="section important-dates">
        <h2>Important Dates</h2>
        <ul>
          <li>
            <span>Start Date:</span>
            {isEditing ? (
              <input
                type="date"
                name="start_date"
                value={editedInternship?.start_date ? new Date(editedInternship.start_date).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
              />
            ) : (
              editedInternship?.start_date ? new Date(editedInternship.start_date).toLocaleDateString() : 'Not specified'
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
    </div>
  );
};

export default InternshipDetails;