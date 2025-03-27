import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleAdmitCard, resetAdmitCard, updateAdmitCard } from '../../store/slices/admitCardSlice';
import Spinner from '../Spinner/Spinner';
import { 
  FaArrowLeft, 
  FaExternalLinkAlt, 
  FaEdit, 
  FaSave,
  FaLink
} from 'react-icons/fa';

const AdmitCardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admitCard, loading, error } = useSelector((state) => state.admitCards);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAdmitCard, setEditedAdmitCard] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchSingleAdmitCard(id));
    return () => dispatch(resetAdmitCard());
  }, [dispatch, id]);

  useEffect(() => {
    if (admitCard) setEditedAdmitCard(JSON.parse(JSON.stringify(admitCard)));
  }, [admitCard]);

  const handleBack = () => navigate('/admitcards');

  const handleVisitAdmitCard = () => {
    const downloadLink = editedAdmitCard?.importantLinks?.find(link => link.linkType === 'downloadLink');
    if (downloadLink) {
      window.open(downloadLink.link, '_blank');
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      await dispatch(updateAdmitCard({ 
        admitCardId: id, 
        updatedData: editedAdmitCard 
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleInputChange = (path, value) => {
    const paths = path.split('.');
    setEditedAdmitCard(prev => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]] = { ...current[paths[i]] };
      }
      // Special handling for isFeatured checkbox
      if (path === 'isFeatured') {
        current[paths[paths.length - 1]] = value === 'on' ? true : false;
      } else {
        current[paths[paths.length - 1]] = value;
      }
      return newState;
    });
  };

  const renderEditableField = (label, value, path, type = 'text') => (
    <div className="detail-item bg-[#C0E3FF] p-4 rounded-lg flex items-center gap-3 mb-4">
      <div className="detail-content w-full">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
          type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleInputChange(path, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          ) : (
            <input
              type={type}
              value={value || ''}
              onChange={(e) => handleInputChange(path, e.target.value)}
              className="edit-input w-full mt-1 p-2 border rounded"
            />
          )
        ) : (
          <p className="mt-1">
            {type === 'url' && value ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {value}
              </a>
            ) : (
              type === 'checkbox' ? (
                value ? 'Yes' : 'No'
              ) : (
                value || 'N/A'
              )
            )}
          </p>
        )}
      </div>
    </div>
  );

  const renderListSection = (title, items, path) => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {isEditing ? (
        <div className="space-y-2">
          {items?.map((item, index) => (
            <input
              key={index}
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                handleInputChange(path, newItems);
              }}
              className="edit-input w-full mb-2 p-2 border rounded"
            />
          ))}
          <button
            className="add-item-btn text-sm text-blue-600"
            onClick={() => handleInputChange(path, [...(items || []), ''])}
          >
            + Add Item
          </button>
        </div>
      ) : (
        <ul className="list-disc pl-5">
          {items?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderImportantDates = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Important Dates</h3>
      {editedAdmitCard?.importantDates?.map((date, index) => (
        <div key={index} className="bg-[#C0E3FF] p-4 rounded-lg mb-3">
          {isEditing ? (
            <>
              <input
                value={date.event}
                onChange={(e) => {
                  const newDates = [...editedAdmitCard.importantDates];
                  newDates[index].event = e.target.value;
                  handleInputChange('importantDates', newDates);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
                placeholder="Event name"
              />
              <input
                value={date.date}
                onChange={(e) => {
                  const newDates = [...editedAdmitCard.importantDates];
                  newDates[index].date = e.target.value;
                  handleInputChange('importantDates', newDates);
                }}
                className="edit-input w-full p-2 border rounded"
                placeholder="Date"
              />
            </>
          ) : (
            <>
              <p className="font-medium">{date.event}</p>
              <p>{date.date}</p>
            </>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          className="add-item-btn text-sm text-blue-600"
          onClick={() => handleInputChange('importantDates', [
            ...(editedAdmitCard.importantDates || []),
            { event: '', date: '' }
          ])}
        >
          + Add Date
        </button>
      )}
    </div>
  );

  const renderExamDetails = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Exam Details</h3>
      {editedAdmitCard?.examDetails?.map((detail, index) => (
        <div key={index} className="bg-[#C0E3FF] p-4 rounded-lg mb-3">
          {isEditing ? (
            <>
              <input
                value={detail.examDate}
                onChange={(e) => {
                  const newDetails = [...editedAdmitCard.examDetails];
                  newDetails[index].examDate = e.target.value;
                  handleInputChange('examDetails', newDetails);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
                placeholder="Exam Date"
              />
              <input
                value={detail.shiftTimings}
                onChange={(e) => {
                  const newDetails = [...editedAdmitCard.examDetails];
                  newDetails[index].shiftTimings = e.target.value;
                  handleInputChange('examDetails', newDetails);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
                placeholder="Shift Timings"
              />
              <input
                value={detail.reportingTime}
                onChange={(e) => {
                  const newDetails = [...editedAdmitCard.examDetails];
                  newDetails[index].reportingTime = e.target.value;
                  handleInputChange('examDetails', newDetails);
                }}
                className="edit-input w-full p-2 border rounded"
                placeholder="Reporting Time"
              />
            </>
          ) : (
            <>
              <p className="font-medium">Exam Date: {detail.examDate}</p>
              <p>Shift Timings: {detail.shiftTimings}</p>
              <p>Reporting Time: {detail.reportingTime}</p>
            </>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          className="add-item-btn text-sm text-blue-600"
          onClick={() => handleInputChange('examDetails', [
            ...(editedAdmitCard.examDetails || []),
            { examDate: '', shiftTimings: '', reportingTime: '' }
          ])}
        >
          + Add Exam Detail
        </button>
      )}
    </div>
  );

  const renderImportantLinks = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Important Links</h3>
      {editedAdmitCard?.importantLinks?.map((link, index) => (
        <div key={index} className="bg-[#C0E3FF] p-4 rounded-lg mb-3">
          {isEditing ? (
            <>
              <input
                value={link.linkType}
                onChange={(e) => {
                  const newLinks = [...editedAdmitCard.importantLinks];
                  newLinks[index].linkType = e.target.value;
                  handleInputChange('importantLinks', newLinks);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
                placeholder="Link Type"
              />
              <input
                value={link.link}
                onChange={(e) => {
                  const newLinks = [...editedAdmitCard.importantLinks];
                  newLinks[index].link = e.target.value;
                  handleInputChange('importantLinks', newLinks);
                }}
                className="edit-input w-full p-2 border rounded"
                placeholder="URL"
                type="url"
              />
            </>
          ) : (
            <>
            <a
              href={link.link.startsWith("http") ? link.link : `https://${link.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <FaLink /> {link.link}
            </a>

            </>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          className="add-item-btn text-sm text-blue-600"
          onClick={() => handleInputChange('importantLinks', [
            ...(editedAdmitCard.importantLinks || []),
            { linkType: '', link: '' }
          ])}
        >
          + Add Link
        </button>
      )}
    </div>
  );

  const renderKeywords = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Keywords</h3>
      {isEditing ? (
        <div className="space-y-2">
          {editedAdmitCard?.keywords?.map((keyword, index) => (
            <input
              key={index}
              value={keyword}
              onChange={(e) => {
                const newKeywords = [...editedAdmitCard.keywords];
                newKeywords[index] = e.target.value;
                handleInputChange('keywords', newKeywords);
              }}
              className="edit-input w-full mb-2 p-2 border rounded"
            />
          ))}
          <button
            className="add-item-btn text-sm text-blue-600"
            onClick={() => handleInputChange('keywords', [
              ...(editedAdmitCard.keywords || []),
              ''
            ])}
          >
            + Add Keyword
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {editedAdmitCard?.keywords?.map((keyword, index) => (
            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderSearchDescription = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Search Description</h3>
      {isEditing ? (
        <textarea
          value={editedAdmitCard.searchDescription || ''}
          onChange={(e) => handleInputChange('searchDescription', e.target.value)}
          className="edit-textarea w-full p-2 border rounded h-32"
        />
      ) : (
        <p className="whitespace-pre-wrap">{editedAdmitCard.searchDescription}</p>
      )}
    </div>
  );

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!editedAdmitCard) return <div>No admit card found</div>;

  return (
    <div className="admit-card-details p-2 bg-[#DFF1FF]">
      <div className="admit-details-container">
        <div className="admit-details-card bg-white p-6 md:p-8 lg:p-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button className="back-button" onClick={handleBack}>
                <FaArrowLeft className="mr-2" /> Back to Admit Cards
              </button>
            </div>
            {isAuthenticated && user?.role === 'admin' && (
              <div className="flex items-center">
                <button
                  className={`edit-button ${isEditing ? 'bg-green-600' : 'bg-[#015990]'} text-white px-4 py-2 rounded flex items-center gap-2`}
                  onClick={isEditing ? handleSave : handleEditToggle}
                >
                  {isEditing ? <FaSave /> : <FaEdit />}
                  {isEditing ? 'Save Changes' : 'Edit Admit Card'}
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-3xl font-bold text-[#015990] mb-8">
            {isEditing ? (
              <input
                value={editedAdmitCard.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="edit-input w-full text-center text-2xl font-bold"
              />
            ) : (
              editedAdmitCard.title
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {renderEditableField('Organization', editedAdmitCard.organization, 'organization')}
            {renderEditableField('Advertisement Number', editedAdmitCard.advertisementNumber, 'advertisementNumber')}
            {renderEditableField('Vacancies', editedAdmitCard.vacancies, 'vacancies')}
            {renderEditableField('Official Website', editedAdmitCard.officialWebsite, 'officialWebsite', 'url')}
            {renderEditableField('Featured', editedAdmitCard.isFeatured, 'isFeatured', 'checkbox')}
            {renderEditableField('Slug', editedAdmitCard.slug, 'slug')}
          </div>

          {renderImportantDates()}
          {renderExamDetails()}
          {renderListSection('Download Steps', editedAdmitCard.downloadSteps, 'downloadSteps')}
          {renderListSection('Instructions', editedAdmitCard.instructions, 'instructions')}
          {renderImportantLinks()}
          {renderKeywords()}
          {renderSearchDescription()}

          <div className="text-center mt-8">
            <button
              onClick={handleVisitAdmitCard}
              className="view-result-btn bg-[#015990] text-white px-6 py-3 rounded-lg hover:bg-[#014970] transition-colors flex items-center gap-2 mx-auto"
              disabled={!editedAdmitCard?.importantLinks?.some(link => link.linkType === 'downloadLink')}
            >
              <FaExternalLinkAlt /> Download Admit Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardDetails;