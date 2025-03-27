import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { fetchSingleGovtJob, updateGovtJob } from '../../store/slices/govtJobSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';

const GovtJobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);
  const [currentArrayInputs, setCurrentArrayInputs] = useState({});
  const [currentFAQ, setCurrentFAQ] = useState({ question: '', answer: '' });

  const { job, loading, error } = useSelector((state) => state.govtJobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) dispatch(fetchSingleGovtJob(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (job) {
      // Initialize all array fields to empty arrays if undefined
      const initializedJob = { 
        faq: [],
        postNames: [],
        educationalQualifications: [],
        additionalRequirements: [],
        vacancyPostNames: [],
        vacancyCounts: [],
        vacancyPayScales: [],
        selectionProcess: [],
        howToApplyOnlineSteps: [],
        howToApplyOfflineSteps: [],
        requiredDocuments: [],
        examSubjects: [],
        examQuestionCounts: [],
        examMarks: [],
        examDurations: [],
        keywords: [],
        ...job 
      };
      setEditedJob(initializedJob);
    }
  }, [job]);

  const handleBack = () => navigate(-1);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      // Clean FAQ data and convert isFeatured to boolean before sending
      const cleanedData = {
        ...editedJob,
        faq: editedJob.faq.map(faq => ({
          question: faq.question,
          answer: faq.answer,
          ...(faq._id && { _id: faq._id })
        })),
        isFeatured: Boolean(editedJob.isFeatured)
      };

      const result = await dispatch(updateGovtJob({
        jobId: id,
        updatedData: cleanedData
      })).unwrap();

      if (result?.error) {
        console.error('Update failed:', result.error);
        toast.error('Failed to update govt job');
      } else {
        setIsEditing(false);
        toast.success('Govt job updated successfully');
      }
    } catch (error) {
      console.error('Save error:', error);
      let errorMessage;
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.toString()) {
        errorMessage = error.toString();
      } else {
        errorMessage = 'An unexpected error occurred';
      }

      alert(`Update failed: ${errorMessage}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? e.target.checked : value;
    setEditedJob(prev => ({ ...prev, [name]: newValue }));
  };

  const handleArrayChange = (field, value) => {
    setCurrentArrayInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAddArrayItem = (field) => {
    if (!currentArrayInputs[field]?.trim()) return;
    setEditedJob(prev => ({
      ...prev,
      [field]: [...prev[field], currentArrayInputs[field].trim()]
    }));
    setCurrentArrayInputs(prev => ({ ...prev, [field]: '' }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setEditedJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFAQChange = (e) => {
    const { name, value } = e.target;
    setCurrentFAQ(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFAQ = () => {
    if (!currentFAQ.question.trim() || !currentFAQ.answer.trim()) return;
    setEditedJob(prev => ({
      ...prev,
      faq: [...prev.faq, { ...currentFAQ }]
    }));
    setCurrentFAQ({ question: '', answer: '' });
  };

  const handleRemoveFAQ = (index) => {
    setEditedJob(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  const renderEditableField = (field, label, type = 'text') => {
    // Handle array fields except FAQ
    if (Array.isArray(editedJob[field]) && field !== 'faq') {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {editedJob[field].map((item, index) => (
              <div key={index} className="bg-blue-100 px-2 py-1 rounded flex items-center gap-2">
                <span>{item}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(field, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={currentArrayInputs[field] || ''}
                onChange={(e) => handleArrayChange(field, e.target.value)}
                placeholder={`Add ${label.toLowerCase()}`}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => handleAddArrayItem(field)}
                className="px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>
      );
    }

    // FAQ Handling
    if (field === 'faq') {
      return (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="question"
              value={currentFAQ.question}
              onChange={handleFAQChange}
              placeholder="Question"
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              name="answer"
              value={currentFAQ.answer}
              onChange={handleFAQChange}
              placeholder="Answer"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddFAQ}
              className="px-3 bg-blue-500 text-white rounded"
            >
              <FaPlus />
            </button>
          </div>
          {editedJob.faq.map((item, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <strong>{item.question}</strong>
                <button
                  onClick={() => handleRemoveFAQ(index)}
                  className="text-red-500"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      );
    }

    // Regular input fields
    return (
      <input
        type={type}
        name={field}
        value={editedJob[field] || ''}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    );
  };

  const renderSection = (title, fields) => (
    <section className="my-6 p-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
        {title}
      </h2>
      <div className="space-y-4">
        {fields.map(([field, label, fieldType]) => (
          <div key={field} className="space-y-2">
            <label className="block font-medium">{label}</label>
            {isEditing ? (
              fieldType === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={field}
                    checked={editedJob[field]}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>{label}</span>
                </div>
              ) : (
                renderEditableField(field, label, fieldType)
              )
            ) : (
              <div className="text-gray-700">
                {Array.isArray(editedJob[field]) ? (
                  field === 'faq' ? (
                    <div className="space-y-4">
                      {editedJob.faq.map((faq, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded">
                          <h3 className="font-medium">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    editedJob[field].join(', ')
                  )
                ) : (
                  editedJob[field]
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  if (!editedJob) return <div>No job found</div>;

  return (
    <div className="max-w-6xl mx-auto p-5 bg-white rounded-lg shadow-md my-8">
      <div className="flex justify-between items-center mb-8">
        <button onClick={handleBack} className="flex items-center text-blue-800">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        {isAuthenticated && user?.role === 'admin' && (
          isEditing ? (
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              <FaSave className="mr-2" /> Save
            </button>
          ) : (
            <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded">
              <FaEdit className="mr-2" /> Edit
            </button>
          )
        )}
      </div>

      {/* Basic Information */}
      {renderSection('Basic Information', [
        ['jobTitle', 'Job Title'],
        ['jobOverview', 'Job Overview', 'textarea'],
        ['organization', 'Organization'],
        ['totalVacancies', 'Total Vacancies'],
        ['jobLocation', 'Job Location'],
      ])}

      {/* Important Dates */}
      {renderSection('Important Dates', [
        ['notificationReleaseDate', 'Notification Release Date'],
        ['applicationStartDate', 'Application Start Date'],
        ['applicationEndDate', 'Application End Date'],
        ['examInterviewDate', 'Exam/Interview Date'],
      ])}

      {/* Eligibility Criteria */}
      {renderSection('Eligibility Criteria', [
        ['educationalQualifications', 'Educational Qualifications'],
        ['ageLimitMin', 'Minimum Age'],
        ['ageLimitMax', 'Maximum Age'],
        ['ageRelaxation', 'Age Relaxation'],
        ['additionalRequirements', 'Additional Requirements'],
      ])}

      {/* Vacancy Details */}
      {renderSection('Vacancy Details', [
        ['vacancyPostNames', 'Post Names'],
        ['vacancyCounts', 'Vacancy Counts'],
        ['vacancyPayScales', 'Pay Scales'],
      ])}

      {/* Application Details */}
      {renderSection('Application Details', [
        ['applicationMode', 'Application Mode'],
        ['applicationFeeGeneral', 'Application Fee (General)'],
        ['applicationFee_SC_ST_PWD', 'Application Fee (SC/ST/PWD)'],
        ['applicationFeePaymentMode', 'Payment Mode'],
      ])}

      {/* Selection Process */}
      {renderSection('Selection Process', [
        ['selectionProcess', 'Selection Process Steps'],
      ])}

      {/* How to Apply */}
      {renderSection('How to Apply', [
        ['howToApplyOnlineSteps', 'Online Application Steps'],
        ['howToApplyOfflineSteps', 'Offline Application Steps'],
        ['requiredDocuments', 'Required Documents'],
      ])}

      {/* Exam Details */}
      {renderSection('Exam Details', [
        ['examSubjects', 'Exam Subjects'],
        ['examQuestionCounts', 'Question Counts'],
        ['examMarks', 'Marks Distribution'],
        ['examDurations', 'Exam Durations'],
      ])}

      {/* Links */}
      {renderSection('Important Links', [
        ['notificationPDFLink', 'Notification PDF Link', 'url'],
        ['applyOnlineLink', 'Apply Online Link', 'url'],
        ['officialWebsiteLink', 'Official Website', 'url'],
      ])}

      {/* FAQ Section */}
      <section className="my-6 p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
          FAQs
        </h2>
        {isEditing ? (
          renderEditableField('faq', 'FAQs')
        ) : (
          <div className="space-y-4">
            {editedJob.faq.map((faq, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Additional Fields */}
      <section className="my-6 p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
          Additional Information
        </h2>
        {renderSection('Additional Information', [
          ['keywords', 'Keywords'],
          ['searchDescription', 'Search Description', 'textarea'],
          ['slug', 'Slug'],
          ['isFeatured', 'Featured Job', 'checkbox'],
        ])}
      </section>
    </div>
  );
};

export default GovtJobDetails;