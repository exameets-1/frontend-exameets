import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { fetchSingleJob, updateJob } from '../../store/slices/jobSlice';
import Spinner from '../Spinner/Spinner';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState({
    jobTitle: '',
    category: 'IT',
    positionType: 'Full-Time',
    companyName: '',
    companyOverview: '',
    positionSummary: '',
    keyResponsibilities: [],
    education: [],
    experience: '',
    languages: [],
    frameworks: [],
    databases: [],
    methodologies: [],
    softSkills: [],
    preferredQualifications: [],
    benefits: [],
    submissionMethod: 'email',
    contactEmail: '',
    applicationPortalLink: '',
    jobReferenceNumber: '',
    equalOpportunityStatement: '',
    startDate: '',
    applicationDeadline: '',
    city: '',
    state: '',
    country: '',
    slug: '',
    isFeatured: false,
    keywords: [],
    searchDescription: '',
    faq: [],
    createdAt: '',
  });

  const job = useSelector((state) => state.jobs.singleJob);
  const loading = useSelector((state) => state.jobs.loading);
  const error = useSelector((state) => state.jobs.error);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) dispatch(fetchSingleJob(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (job) {
      setEditedJob({
        ...job,
        keyResponsibilities: job.keyResponsibilities || [],
        education: job.education || [],
        languages: job.languages || [],
        frameworks: job.frameworks || [],
        databases: job.databases || [],
        methodologies: job.methodologies || [],
        softSkills: job.softSkills || [],
        preferredQualifications: job.preferredQualifications || [],
        benefits: job.benefits || [],
        keywords: job.keywords || [],
        faq: job.faq || [],
      });
    }
  }, [job]);

  const handleApply = () => {
    if (editedJob.submissionMethod === 'portal') {
      window.open(editedJob.applicationPortalLink, '_blank');
    } else if (editedJob.submissionMethod === 'email') {
      window.location.href = `mailto:${editedJob.contactEmail}?subject=Application for ${editedJob.jobTitle}`;
    }
  };

  const handleBack = () => navigate(-1);
  const handleEdit = () => setIsEditing(true);

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
    setEditedJob(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split('\n').filter(item => item.trim());
    setEditedJob(prev => ({ ...prev, [field]: items }));
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFAQ = [...editedJob.faq];
    updatedFAQ[index][field] = value;
    setEditedJob(prev => ({ ...prev, faq: updatedFAQ }));
  };

  const handleAddFAQ = () => {
    setEditedJob(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };

  const handleRemoveFAQ = (index) => {
    const updatedFAQ = editedJob.faq.filter((_, i) => i !== index);
    setEditedJob(prev => ({ ...prev, faq: updatedFAQ }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (error) return <ErrorDisplay onBack={handleBack} />;
  if (!editedJob) return <NoJobFound onBack={handleBack} />;


  if (!editedJob) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600 text-lg">No job details found</p>
      <button 
        onClick={handleBack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="inline-block" /> Back to Jobs
        </button>
        
        {isAuthenticated && user?.role === 'admin' && (
          isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <FaSave /> Save Changes
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <FaEdit /> Edit Job
            </button>
          )
        )}
      </div>
  
      {/* Job Header */}
      <div className="bg-[#015990] text-white rounded-lg p-6 mb-6">
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              name="jobTitle"
              value={editedJob.jobTitle}
              onChange={handleInputChange}
              className="w-full text-2xl font-bold bg-transparent border-b border-white/50 focus:outline-none text-center"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2">{editedJob.jobTitle}</h1>
          )}
          <p className="text-sm opacity-80">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  name="companyName"
                  value={editedJob.companyName}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-white/50"
                  placeholder="Company Name"
                />
                <select
                  name="category"
                  value={editedJob.category}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-white/50"
                >
                  <option value="IT">IT</option>
                  <option value="NON-IT">Non-IT</option>
                </select>
                <select
                  name="positionType"
                  value={editedJob.positionType}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-white/50"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="city"
                    value={editedJob.city}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-white/50"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="state"
                    value={editedJob.state}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-white/50"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="country"
                    value={editedJob.country}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-white/50"
                    placeholder="Country"
                  />
                </div>
              </div>
            ) : (
              `${editedJob.companyName} • ${editedJob.category} • ${editedJob.positionType} • ${editedJob.city}, ${editedJob.state}, ${editedJob.country}`
            )}
          </p>
        </div>
      </div>
  
      <div className="space-y-8">
        {/* Company Overview */}
        <section className="pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Company Overview</h2>
          {isEditing ? (
            <textarea
              name="companyOverview"
              value={editedJob.companyOverview}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">{editedJob.companyOverview}</p>
          )}
        </section>
  
        {/* Position Details */}
        <section className="pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Position Details</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Position Summary</h3>
              {isEditing ? (
                <textarea
                  name="positionSummary"
                  value={editedJob.positionSummary}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{editedJob.positionSummary}</p>
              )}
            </div>
  
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Key Responsibilities</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.keyResponsibilities.join('\n')}
                  onChange={(e) => handleArrayInputChange('keyResponsibilities', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              ) : (
                <ul className="list-disc pl-6 space-y-3">
                  {editedJob.keyResponsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-600">{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
  
        {/* Qualifications */}
        <section className="pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Qualifications</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Education</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.education.join('\n')}
                  onChange={(e) => handleArrayInputChange('education', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              ) : (
                <ul className="list-disc pl-6 space-y-3">
                  {editedJob.education.map((edu, index) => (
                    <li key={index} className="text-gray-600">{edu}</li>
                  ))}
                </ul>
              )}
            </div>
  
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Experience</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={editedJob.experience}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-600">{editedJob.experience}</p>
              )}
            </div>
  
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Technical Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['languages', 'frameworks', 'databases', 'methodologies'].map((skillType) => (
                  <div key={skillType} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {skillType}
                    </h4>
                    {isEditing ? (
                      <input
                        value={editedJob[skillType].join(', ')}
                        onChange={(e) => {
                          const skills = e.target.value.split(',').map(s => s.trim());
                          setEditedJob(prev => ({ ...prev, [skillType]: skills }));
                        }}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <ul className="list-disc pl-5 space-y-1">
                        {editedJob[skillType].map((skill, index) => (
                          <li key={index} className="text-gray-600 text-sm">{skill}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
  
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Soft Skills</h3>
              {isEditing ? (
                <input
                  value={editedJob.softSkills.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim());
                    setEditedJob(prev => ({ ...prev, softSkills: skills }));
                  }}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editedJob.softSkills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
  
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Benefits</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.benefits.join('\n')}
                  onChange={(e) => handleArrayInputChange('benefits', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              ) : (
                <ul className="list-disc pl-6 space-y-3">
                  {editedJob.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-600">{benefit}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
  
        {/* SEO Section */}
        <section className="pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">SEO Details</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Search Description</h3>
              {isEditing ? (
                <textarea
                  name="searchDescription"
                  value={editedJob.searchDescription}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              ) : (
                <p className="text-gray-600">{editedJob.searchDescription}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Keywords</h3>
              {isEditing ? (
                <textarea
                  value={editedJob.keywords.join('\n')}
                  onChange={(e) => handleArrayInputChange('keywords', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editedJob.keywords.map((keyword, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Slug */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Slug</h3>
            {isEditing ? (
              <input
                type="text"
                name="slug"
                value={editedJob.slug}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-600">{editedJob.slug}</p>
            )}
          </div>
        </section>
  
        {/* FAQ Section */}
        <section className="pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">FAQ</h2>
          {isEditing ? (
            <div className="space-y-4">
              {editedJob.faq.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Question"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Answer"
                    rows="2"
                  />
                  <button
                    onClick={() => handleRemoveFAQ(index)}
                    className="text-red-500 text-sm flex items-center gap-1"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddFAQ}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <FaPlus /> Add FAQ
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {editedJob.faq.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </section>
  
        {/* Application Details */}
        <section className="pb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Application Details</h2>
          <div className="space-y-6">
            {/* ... existing application details fields ... */}
            <div>
              <label className="block font-semibold text-gray-700 mb-3">Featured Job</label>
              {isEditing ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedJob.isFeatured}
                    onChange={(e) => setEditedJob(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="form-checkbox"
                  />
                  <span>Mark as featured</span>
                </label>
              ) : (
                <p className="text-gray-600">{editedJob.isFeatured ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>
        </section>
      </div>
  
      {/* Apply Button */}
      <div className="mt-12 text-center border-t border-gray-200 pt-8">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold w-full md:w-auto"
        >
          {editedJob.submissionMethod === 'email' ? 'Apply via Email' : 'Apply via Portal'}
        </button>
      </div>
    </div>
  );
};

export default JobDetails;