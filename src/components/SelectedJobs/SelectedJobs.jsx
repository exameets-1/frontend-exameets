import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMatchedJobs } from '../../store/slices/userSlice';
import { fetchLatestAdmissions } from '../../store/slices/admissionSlice';
import { fetchLatestInternships } from '../../store/slices/internshipSlice';
import { fetchLatestScholarships } from '../../store/slices/scholarshipSlice';
import { fetchLatestResults } from '../../store/slices/resultSlice'; 
import './SelectedJobs.css';

export default function SelectedJobs() {
  const { matchedJobs, loading, user } = useSelector((state) => state.user);
  const { latestAdmissions, loading: admissionsLoading } = useSelector((state) => state.admissions);
  const { latestInternships, loading: internshipsLoading } = useSelector((state) => state.internships);
  const { latestScholarships, loading: scholarshipsLoading } = useSelector((state) => state.scholarships);
  const { latestResults, loading: resultsLoading } = useSelector((state) => state.results);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const { notifications_about } = user?.preferences || {};
    const preference = notifications_about?.toLowerCase() || '';
    
    switch (preference) {
      case 'admissions':
        dispatch(fetchLatestAdmissions());
        break;
      case 'internships':
        dispatch(fetchLatestInternships());
        break;
      case 'scholarships':
        dispatch(fetchLatestScholarships());
        break;
      case 'results':
        dispatch(fetchLatestResults());
        break;
      default:
        dispatch(fetchMatchedJobs());
    }
  }, [dispatch, user?.preferences]);

  const isLoading = loading || admissionsLoading || internshipsLoading || scholarshipsLoading || resultsLoading;

  const handleItemClick = (itemId) => {
    const { notifications_about } = user?.preferences || {};
    const preference = notifications_about || '';
    
    if(preference === 'admissions'){
      navigate(`/admission/get/${itemId}`);
    } else if(preference === 'internships'){
      navigate(`/internship/get/${itemId}`);
    } else if(preference === 'scholarships'){
      navigate(`/scholarship/get/${itemId}`);
    } else if(preference === 'results'){
      navigate(`/result/get/${itemId}`);
    } else if (preference === 'IT' || preference === 'NON-IT') {
      navigate(`/job/get/${itemId}`);
    } else {
      navigate(`/govtjob/get/${itemId}`);
    }
  };

  const handleViewAll = () => {
    const { notifications_about } = user?.preferences || {};
    const preference = notifications_about?.toLowerCase() || '';
    
    if(preference === 'admissions'){
      navigate(`/admissions`);
    } else if(preference === 'internships'){
      navigate(`/internships`);
    } else if(preference === 'scholarships'){
      navigate(`/scholarships`);
    } else if(preference === 'results'){
      navigate(`/results`);
    } else if (preference === 'it' || preference === 'non-it') {
      navigate(`/selected-jobs`);
    } else {
      navigate(`/govtjobs`);
    }
  }

  const getEntryTitle = (item, type) => {
    if (!item) return '';
    
    switch(type) {
      case 'job':
        return `${item.jobTitle || ''} at ${item.organization || item.companyName || ''}`;
      case 'internship':
        return `${item.jobTitle || ''} at ${item.organization || item.company || ''}`;
      case 'scholarship':
        return `${item.title || ''} - ${item.organization || item.company || ''}`;
      case 'admission':
        return `${item.title || ''} - ${item.institute || ''}`;
      case 'result':
        return `${item.exam_title || ''} - ${item.organization || item.company || ''}`;
      default:
        return item.title || '';
    }
  };

  const renderContent = () => {
    const { notifications_about } = user?.preferences || {};
    const preference = notifications_about?.toLowerCase() || '';
    
    let data = [];
    let type = '';

    switch (preference) {
      case 'admissions':
        data = latestAdmissions || [];
        type = 'admission';
        break;
      case 'internships':
        data = latestInternships || [];
        type = 'internship';
        break;
      case 'scholarships':
        data = latestScholarships || [];
        type = 'scholarship';
        break;
      case 'results':
        data = latestResults || [];
        type = 'result';
        break;
      default:
        data = matchedJobs?.jobs || [];
        type = 'job';
    }

    if (!data.length) {
      return (
        <div className="no-jobs">
          <p>No Matched Content Found</p>
          <p>Update your preferences to see content that matches your interests.</p>
        </div>
      );
    }

    return (
      <div className="teams-table-container">
        <div className="scrollable-content">
          <table className="teams-table">
            <tbody>
              {data.map((item) => (
                <tr 
                  key={item._id}
                  onClick={() => handleItemClick(item._id)}
                  className="clickable-row"
                >
                  <td>{getEntryTitle(item, type)}</td>
                  <td>
                    <button className="verify-button">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="teams-container">
        <div className="teams-wrapper">
          <div className="selected-jobs-header">
          <h2>For You</h2>
          </div>
          <div className="notification-type">
            <h2>Preference Selected: {user?.preferences?.notifications_about}</h2>
            </div>
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            renderContent()
          )}
          <div className="view-all">
            <button onClick={handleViewAll} className="verify-button">View All</button>
          </div>
        </div>
      </div>
    </>
  );
}