import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaSave } from 'react-icons/fa';
import { fetchSingleAdmitCard, updateAdmitCard } from '../../store/slices/admitCardSlice';
import Spinner from '../../components/Spinner';

const AdmitCardDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAdmitCard, setEditedAdmitCard] = useState(null);
  
  const admitCard = useSelector((state) => state.admitCards.admitCard);
  const loading = useSelector((state) => state.admitCards.loading);
  const error = useSelector((state) => state.admitCards.error);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleAdmitCard(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (admitCard) {
      setEditedAdmitCard(admitCard);
    }
  }, [admitCard]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateAdmitCard({ admitCardId: id, updatedData: editedAdmitCard }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update admit card:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAdmitCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <p className="error-message">An error occurred while fetching admit card details.</p>
        <button onClick={handleBack} className="more-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!editedAdmitCard) {
    return (
      <div className="no-data-container">
        <p className="no-data-message">No admit card details found</p>
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
          <FaArrowLeft /> Back to Admit Cards
        </button>
        {isAuthenticated && user?.role === 'admin' && (
          isEditing ? (
            <button onClick={handleSave} className="edit-button">
              <FaSave /> Save Changes
            </button>
          ) : (
            <button onClick={handleEdit} className="edit-button">
              <FaEdit /> Edit Admit Card
            </button>
          )
        )}
      </div>

      <div className="job-header">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedAdmitCard.title || ''}
            onChange={handleInputChange}
            className="edit-input title-input"
          />
        ) : (
          <h1>{editedAdmitCard.title || 'Admit Card'}</h1>
        )}
        <p className="advt-no">
          Organization: {
            isEditing ? (
              <input
                type="text"
                name="organization"
                value={editedAdmitCard.organization || ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              editedAdmitCard.organization || 'Not specified'
            )
          }
        </p>
      </div>

      <section className="section">
        <h2>Exam Details</h2>
        {isEditing ? (
          <textarea
            name="exam_details"
            value={editedAdmitCard.exam_details || ''}
            onChange={handleInputChange}
            className="edit-textarea"
          />
        ) : (
          <p>{editedAdmitCard.exam_details || 'No details available'}</p>
        )}
      </section>

      <section className="section">
        <h2>Important Dates</h2>
        <div className="date-info">
          <div>
            <strong>Release Date:</strong>
            {isEditing ? (
              <input
                type="date"
                name="release_date"
                value={editedAdmitCard.release_date ? new Date(editedAdmitCard.release_date).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <p>{formatDate(editedAdmitCard.release_date)}</p>
            )}
          </div>
          <div>
            <strong>Exam Date:</strong>
            {isEditing ? (
              <input
                type="date"
                name="exam_date"
                value={editedAdmitCard.exam_date ? new Date(editedAdmitCard.exam_date).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <p>{formatDate(editedAdmitCard.exam_date)}</p>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Instructions</h2>
        {isEditing ? (
          <textarea
            name="instructions"
            value={editedAdmitCard.instructions || ''}
            onChange={handleInputChange}
            className="edit-textarea"
          />
        ) : (
          <p>{editedAdmitCard.instructions || 'No instructions available'}</p>
        )}
      </section>

      <section className="section download-section">
        <h2>Download Admit Card</h2>
        {editedAdmitCard.download_link ? (
          <a
            href={editedAdmitCard.download_link}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            Download Admit Card
          </a>
        ) : (
          <p>No download link available</p>
        )}
        {isEditing && (
          <input
            type="url"
            name="download_link"
            value={editedAdmitCard.download_link || ''}
            onChange={handleInputChange}
            className="edit-input"
            placeholder="Enter download link"
          />
        )}
      </section>
    </div>
  );
};

export default AdmitCardDetails;