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

  // Field toggles - default enabled for essential fields
  const initialFieldToggles = {
    jobTitle: true,
    category: true,
    imageUrl: true,
    location: true, // city, state, country
    positionType: true,
    companyName: true,
    companyOverview: true,
    positionSummary: true,
    keyResponsibilities: true,
    education: true,
    experience: true,
    technicalSkills: false, // languages, frameworks, databases, methodologies
    softSkills: true,
    preferredQualifications: false,
    dates: false, // startDate, applicationDeadline
    benefits: true,
    applicationProcess: true, // submissionMethod, contactEmail/applicationPortalLink
    jobReferenceNumber: false,
    equalOpportunityStatement: true,
    slug: false,
    seoFields: false, // keywords, searchDescription
  };

  const [formData, setFormData] = useState(initialFormData);
  const [fieldToggles, setFieldToggles] = useState(initialFieldToggles);
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

  // Updated validation - only check enabled fields
  useEffect(() => {
    const isValid = 
      (!fieldToggles.jobTitle || formData.jobTitle.trim() !== '') &&
      (!fieldToggles.imageUrl || formData.imageUrl.trim() !== '') &&
      (!fieldToggles.location || (formData.city.trim() !== '' && formData.state.trim() !== '' && formData.country.trim() !== '')) &&
      (!fieldToggles.companyName || formData.companyName.trim() !== '') &&
      (!fieldToggles.companyOverview || formData.companyOverview.trim() !== '') &&
      (!fieldToggles.positionSummary || formData.positionSummary.trim() !== '') &&
      (!fieldToggles.keyResponsibilities || formData.keyResponsibilities.length > 0) &&
      (!fieldToggles.education || formData.education.length > 0) &&
      (!fieldToggles.experience || formData.experience.trim() !== '') &&
      (!fieldToggles.softSkills || formData.softSkills.length > 0) &&
      (!fieldToggles.benefits || formData.benefits.length > 0) &&
      (!fieldToggles.equalOpportunityStatement || formData.equalOpportunityStatement.trim() !== '') &&
      (!fieldToggles.applicationProcess || (
        (formData.submissionMethod === 'email' && formData.contactEmail.trim() !== '') ||
        (formData.submissionMethod === 'portal' && formData.applicationPortalLink.trim() !== '')
      ));
    
    setIsFormValid(isValid);
  }, [formData, fieldToggles]);

  const toggleField = (field) => {
    setFieldToggles(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
      // Only validate enabled fields
      if (fieldToggles.keyResponsibilities && formData.keyResponsibilities.length === 0) {
        alert('Please add at least one key responsibility or disable this field');
        return;
      }
      if (fieldToggles.education && formData.education.length === 0) {
        alert('Please add at least one education requirement or disable this field');
        return;
      }
      if (fieldToggles.softSkills && formData.softSkills.length === 0) {
        alert('Please add at least one soft skill or disable this field');
        return;
      }
      if (fieldToggles.benefits && formData.benefits.length === 0) {
        alert('Please add at least one benefit or disable this field');
        return;
      }
      if (fieldToggles.experience && !formData.experience.trim()) {
        alert('Please enter experience requirements or disable this field');
        return;
      }

      // Validate submission method specific fields only if enabled
      if (fieldToggles.applicationProcess) {
        if (formData.submissionMethod === 'email' && !formData.contactEmail) {
          alert('Please provide a contact email for email submissions');
          return;
        }
        if (formData.submissionMethod === 'portal' && !formData.applicationPortalLink) {
          alert('Please provide an application portal link for portal submissions');
          return;
        }
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Failed to create job');
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onToggle, label }) => (
    <div className="flex items-center gap-2 mb-2">
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
        {label}
      </span>
    </div>
  );

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
            
            {/* Job Title */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.jobTitle} 
                onToggle={() => toggleField('jobTitle')} 
                label="Job Title" 
              />
              {fieldToggles.jobTitle && (
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.jobTitle}
                  onChange={(e) => handleNestedChange('jobTitle', e.target.value)}
                  placeholder="Enter job title"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Image URL */}
              <div>
                <ToggleSwitch 
                  enabled={fieldToggles.imageUrl} 
                  onToggle={() => toggleField('imageUrl')} 
                  label="Image URL" 
                />
                {fieldToggles.imageUrl && (
                  <input
                    type="url"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.imageUrl}
                    onChange={(e) => handleNestedChange('imageUrl', e.target.value)}
                    placeholder="Enter image URL"
                  />
                )}
              </div>

              {/* Category */}
              <div>
                <ToggleSwitch 
                  enabled={fieldToggles.category} 
                  onToggle={() => toggleField('category')} 
                  label="Category" 
                />
                {fieldToggles.category && (
                  <select
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.category}
                    onChange={(e) => handleNestedChange('category', e.target.value)}
                  >
                    <option value="IT">IT</option>
                    <option value="NON-IT">Non-IT</option>
                  </select>
                )}
              </div>

              {/* Position Type */}
              <div>
                <ToggleSwitch 
                  enabled={fieldToggles.positionType} 
                  onToggle={() => toggleField('positionType')} 
                  label="Position Type" 
                />
                {fieldToggles.positionType && (
                  <select
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.positionType}
                    onChange={(e) => handleNestedChange('positionType', e.target.value)}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                )}
              </div>
            </div>
          </div>
  
          {/* Location */}
          <div className="space-y-4">
            <ToggleSwitch 
              enabled={fieldToggles.location} 
              onToggle={() => toggleField('location')} 
              label="Location" 
            />
            {fieldToggles.location && (
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.city}
                  onChange={(e) => handleNestedChange('city', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.state}
                  onChange={(e) => handleNestedChange('state', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.country}
                  onChange={(e) => handleNestedChange('country', e.target.value)}
                />
              </div>
            )}
          </div>
  
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Company Information</h3>
            
            {/* Company Name */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.companyName} 
                onToggle={() => toggleField('companyName')} 
                label="Company Name" 
              />
              {fieldToggles.companyName && (
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.companyName}
                  onChange={(e) => handleNestedChange('companyName', e.target.value)}
                />
              )}
            </div>

            {/* Company Overview */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.companyOverview} 
                onToggle={() => toggleField('companyOverview')} 
                label="Company Overview" 
              />
              {fieldToggles.companyOverview && (
                <textarea
                  placeholder="Company Overview"
                  rows={3}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.companyOverview}
                  onChange={(e) => handleNestedChange('companyOverview', e.target.value)}
                />
              )}
            </div>
          </div>
  
          {/* Position Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Position Details</h3>
            
            {/* Position Summary */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.positionSummary} 
                onToggle={() => toggleField('positionSummary')} 
                label="Position Summary" 
              />
              {fieldToggles.positionSummary && (
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.positionSummary}
                  onChange={(e) => handleNestedChange('positionSummary', e.target.value)}
                  placeholder="Enter position summary"
                />
              )}
            </div>
  
            {/* Key Responsibilities */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.keyResponsibilities} 
                onToggle={() => toggleField('keyResponsibilities')} 
                label="Key Responsibilities" 
              />
              {fieldToggles.keyResponsibilities && (
                <div className="space-y-2">
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
              )}
            </div>
          </div>
  
          {/* Qualifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Qualifications</h3>
            
            {/* Education */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.education} 
                onToggle={() => toggleField('education')} 
                label="Education" 
              />
              {fieldToggles.education && (
                <div className="space-y-2">
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
              )}
            </div>
  
            {/* Experience */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.experience} 
                onToggle={() => toggleField('experience')} 
                label="Experience" 
              />
              {fieldToggles.experience && (
                <input
                  type="text"
                  placeholder="Enter experience requirements"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.experience}
                  onChange={(e) => handleNestedChange('experience', e.target.value)}
                />
              )}
            </div>

            {/* Technical Skills */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.technicalSkills} 
                onToggle={() => toggleField('technicalSkills')} 
                label="Technical Skills" 
              />
              {fieldToggles.technicalSkills && (
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
              )}
            </div>
  
            {/* Soft Skills */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.softSkills} 
                onToggle={() => toggleField('softSkills')} 
                label="Soft Skills" 
              />
              {fieldToggles.softSkills && (
                <div className="space-y-2">
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
              )}
            </div>
  
            {/* Preferred Qualifications */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.preferredQualifications} 
                onToggle={() => toggleField('preferredQualifications')} 
                label="Preferred Qualifications" 
              />
              {fieldToggles.preferredQualifications && (
                <div className="space-y-2">
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
              )}
            </div>
          </div>
  
          {/* Benefits and Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Benefits */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.benefits} 
                onToggle={() => toggleField('benefits')} 
                label="Benefits" 
              />
              {fieldToggles.benefits && (
                <div className="space-y-2">
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
              )}
            </div>

            {/* Dates */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.dates} 
                onToggle={() => toggleField('dates')} 
                label="Dates" 
              />
              {fieldToggles.dates && (
                <div className="space-y-2">
                  <input
                    type="date"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.startDate}
                    onChange={(e) => handleNestedChange('startDate', e.target.value)}
                    title="Start Date"
                  />
                  <input
                    type="date"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleNestedChange('applicationDeadline', e.target.value)}
                    title="Application Deadline"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Application Process */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Application Process</h3>
            
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.applicationProcess} 
                onToggle={() => toggleField('applicationProcess')} 
                label="Application Process" 
              />
              {fieldToggles.applicationProcess && (
                <div className="space-y-4">
                  <select
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    value={formData.submissionMethod}
                    onChange={(e) => handleNestedChange('submissionMethod', e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="portal">Application Portal</option>
                  </select>

                  {formData.submissionMethod === 'email' && (
                    <input
                      type="email"
                      placeholder="Contact Email"
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                      value={formData.contactEmail}
                      onChange={(e) => handleNestedChange('contactEmail', e.target.value)}
                    />
                  )}

                  {formData.submissionMethod === 'portal' && (
                    <input
                      type="url"
                      placeholder="Application Portal Link"
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                      value={formData.applicationPortalLink}
                      onChange={(e) => handleNestedChange('applicationPortalLink', e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-100">Additional Information</h3>
            
            {/* Job Reference Number */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.jobReferenceNumber} 
                onToggle={() => toggleField('jobReferenceNumber')} 
                label="Job Reference Number" 
              />
              {fieldToggles.jobReferenceNumber && (
                <input
                  type="text"
                  placeholder="Job Reference Number"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.jobReferenceNumber}
                  onChange={(e) => handleNestedChange('jobReferenceNumber', e.target.value)}
                />
              )}
            </div>

            {/* Equal Opportunity Statement */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.equalOpportunityStatement} 
                onToggle={() => toggleField('equalOpportunityStatement')} 
                label="Equal Opportunity Statement" 
              />
              {fieldToggles.equalOpportunityStatement && (
                <textarea
                  placeholder="Equal Opportunity Statement"
                  rows={2}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.equalOpportunityStatement}
                  onChange={(e) => handleNestedChange('equalOpportunityStatement', e.target.value)}
                />
              )}
            </div>

            {/* Slug */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.slug} 
                onToggle={() => toggleField('slug')} 
                label="URL Slug" 
              />
              {fieldToggles.slug && (
                <input
                  type="text"
                  placeholder="URL Slug (auto-generated if empty)"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  value={formData.slug}
                  onChange={(e) => handleNestedChange('slug', e.target.value)}
                />
              )}
            </div>

            {/* SEO Fields */}
            <div>
              <ToggleSwitch 
                enabled={fieldToggles.seoFields} 
                onToggle={() => toggleField('seoFields')} 
                label="SEO Fields" 
              />
              {fieldToggles.seoFields && (
                <div className="space-y-4">
                  <div>
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
                    <div className="flex flex-wrap gap-2 mt-2">
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

                  <textarea
                    placeholder="Search Description (for SEO)"
                    rows={2}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    value={formData.searchDescription}
                    onChange={(e) => handleNestedChange('searchDescription', e.target.value)}
                  />
                </div>
              )}
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