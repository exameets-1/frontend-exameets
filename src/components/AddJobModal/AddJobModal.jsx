/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddJobModal = ({ isOpen, onClose, onSubmit }) => {
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

  const { isAuthenticated, user } = useSelector((state) => state.user);

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
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Create Job Posting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.jobTitle}
                  onChange={(e) => handleNestedChange('jobTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.category}
                  onChange={(e) => handleNestedChange('category', e.target.value)}
                >
                  <option value="IT">IT</option>
                  <option value="NON-IT">Non-IT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position Type *</label>
                <select
                  className="w-full p-2 border rounded"
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
            <h3 className="text-lg font-semibold">Location *</h3>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City *"
                required
                className="p-2 border rounded"
                value={formData.city}
                onChange={(e) => handleNestedChange('city', e.target.value)}
              />
              <input
                type="text"
                placeholder="State *"
                required
                className="p-2 border rounded"
                value={formData.state}
                onChange={(e) => handleNestedChange('state', e.target.value)}
              />
              <input
                type="text"
                placeholder="Country *"
                required
                className="p-2 border rounded"
                value={formData.country}
                onChange={(e) => handleNestedChange('country', e.target.value)}
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information *</h3>
            <input
              type="text"
              placeholder="Company Name *"
              required
              className="w-full p-2 border rounded"
              value={formData.companyName}
              onChange={(e) => handleNestedChange('companyName', e.target.value)}
            />
            <textarea
              placeholder="Company Overview *"
              required
              rows={3}
              className="w-full p-2 border rounded"
              value={formData.companyOverview}
              onChange={(e) => handleNestedChange('companyOverview', e.target.value)}
            />
          </div>

          {/* Position Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Position Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Position Summary *</label>
              <textarea
                required
                rows={3}
                className="w-full p-2 border rounded"
                value={formData.positionSummary}
                onChange={(e) => handleNestedChange('positionSummary', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Key Responsibilities *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add responsibility"
                  className="flex-1 p-2 border rounded"
                  value={currentInputs.responsibility}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, responsibility: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {resp}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('keyResponsibilities', index)}
                      className="text-red-500 hover:text-red-700"
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
            <h3 className="text-lg font-semibold">Qualifications</h3>
            
            {/* Education */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Education *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add education requirement"
                  className="flex-1 p-2 border rounded"
                  value={currentInputs.education}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, education: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {edu}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('education', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Experience *</label>
              <input
                type="text"
                required
                placeholder="Enter experience requirements"
                className="w-full p-2 border rounded"
                value={formData.experience}
                onChange={(e) => handleNestedChange('experience', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Technical Skills</label>
              <div className="space-y-2">
                {/* Selection box with full width */}
                <select
                  className="w-full p-2 border rounded"
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
                    className="flex-1 p-2 border rounded"
                    value={currentInputs.techSkill.value}
                    onChange={(e) => setCurrentInputs(prev => ({
                      ...prev,
                      techSkill: {...prev.techSkill, value: e.target.value}
                    }))}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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

              {/* Skills display section remains the same */}
              {['languages', 'frameworks', 'databases', 'methodologies'].map((type) => (
                formData[type].length > 0 && (
                  <div key={type} className="mt-2">
                    <h4 className="text-sm font-medium capitalize">{type}</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData[type].map((skill, index) => (
                        <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove(type, index)}
                            className="text-red-500 hover:text-red-700"
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
              <label className="block text-sm font-medium">Soft Skills *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add soft skill"
                  className="flex-1 p-2 border rounded"
                  value={currentInputs.softSkill}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, softSkill: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('softSkills', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Qualifications */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Preferred Qualifications</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add preferred qualification"
                  className="flex-1 p-2 border rounded"
                  value={currentInputs.preferredQualification}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, preferredQualification: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {qual}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('preferredQualifications', index)}
                      className="text-red-500 hover:text-red-700"
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
              <label className="block text-sm font-medium">Benefits *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add benefit"
                  className="flex-1 p-2 border rounded"
                  value={currentInputs.benefit}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, benefit: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {benefit}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('benefits', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Dates</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => handleNestedChange('startDate', e.target.value)}
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="DeadLine"
                value={formData.applicationDeadline}
                onChange={(e) => handleNestedChange('applicationDeadline', e.target.value)}
              />
            </div>
          </div>

          {/* Application Process */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Application Process *</h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full p-2 border rounded"
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
                  className="p-2 border rounded"
                  value={formData.contactEmail}
                  onChange={(e) => handleNestedChange('contactEmail', e.target.value)}
                />
              ) : (
                <input
                  type="url"
                  required
                  placeholder="Application Portal Link *"
                  className="p-2 border rounded"
                  value={formData.applicationPortalLink}
                  onChange={(e) => handleNestedChange('applicationPortalLink', e.target.value)}
                />
              )}
              <input
                type="text"
                placeholder="Job Reference Number"
                className="p-2 border rounded"
                value={formData.jobReferenceNumber}
                onChange={(e) => handleNestedChange('jobReferenceNumber', e.target.value)}
              />
            </div>
          </div>

          {/* Equal Opportunity Statement */}
          <div>
            <label className="block text-sm font-medium mb-1">Equal Opportunity Statement *</label>
            <textarea
              required
              rows={3}
              className="w-full p-2 border rounded"
              value={formData.equalOpportunityStatement}
              onChange={(e) => handleNestedChange('equalOpportunityStatement', e.target.value)}
            />
          </div>

          {/* Slug */}
          <input
            type="text"
            placeholder="Page Title"
            className="p-2 border rounded"
            value={formData.slug}
            onChange={(e) => handleNestedChange('slug', e.target.value)}
          />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Fields</h3>
            
            {/* Keywords */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Keywords</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add keyword"
                  className="flex-1 p-2 border rounded"
                  value={currentInputs.keyword}
                  onChange={(e) => setCurrentInputs(prev => ({...prev, keyword: e.target.value}))}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('keywords', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Search Description</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded"
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
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            {isAuthenticated && user?.role === 'admin' ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Job Posting
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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