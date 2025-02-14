import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaSave } from 'react-icons/fa';
import { fetchSingleJob, updateJob } from '../../store/slices/jobSlice';
import Spinner from '../Spinner/Spinner';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);
  
  const job = useSelector((state) => state.jobs.singleJob);
  const loading = useSelector((state) => state.jobs.loading);
  const error = useSelector((state) => state.jobs.error);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleJob(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (job) {
      setEditedJob(job);
    }
  }, [job]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateJob({ jobId: id, updatedData: editedJob }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setEditedJob(prev => ({
      ...prev,
      skills_required: skills
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
        <p className="error-message">An error occurred while fetching job details.</p>
        <button onClick={handleBack} className="more-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!editedJob) {
    return (
      <div className="no-data-container">
        <p className="no-data-message">No job details found</p>
        <button onClick={handleBack} className="more-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div className="job-details-header">
        <button onClick={handleBack} className="back-button">
          <FaArrowLeft /> Back to Jobs
        </button>
        {isAuthenticated && user?.role === 'admin' && (
          isEditing ? (
            <button onClick={handleSave} className="edit-button">
              <FaSave /> Save Changes
            </button>
          ) : (
            <button onClick={handleEdit} className="edit-button">
              <FaEdit /> Edit Job
            </button>
          )
        )}
      </div>

      <div className="job-header">
        {isEditing ? (
          <input
            type="text"
            name="role"
            value={editedJob.role || ''}
            onChange={handleInputChange}
            className="edit-input title-input"
          />
        ) : (
          <h1>{editedJob.role || editedJob.job_type || 'Job Position'}</h1>
        )}
        <p className="advt-no">
          Organization: {
            isEditing ? (
              <input
                type="text"
                name="organization"
                value={editedJob.organization || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              editedJob.organization || 'Not specified'
            )
          }
        </p>
      </div>

      <section className="section">
        <h2>Brief Information</h2>
        {isEditing ? (
          <textarea
            name="description"
            value={editedJob.description || ''}
            onChange={handleInputChange}
            className="edit-textarea"
          />
        ) : (
          <p>{editedJob.description || 'No description available'}</p>
        )}
      </section>

      <section className="section">
        <h2>Essential Qualification</h2>
        {isEditing ? (
          <textarea
            name="eligibility_criteria"
            value={editedJob.eligibility_criteria || ''}
            onChange={handleInputChange}
            className="edit-textarea"
          />
        ) : (
          <p>{editedJob.eligibility_criteria || 'No eligibility criteria specified'}</p>
        )}
      </section>

      <section className="section">
        <h2>Required Skills</h2>
        {isEditing ? (
          <textarea
            name="skills_required"
            value={editedJob.skills_required ? editedJob.skills_required.join(', ') : ''}
            onChange={handleSkillsChange}
            placeholder="Enter skills separated by commas"
            className="edit-textarea"
          />
        ) : (
          <ul>
            {editedJob.skills_required && Array.isArray(editedJob.skills_required) ? (
              editedJob.skills_required.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))
            ) : (
              <li>No specific skills mentioned</li>
            )}
          </ul>
        )}
      </section>

      <section className="section">
        <h2>Location</h2>
        {isEditing ? (
          <input
            type="text"
            name="location"
            value={editedJob.location || ''}
            onChange={handleInputChange}
            className="edit-input"
          />
        ) : (
          <p>{editedJob.location || 'Not specified'}</p>
        )}
      </section>

      <section className="section">
        <h2>Experience Required</h2>
        {isEditing ? (
          <input
            type="text"
            name="experience_required"
            value={editedJob.experience_required || ''}
            onChange={handleInputChange}
            className="edit-input"
          />
        ) : (
          <p>{editedJob.experience_required || 'Not specified'}</p>
        )}
      </section>
    </div>
  );
};

export default JobDetails;