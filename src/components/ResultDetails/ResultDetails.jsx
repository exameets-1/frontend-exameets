import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleResult, resetResultDetails, updateResult } from '../../store/slices/resultSlice';
import Spinner from '../Spinner/Spinner';
import { FaArrowLeft, FaCalendarAlt, FaBuilding, FaExternalLinkAlt, FaEdit, FaSave } from 'react-icons/fa';
import './ResultDetails.css';

const ResultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { result, loading, error } = useSelector((state) => state.results);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleResult(id));
    }
    return () => {
      dispatch(resetResultDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (result) {
      setEditedResult(result);
    }
  }, [result]);

  const handleBack = () => {
    navigate('/results');
  };

  const handleVisitResult = () => {
    if (result?.result_link) {
      window.open(result.result_link, '_blank');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateResult(id, editedResult));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update result:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedResult(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!editedResult) return <div>No result found</div>;

  return (
    <div className="result-card-details p-2 bg-[#DFF1FF]">
      <div className="result-details-container">
        <div className="result-details-card bg-white pl-[40px] pr-[40px] pt-[10px] pb-[20px]">
          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft />
          </button>

          <div className="text-center text-3xl font-bold text-[#015990] m-4">
            {isEditing ? (
              <input
                type="text"
                name="exam_title"
                value={editedResult.exam_title || ''}
                onChange={handleInputChange}
                className="edit-input w-full text-center"
              />
            ) : (
              editedResult.exam_title
            )}
          </div>

          <div className="details-grid mt-10">
            <div className="detail-item bg-[#C0E3FF] p-4 rounded-lg flex items-center gap-3">
              <div className="detail-icon">
                <FaBuilding />
              </div>
              <div className="detail-content">
                {isEditing ? (
                  <input
                    type="text"
                    name="organization"
                    value={editedResult.organization || ''}
                    onChange={handleInputChange}
                    className="edit-input w-full"
                  />
                ) : (
                  <p>Organization: {editedResult.organization}</p>
                )}
              </div>
            </div>

            <div className="detail-item bg-[#C0E3FF] p-4 rounded-lg flex items-center gap-3">
              <div className="detail-icon">
                <FaCalendarAlt />
              </div>
              <div className="detail-content">
                {isEditing ? (
                  <input
                    type="text"
                    name="exam_date"
                    value={editedResult.exam_date}
                    onChange={handleInputChange}
                    className="edit-input w-full"
                  />
                ) : (
                  <p>Exam Date: {editedResult.exam_date}</p>
                )}
              </div>
            </div>

            <div className="detail-item bg-[#C0E3FF] p-4 rounded-lg flex items-center gap-3">
              <div className="detail-icon">
                <FaCalendarAlt />
              </div>
              <div className="detail-content">
                {isEditing ? (
                  <input
                    type="text"
                    name="result_date"
                    value={editedResult.result_date}
                    onChange={handleInputChange}
                    className="edit-input w-full"
                  />
                ) : (
                  <p>Result Date: {editedResult.result_date}</p>
                )}
              </div>
            </div>
          </div>

          <div className="description-section mt-6">
            <h3 className="font-bold mb-2">Description</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editedResult.description || ''}
                onChange={handleInputChange}
                className="edit-textarea w-full p-2 border rounded"
              />
            ) : (
              <p>{editedResult.description}</p>
            )}
          </div>

          <div className="action-section flex items-center justify-center text-center mt-6 gap-4">
            {isEditing ? (
              <>
                <input
                  type="url"
                  name="result_link"
                  value={editedResult.result_link || ''}
                  onChange={handleInputChange}
                  className="edit-input w-full p-2 border rounded"
                  placeholder="Enter result link"
                />
                <button className="edit-button bg-[#015990] text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleSave}>
                  <FaSave /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button className="view-result-btn bg-[#015990] text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleVisitResult}>
                  <FaExternalLinkAlt /> View Result
                </button>
                {isAuthenticated && user?.role === 'admin' && (
                  <button className="edit-button bg-[#015990] text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleEdit}>
                    <FaEdit /> Edit
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
