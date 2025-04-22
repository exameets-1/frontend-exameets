import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const initialFormData = {
  jobTitle: '',
  category: 'IT',
  city: '',
  state: '',
  country: '',
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
  startDate: '',
  applicationDeadline: '',
  benefits: [],
  submissionMethod: 'email',
  contactEmail: '',
  applicationPortalLink: '',
  jobReferenceNumber: '',
  equalOpportunityStatement: '',
  slug: '',
  keywords: [],
  searchDescription: '',
  faq: [],
};

const EditJobModal = ({ isOpen, onClose, job, jobId, onUpdate }) => {
  const [formData, setFormData] = useState({ ...initialFormData, ...job });
  const [currentInputs, setCurrentInputs] = useState({
    responsibility: '',
    education: '',
    softSkill: '',
    benefit: '',
    preferredQualification: '',
    techSkill: { type: 'languages', value: '' },
    keyword: '',
    faq: { question: '', answer: '' }
  });

  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (job) {
      setFormData({ ...initialFormData, ...job });
    }
  }, [job]);

  const handleNestedChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field, value) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFAQAdd = () => {
    if (!currentInputs.faq.question.trim() || !currentInputs.faq.answer.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { 
        question: currentInputs.faq.question.trim(), 
        answer: currentInputs.faq.answer.trim() 
      }]
    }));
    
    setCurrentInputs(prev => ({
      ...prev,
      faq: { question: '', answer: '' }
    }));
  };

  const handleFAQRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (formData.keyResponsibilities.length === 0) {
        toast.error('Please add at least one key responsibility');
        return;
      }
      if (formData.education.length === 0) {
        toast.error('Please add at least one education requirement');
        return;
      }
      if (formData.softSkills.length === 0) {
        toast.error('Please add at least one soft skill');
        return;
      }
      if (formData.benefits.length === 0) {
        toast.error('Please add at least one benefit');
        return;
      }
      if (!formData.experience.trim()) {
        toast.error('Please enter experience requirements');
        return;
      }
      if (formData.submissionMethod === 'email' && !formData.contactEmail) {
        toast.error('Please provide a contact email for email submissions');
        return;
      }
      if (formData.submissionMethod === 'portal' && !formData.applicationPortalLink) {
        toast.error('Please provide an application portal link for portal submissions');
        return;
      }

      await onUpdate(formData);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update job');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-gray-100">Edit Job Posting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <FaTimes size={20} />
          </button>
        </div>
  
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Job Title *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.jobTitle}
                  onChange={(e) => handleNestedChange('jobTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category *</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.category}
                  onChange={(e) => handleNestedChange('category', e.target.value)}
                >
                  <option value="IT">IT</option>
                  <option value="NON-IT">Non-IT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Position Type *</label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.positionType}
                  onChange={(e) => handleNestedChange('positionType', e.target.value)}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
          </div>
  
          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Location *</h3>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City *"
                required
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                value={formData.city}
                onChange={(e) => handleNestedChange('city', e.target.value)}
              />
              <input
                type="text"
                placeholder="State *"
                required
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                value={formData.state}
                onChange={(e) => handleNestedChange('state', e.target.value)}
              />
              <input
                type="text"
                placeholder="Country *"
                required
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                value={formData.country}
                onChange={(e) => handleNestedChange('country', e.target.value)}
              />
            </div>
          </div>
  
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Company Information *</h3>
            <input
              type="text"
              placeholder="Company Name *"
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              value={formData.companyName}
              onChange={(e) => handleNestedChange('companyName', e.target.value)}
            />
            <textarea
              placeholder="Company Overview *"
              required
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              value={formData.companyOverview}
              onChange={(e) => handleNestedChange('companyOverview', e.target.value)}
            />
          </div>
  
          {/* Position Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Position Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Position Summary *</label>
              <textarea
                required
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.positionSummary}
                onChange={(e) => handleNestedChange('positionSummary', e.target.value)}
              />
            </div>
  
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Key Responsibilities *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add responsibility"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.responsibility}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, responsibility: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    handleArrayAdd('keyResponsibilities', currentInputs.responsibility);
                    setCurrentInputs(prev => ({...prev, responsibility: ''}));
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keyResponsibilities.map((resp, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                    {resp}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('keyResponsibilities', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Qualifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Qualifications</h3>
            
            {/* Education */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Education *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add education requirement"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.education}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, education: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    handleArrayAdd('education', currentInputs.education);
                    setCurrentInputs(prev => ({...prev, education: ''}));
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                    {edu}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('education', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Experience *</label>
              <input
                type="text"
                required
                placeholder="Enter experience requirements"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                value={formData.experience}
                onChange={(e) => handleNestedChange('experience', e.target.value)}
              />
            </div>
  
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Technical Skills</label>
              <div className="space-y-2">
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={currentInputs.techSkill.type}
                  onChange={(e) => setCurrentInputs(prev => ({
                    ...prev,
                    techSkill: {...prev.techSkill, type: e.target.value}
                  }))}
                >
                  <option value="languages">Languages</option>
                  <option value="frameworks">Frameworks</option>
                  <option value="databases">Databases</option>
                  <option value="methodologies">Methodologies</option>
                </select>
  
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technical skill"
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    value={currentInputs.techSkill.value}
                    onChange={(e) => setCurrentInputs(prev => ({
                      ...prev,
                      techSkill: {...prev.techSkill, value: e.target.value}
                    }))}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => {
                      handleArrayAdd(
                        currentInputs.techSkill.type,
                        currentInputs.techSkill.value
                      );
                      setCurrentInputs(prev => ({
                        ...prev,
                        techSkill: { ...prev.techSkill, value: '' }
                      }));
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
  
              {['languages', 'frameworks', 'databases', 'methodologies'].map((type) => (
                formData[type].length > 0 && (
                  <div key={type} className="mt-2">
                    <h4 className="text-sm font-medium capitalize dark:text-gray-300">{type}</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData[type].map((skill, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove(type, index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
  
            {/* Soft Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Soft Skills *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add soft skill"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.softSkill}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, softSkill: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    handleArrayAdd('softSkills', currentInputs.softSkill);
                    setCurrentInputs(prev => ({...prev, softSkill: ''}));
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.softSkills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('softSkills', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Preferred Qualifications */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Preferred Qualifications</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add preferred qualification"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.preferredQualification}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, preferredQualification: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    handleArrayAdd('preferredQualifications', currentInputs.preferredQualification);
                    setCurrentInputs(prev => ({...prev, preferredQualification: ''}));
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredQualifications.map((qual, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                    {qual}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('preferredQualifications', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Benefits and Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Benefits *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add benefit"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.benefit}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, benefit: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    handleArrayAdd('benefits', currentInputs.benefit);
                    setCurrentInputs(prev => ({...prev, benefit: ''}));
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                    {benefit}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('benefits', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Dates</label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs dark:text-gray-400">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.startDate}
                    onChange={(e) => handleNestedChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs dark:text-gray-400">Application Deadline</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleNestedChange('applicationDeadline', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
  
          {/* Application Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Application Method</h3>
            <div className="space-y-2">
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.submissionMethod}
                onChange={(e) => handleNestedChange('submissionMethod', e.target.value)}
              >
                <option value="email">Email</option>
                <option value="portal">Application Portal</option>
              </select>
              
              {formData.submissionMethod === 'email' ? (
                <input
                  type="email"
                  placeholder="Contact Email *"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.contactEmail}
                  onChange={(e) => handleNestedChange('contactEmail', e.target.value)}
                  required={formData.submissionMethod === 'email'}
                />
              ) : (
                <input
                  type="url"
                  placeholder="Application Portal URL *"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.applicationPortalLink}
                  onChange={(e) => handleNestedChange('applicationPortalLink', e.target.value)}
                  required={formData.submissionMethod === 'portal'}
                />
              )}
            </div>
          </div>
  
          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Additional Information</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Job Reference Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.jobReferenceNumber}
                onChange={(e) => handleNestedChange('jobReferenceNumber', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Equal Opportunity Statement</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.equalOpportunityStatement}
                onChange={(e) => handleNestedChange('equalOpportunityStatement', e.target.value)}
              />
            </div>
          </div>
  
          {/* SEO Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">SEO Information</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Slug</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.slug}
                onChange={(e) => handleNestedChange('slug', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Search Description</label>
              <textarea
                rows={2}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.searchDescription}
                onChange={(e) => handleNestedChange('searchDescription', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Keywords</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add keyword"
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.keyword}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, keyword: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    handleArrayAdd('keywords', currentInputs.keyword);
                    setCurrentInputs(prev => ({...prev, keyword: ''}));
                  }}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-200">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('keywords', index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* FAQs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">FAQs</h3>
            
            <div className="space-y-4">
              {formData.faq.map((faq, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium dark:text-gray-200">FAQ #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleFAQRemove(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <p className="text-xs font-semibold dark:text-gray-300">Q: {faq.question}</p>
                  <p className="text-xs dark:text-gray-300">A: {faq.answer}</p>
                </div>
              ))}
              
              <div className="p-3 border rounded-lg space-y-2 dark:border-gray-600">
                <h4 className="text-sm font-medium dark:text-gray-200">Add New FAQ</h4>
                <input
                  type="text"
                  placeholder="Question"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.faq.question}
                  onChange={(e) => setCurrentInputs(prev => ({
                    ...prev,
                    faq: {...prev.faq, question: e.target.value}
                  }))}
                />
                <textarea
                  placeholder="Answer"
                  rows={2}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={currentInputs.faq.answer}
                  onChange={(e) => setCurrentInputs(prev => ({
                    ...prev,
                    faq: {...prev.faq, answer: e.target.value}
                  }))}
                />
                <button
                  type="button"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={handleFAQAdd}
                >
                  <FaPlus className="inline mr-1" /> Add FAQ
                </button>
              </div>
            </div>
          </div>
  
          {/* Featured Option */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">Visibility Options</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                className="mr-2 dark:bg-gray-700 dark:border-gray-600"
                checked={formData.isFeatured || false}
                onChange={(e) => handleNestedChange('isFeatured', e.target.checked)}
              />
              <label htmlFor="isFeatured" className="text-sm dark:text-gray-300">Featured Job</label>
            </div>
          </div>
  
          {/* Submit and Cancel buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
           {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') ? (
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Save Changes
            </button>
           ) : (
            <button
              type="button"
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Login to Edit
            </button>
           )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;