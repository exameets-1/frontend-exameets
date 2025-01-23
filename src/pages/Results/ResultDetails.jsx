import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleResult, resetResultDetails } from '../../store/slices/resultSlice';
import Spinner from '../../components/Spinner';
import { FaArrowLeft, FaCalendarAlt, FaBuilding, FaExternalLinkAlt } from 'react-icons/fa';
import './ResultDetails.css';

const ResultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { result, loading, error } = useSelector((state) => state.results);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleResult(id));
    }
    return () => {
      dispatch(resetResultDetails());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/results');
  };

  const handleVisitResult = () => {
    if (result?.result_link) {
      window.open(result.result_link, '_blank');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!result) return <div>No result found</div>;

  return (
    <div className="result-details-container">
      <div className="result-details-card">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back to Results
        </button>
        <h1>{result.exam_title}</h1>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <FaBuilding />
            </div>
            <div className="detail-content">
              <h3>Organization</h3>
              <p>{result.organization}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FaCalendarAlt />
            </div>
            <div className="detail-content">
              <h3>Exam Date</h3>
              <p>{new Date(result.exam_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FaCalendarAlt />
            </div>
            <div className="detail-content">
              <h3>Result Date</h3>
              <p>{new Date(result.result_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h3>Description</h3>
          <p>{result.description}</p>
        </div>

        <div className="action-section">
          <button className="view-result-btn" onClick={handleVisitResult}>
            <FaExternalLinkAlt /> View Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
