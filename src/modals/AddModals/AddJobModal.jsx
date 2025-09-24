/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddJobModal = ({ isOpen, onClose, onSubmit }) => {
  const initialFormData = {
    jobTitle: '',
    category: 'IT',
    imageUrl: '',
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [currentInputs, setCurrentInputs] = useState({
    responsibility: '',
    education: '',
    softSkill: '',
    benefit: '',
    preferredQualification: '',
    techSkill: { type: 'languages', value: '' },
    keyword: ''
  });
  const [, setIsFormValid] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Check if all required fields are filled
  useEffect(() => {
    const isValid = 
      formData.jobTitle.trim() !== '' &&
      formData.imageUrl.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.country.trim() !== '' &&
      formData.companyName.trim() !== '' &&
      formData.companyOverview.trim() !== '' &&
      formData.positionSummary.trim() !== '' &&
      formData.keyResponsibilities.length > 0 &&
      formData.education.length > 0 &&
      formData.experience.trim() !== '' &&
      formData.softSkills.length > 0 &&
      formData.benefits.length > 0 &&
      formData.equalOpportunityStatement.trim() !== '' &&
      ((formData.submissionMethod === 'email' && formData.contactEmail.trim() !== '') ||
       (formData.submissionMethod === 'portal' && formData.applicationPortalLink.trim() !== ''));
    
    setIsFormValid(isValid);
  }, [formData]);

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

  // Prevent form submission on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // For add buttons, we can trigger their click when Enter is pressed in their associated input
      if (e.target.tagName === 'INPUT' && e.target.nextElementSibling?.tagName === 'BUTTON') {
        e.target.nextElementSibling.click();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (formData.keyResponsibilities.length === 0) {
        alert('Please add at least one key responsibility');
        return;
      }
      if (formData.education.length === 0) {
        alert('Please add at least one education requirement');
        return;
      }
      if (formData.softSkills.length === 0) {
        alert('Please add at least one soft skill');
        return;
      }
      if (formData.benefits.length === 0) {
        alert('Please add at least one benefit');
        return;
      }
      if (!formData.experience.trim()) {
        alert('Please enter experience requirements');
        return;
      }

      // Validate submission method specific fields
      if (formData.submissionMethod === 'email' && !formData.contactEmail) {
        alert('Please provide a contact email for email submissions');
        return;
      }
      if (formData.submissionMethod === 'portal' && !formData.applicationPortalLink) {
        alert('Please provide an application portal link for portal submissions');
        return;
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Failed to create job');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
          <h2 className="text-2xl font-bold dark:text-gray-100">Create Job Posting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
            <FaTimes size={20} />
          </button>
        </div>
  
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Job Title *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.jobTitle}
                  onChange={(e) => handleNestedChange('jobTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Image Url *</label>
                <input
                  type="url"
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.imageUrl}
                  onChange={(e) => handleNestedChange('imageUrl', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Category *</label>
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
                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Position Type *</label>
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
            <h3 className="text-lg font-semibold dark:text-gray-100">Location *</h3>
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
            <h3 className="text-lg font-semibold dark:text-gray-100">Company Information *</h3>
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
            <h3 className="text-lg font-semibold dark:text-gray-100">Position Details</h3>
            <div>
              <label className="block text-sm font-bold mb-1 dark:text-gray-300">Position Summary *</label>
              <textarea
                required
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.positionSummary}
                onChange={(e) => handleNestedChange('positionSummary', e.target.value)}
              />
            </div>
  
            <div className="space-y-2">
              <label className="block text-sm font-bold dark:text-gray-300">Key Responsibilities *</label>
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
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
            <h3 className="text-lg font-semibold dark:text-gray-100">Qualifications</h3>
            
            {/* Education */}
            <div className="space-y-2">
              <label className="block text-sm font-bold dark:text-gray-300">Education *</label>
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
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
              <label className="block text-sm font-bold dark:text-gray-300">Experience *</label>
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
              <label className="block text-sm font-bold dark:text-gray-300">Technical Skills</label>
              <div className="space-y-2">
                {/* Selection box with full width */}
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
  
                {/* Input and button in a row below */}
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
  
              {/* Skills display section */}
              {['languages', 'frameworks', 'databases', 'methodologies'].map((type) => (
                formData[type].length > 0 && (
                  <div key={type} className="mt-2">
                    <h4 className="text-sm font-bold capitalize dark:text-gray-300">{type}</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData[type].map((skill, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
              <label className="block text-sm font-bold dark:text-gray-300">Soft Skills *</label>
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
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
              <label className="block text-sm font-bold dark:text-gray-300">Preferred Qualifications</label>
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
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
              <label className="block text-sm font-bold dark:text-gray-300">Benefits *</label>
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
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
              <label className="block text-sm font-bold dark:text-gray-300">Dates</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => handleNestedChange('startDate', e.target.value)}
              />
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="DeadLine"
                value={formData.applicationDeadline}
                onChange={(e) => handleNestedChange('applicationDeadline', e.target.value)}
              />
            </div>
          </div>
  
          {/* Application Process */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Application Process *</h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                value={formData.submissionMethod}
                onChange={(e) => handleNestedChange('submissionMethod', e.target.value)}
              >
                <option value="email">Email Submission</option>
                <option value="portal">Application Portal</option>
              </select>
              
              {formData.submissionMethod === 'email' ? (
                <input
                  type="email"
                  required
                  placeholder="Contact Email *"
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.contactEmail}
                  onChange={(e) => handleNestedChange('contactEmail', e.target.value)}
                />
              ) : (
                <input
                  type="url"
                  required
                  placeholder="Application Portal Link *"
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.applicationPortalLink}
                  onChange={(e) => handleNestedChange('applicationPortalLink', e.target.value)}
                />
              )}
              <input
                type="text"
                placeholder="Job Reference Number"
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                value={formData.jobReferenceNumber}
                onChange={(e) => handleNestedChange('jobReferenceNumber', e.target.value)}
              />
            </div>
          </div>
  
          {/* Equal Opportunity Statement */}
          <div>
            <label className="block text-sm font-bold mb-1 dark:text-gray-300">Equal Opportunity Statement *</label>
            <textarea
              required
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              value={formData.equalOpportunityStatement}
              onChange={(e) => handleNestedChange('equalOpportunityStatement', e.target.value)}
            />
          </div>
  
          {/* Slug */}
          <input
            type="text"
            placeholder="Page Title"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            value={formData.slug}
            onChange={(e) => handleNestedChange('slug', e.target.value)}
          />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">SEO Fields</h3>
            
            {/* Keywords */}
            <div className="space-y-2">
              <label className="block text-sm font-bold dark:text-gray-300">Keywords</label>
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
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 dark:text-gray-100">
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
  
            {/* Search Description */}
            <div className="space-y-2">
              <label className="block text-sm font-bold dark:text-gray-300">Search Description</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                value={formData.searchDescription}
                onChange={(e) => handleNestedChange('searchDescription', e.target.value)}
                placeholder="Meta description for search engines"
              />
            </div>
          </div>
  
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Create Job Posting
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                Login to Post Job
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;