import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchSingleJob } from '../store/slices/jobSlice';
import Spinner from './Spinner';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const job = useSelector((state) => state.jobs.singleJob);
  const loading = useSelector((state) => state.jobs.loading);
  const error = useSelector((state) => state.jobs.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleJob(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
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

  if (!job) {
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
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Back to Jobs
      </button>

      <div className="job-header">
        <h1>{job.role || job.job_type || 'Job Position'}</h1>
        <p className="advt-no">Organization: {job.organization || 'Not specified'}</p>
      </div>

      <section className="section">
        <h2>Brief Information</h2>
        <p>{job.description || 'No description available'}</p>
      </section>

      <section className="section">
        <h2>Essential Qualification</h2>
        <p>{job.eligibility_criteria || 'No eligibility criteria specified'}</p>
      </section>

      <section className="section">
        <h2>Required Skills</h2>
        <ul>
          {job.skills_required && Array.isArray(job.skills_required) ? (
            job.skills_required.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))
          ) : (
            <li>No specific skills mentioned</li>
          )}
        </ul>
      </section>

      <section className="section">
        <h2>Organization Details</h2>
        <p>Organization: {job.organization || 'Not specified'}</p>
      </section>
      <section className="section">
        <h2>Location</h2>
        <p>{job.location || 'Not specified'}</p>
      </section>
      <section className="section">
        <h2>Experience Required</h2>
        <p>{job.experience_required || 'Not specified'}</p>
      </section>
      <section className="section">
        <h2>Salary Range</h2>
        <p>{job.salary_range || 'Not specified'}</p>
      </section>
      <section className="section important-dates">
        <h2>Important Dates</h2>
        <ul>
          <li>
            <span>Posted Date:</span>
            <span>{job.post_date ? new Date(job.post_date).toLocaleDateString() : 'Not specified'}</span>
          </li>
          <li>
            <span>Last Date to Apply:</span>
            <span>{job.last_date ? new Date(job.last_date).toLocaleDateString() : 'Not specified'}</span>
          </li>
        </ul>
      </section>

      <section className="section important-links">
        <h2>Important Links</h2>
        <ul>
          {job.application_link ? (
            <li>
              <a href={job.application_link} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </li>
          ) : (
            <li>Application link not available</li>
          )}
        </ul>
      </section>

      <div className="more-notifications">
        <button onClick={handleBack} className="more-btn">
          More Notifications
        </button>
      </div>
    </div>
  );
};

export default JobDetails;