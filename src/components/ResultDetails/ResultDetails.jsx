import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaArrowLeft, 
  FaExternalLinkAlt, 
  FaEdit, 
  FaSave,
  FaLink
} from 'react-icons/fa';
import { fetchSingleResult, resetResultDetails, updateResult } from '../../store/slices/resultSlice';
import Spinner from '../Spinner/Spinner';
import './ResultDetails.css';
import { toast } from 'react-toastify';

const ResultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { result, loading, error } = useSelector((state) => state.results);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchSingleResult(id));
    return () => dispatch(resetResultDetails());
  }, [dispatch, id]);

  useEffect(() => {
    if (result) {
      // Initialize all array fields
      const initializedResult = {
        keywords: [],
        importantDates: [],
        cutoffMarks: [],
        nextSteps: [],
        stepsToCheckResult: [],
        documentsRequired: [],
        ...result,
        importantLinks: result.importantLinks || {}
      };
      setEditedResult(JSON.parse(JSON.stringify(initializedResult)));
    }
  }, [result]);

  const handleBack = () => navigate('/results');

  const handleVisitResult = () => {
    window.open(editedResult?.importantLinks?.resultLink, '_blank');
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      await dispatch(updateResult(id, editedResult));
      setIsEditing(false);
      toast.success('Result updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update result');
    }
  };

  const handleInputChange = (path, value) => {
    const paths = path.split('.');
    setEditedResult(prev => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]] = { ...current[paths[i]] };
      }
      current[paths[paths.length - 1]] = value;
      return newState;
    });
  };

  const renderEditableField = (label, value, path, type = 'text') => (
    <div className="detail-item bg-[#C0E3FF] p-4 rounded-lg flex items-center gap-3 mb-4">
      <div className="detail-content w-full">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleInputChange(path, e.target.value)}
            className="edit-input w-full mt-1 p-2 border rounded"
          />
        ) : (
          <p className="mt-1">{value || 'N/A'}</p>
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
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  handleInputChange(path, newItems);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
              />
              <button
                onClick={() => handleInputChange(
                  path, 
                  items.filter((_, i) => i !== index)
                )}
                className="text-red-500"
              >
                ×
              </button>
            </div>
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

  // Keep existing renderImportantDates, renderCutoffMarks, and other functions
  const renderImportantDates = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Important Dates</h3>
      {editedResult?.importantDates?.map((date, index) => (
        <div key={index} className="bg-[#C0E3FF] p-4 rounded-lg mb-3">
          {isEditing ? (
            <>
              <input
                value={date.event}
                onChange={(e) => {
                  const newDates = [...editedResult.importantDates];
                  newDates[index].event = e.target.value;
                  handleInputChange('importantDates', newDates);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
                placeholder="Event name"
              />
              <input
                value={date.date}
                onChange={(e) => {
                  const newDates = [...editedResult.importantDates];
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
            ...editedResult.importantDates,
            { event: '', date: '' }
          ])}
        >
          + Add Date
        </button>
      )}
    </div>
  );

  const renderCutoffMarks = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">Cutoff Marks</h3>
      {editedResult?.cutoffMarks?.map((cutoff, index) => (
        <div key={index} className="bg-[#C0E3FF] p-4 rounded-lg mb-3">
          {isEditing ? (
            <>
              <input
                value={cutoff.category}
                onChange={(e) => {
                  const newCutoffs = [...editedResult.cutoffMarks];
                  newCutoffs[index].category = e.target.value;
                  handleInputChange('cutoffMarks', newCutoffs);
                }}
                className="edit-input w-full mb-2 p-2 border rounded"
                placeholder="Category"
              />
              <input
                value={cutoff.marks}
                onChange={(e) => {
                  const newCutoffs = [...editedResult.cutoffMarks];
                  newCutoffs[index].marks = e.target.value;
                  handleInputChange('cutoffMarks', newCutoffs);
                }}
                className="edit-input w-full p-2 border rounded"
                placeholder="Marks"
              />
            </>
          ) : (
            <>
              <p className="font-medium">{cutoff.category}</p>
              <p>{cutoff.marks}</p>
            </>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          className="add-item-btn text-sm text-blue-600"
          onClick={() => handleInputChange('cutoffMarks', [
            ...editedResult.cutoffMarks,
            { category: '', marks: '' }
          ])}
        >
          + Add Cutoff
        </button>
      )}
    </div>
  );

  // Add new SEO section
  const renderSEOSection = () => (
    <div className="section-container mb-6">
      <h3 className="text-xl font-semibold mb-3">SEO Fields</h3>
      
      {/* Slug Field */}
      <div className="bg-[#C0E3FF] p-4 rounded-lg mb-4">
        <label className="block text-sm font-medium mb-2">Slug</label>
        {isEditing ? (
          <input
            value={editedResult.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            className="edit-input w-full p-2 border rounded"
          />
        ) : (
          <p>{editedResult.slug || 'N/A'}</p>
        )}
      </div>

      {/* Keywords */}
      {renderListSection('Keywords', editedResult.keywords, 'keywords')}

      {/* Search Description */}
      <div className="bg-[#C0E3FF] p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">Search Description</label>
        {isEditing ? (
          <textarea
            value={editedResult.searchDescription || ''}
            onChange={(e) => handleInputChange('searchDescription', e.target.value)}
            className="edit-textarea w-full p-2 border rounded h-32"
          />
        ) : (
          <p className="whitespace-pre-wrap">
            {editedResult.searchDescription || 'No search description provided'}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!editedResult) return <div>No result found</div>;

  return (
    <div className="result-card-details p-2 bg-[#DFF1FF]">
      <div className="result-details-container">
        <div className="result-details-card bg-white p-6 md:p-8 lg:p-10">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 w-full">
            <div className="flex items-center">
              <button className="back-button" onClick={handleBack}>
                <FaArrowLeft className="mr-2" /> Back to Results
              </button>
            </div>
            <div className="flex items-center">
              {isAuthenticated && user?.role === 'admin' && (
                <button
                  className={`edit-button ${isEditing ? 'bg-green-600' : 'bg-[#015990]'} text-white px-4 py-2 rounded flex items-center gap-2`}
                  onClick={isEditing ? handleSave : handleEditToggle}
                >
                  {isEditing ? <FaSave /> : <FaEdit />}
                  {isEditing ? 'Save Changes' : 'Edit Result'}
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center text-3xl font-bold text-[#015990] mb-8">
            {isEditing ? (
              <input
                value={editedResult.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="edit-input w-full text-center text-2xl font-bold"
              />
            ) : (
              editedResult.title
            )}
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {renderEditableField('Organization', editedResult.organization, 'organization')}
            {renderEditableField('Post Name', editedResult.postName, 'postName')}
            {renderEditableField('Total Vacancies', editedResult.totalVacancies, 'totalVacancies', 'number')}
            {renderEditableField('Exam Type', editedResult.exam_type, 'exam_type')}
            {renderEditableField('Result Date', editedResult.resultDate, 'resultDate')}
            {renderEditableField('Official Website', editedResult.officialWebsite, 'officialWebsite', 'url')}
            {renderEditableField('Slug', editedResult.slug, 'slug')}
          </div>

          {/* Existing Sections */}
          {renderImportantDates()}
          {renderCutoffMarks()}
          {renderListSection('Next Steps', editedResult.nextSteps, 'nextSteps')}
          {renderListSection('Steps to Check Result', editedResult.stepsToCheckResult, 'stepsToCheckResult')}
          {renderListSection('Required Documents', editedResult.documentsRequired, 'documentsRequired')}

          {/* New SEO Section */}
          {renderSEOSection()}

          {/* Links Section */}
          <div className="section-container mb-6">
            <h3 className="text-xl font-semibold mb-3">Important Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(editedResult.importantLinks || {}).map(([key, value]) => (
                <div key={key} className="bg-[#C0E3FF] p-4 rounded-lg">
                  <label className="block text-sm font-medium capitalize mb-2">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </label>
                  {isEditing ? (
                    <input
                      value={value}
                      onChange={(e) => handleInputChange(`importantLinks.${key}`, e.target.value)}
                      className="edit-input w-full p-2 border rounded"
                      type="url"
                    />
                  ) : value ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <FaLink /> Open Link
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* View Result Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleVisitResult}
              className="view-result-btn bg-[#015990] text-white px-6 py-3 rounded-lg hover:bg-[#014970] transition-colors flex items-center gap-2 mx-auto"
              disabled={!editedResult?.importantLinks?.resultLink}
            >
              <FaExternalLinkAlt /> View Official Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;