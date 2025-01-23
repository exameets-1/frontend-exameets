import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchSingleGovtJob } from '../store/slices/govtJobSlice';
import Spinner from './Spinner';
import './JobDetails.css';

const GovtJobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Fix: Update selector to match Redux state structure
  const { job, loading, error } = useSelector((state) => state.govtJobs);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleGovtJob(id));
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
        <h1>{job.job_type}</h1>
        <p className="advt-no">Department: {job.department}</p>
      </div>

      <section className="section">
        <h2>Brief Information</h2>
        <p>{job.description}</p>
      </section>

      <section className="section">
        <h2>Essential Qualification</h2>
        <p>{job.eligibility_criteria}</p>
      </section>

      <section className="section">
        <h2>Organization Details</h2>
        <p>Organization: {job.organization}</p>
      </section>
      <section className="section">
        <h2>Location</h2>
        <p>Location: {job.location}</p>
      </section>
      <section className="section">
        <h2>Salary Range</h2>
        <p>Salary Range: {job.salary_range}</p>
      </section>
      <section className="section important-dates">
        <h2>Important Dates</h2>
        <ul>
          <li>
            <span>Posted Date:</span>
            <span>{new Date(job.post_date).toLocaleDateString()}</span>
          </li>
          <li>
            <span>Last Date to Apply:</span>
            <span>{job.last_date}</span>
          </li>
          {job.valid_until && (
            <li>
              <span>Valid Until:</span>
              <span>{job.valid_until}</span>
            </li>
          )}
        </ul>
      </section>

      <section className="section important-links">
        <h2>Important Links</h2>
        <ul>
          <li>
            <a href={job.application_link} target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </li>
          {job.result_link && (
            <li>
              <a href={job.result_link} target="_blank" rel="noopener noreferrer">
                View Results
              </a>
            </li>
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

export default GovtJobDetails;