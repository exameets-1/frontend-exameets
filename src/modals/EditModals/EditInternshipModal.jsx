/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const initialFormData = {
    internship_type: '',
    title: '',
    imageUrl: '',
    start_date: '',
    duration: '',
    skills_required: [],
    stipend: '',
    organization: '',
    location: '',
    qualification: '',
    eligibility_criteria: [],
    application_link: '',
    last_date: '',
    is_featured: false,
    field: '',
    description: '',
    slug: '',
    keywords: [],
    searchDescription: ''
};

// Individual field toggles based on existing data
const getInitialFieldToggles = (internship) => ({
    title: true, // Always required
    organization: true, // Always required
    imageUrl: !!internship?.imageUrl,
    internship_type: true, // Always required
    start_date: !!internship?.start_date,
    duration: !!internship?.duration,
    location: !!internship?.location,
    last_date: !!internship?.last_date,
    skills_required: !!(internship?.skills_required?.length > 0),
    stipend: !!internship?.stipend,
    qualification: !!internship?.qualification,
    eligibility_criteria: !!(internship?.eligibility_criteria?.length > 0),
    application_link: !!internship?.application_link,
    field: !!internship?.field,
    description: !!internship?.description,
    slug: !!internship?.slug,
    keywords: !!(internship?.keywords?.length > 0),
    searchDescription: !!internship?.searchDescription,
    is_featured: true, // Always show featured option
});

// NEW FUNCTION: Get initial removed fields based on toggled off fields
const getInitialRemovedFields = (internship) => {
    const toggles = getInitialFieldToggles(internship);
    const allFields = [
        'imageUrl', 'start_date', 'duration', 'location', 'last_date',
        'skills_required', 'stipend', 'qualification', 'eligibility_criteria',
        'application_link', 'field', 'description', 'slug', 'keywords',
        'searchDescription'
    ];
    
    // Return fields that are toggled OFF (false)
    return allFields.filter(field => !toggles[field]);
};

const EditInternshipModal = ({ isOpen, onClose, onSubmit, internship }) => {
    const [formData, setFormData] = useState({ ...initialFormData, ...internship });
    const [fieldToggles, setFieldToggles] = useState(getInitialFieldToggles(internship));
    // UPDATED: Initialize removedFields with fields that are toggled off by default
    const [removedFields, setRemovedFields] = useState(getInitialRemovedFields(internship));
    const [currentInputs, setCurrentInputs] = useState({
        skill: '',
        eligibility: '',
        keyword: ''
    });

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Populate the form with existing internship data when available
    useEffect(() => {
        if (internship) {
            setFormData({ ...initialFormData, ...internship });
            setFieldToggles(getInitialFieldToggles(internship));
            // UPDATED: Set initial removed fields based on what's toggled off
            setRemovedFields(getInitialRemovedFields(internship));
        }
    }, [internship]);

    const toggleField = (field) => {
        setFieldToggles(prev => {
            const newToggles = { ...prev, [field]: !prev[field] };
            
            // Update removedFields array
            setRemovedFields(prevRemoved => {
                if (!newToggles[field]) {
                    // Field is being disabled, add to removedFields if not already there
                    return prevRemoved.includes(field) ? prevRemoved : [...prevRemoved, field];
                } else {
                    // Field is being enabled, remove from removedFields
                    return prevRemoved.filter(f => f !== field);
                }
            });

            return newToggles;
        });
    };

    const handleArrayChange = (field, value) => {
        setCurrentInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = (field) => {
        const inputField = field === 'skills_required' ? 'skill' : 
                          field === 'eligibility_criteria' ? 'eligibility' : 
                          field === 'keywords' ? 'keyword' : field;
        
        if (!currentInputs[inputField]?.trim()) return;
        
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], currentInputs[inputField].trim()]
        }));
        
        setCurrentInputs(prev => ({ ...prev, [inputField]: '' }));
    };

    const handleRemoveItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: e.target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only validate enabled fields
            if (fieldToggles.title && !formData.title.trim()) {
                toast.error('Please enter title or disable this field');
                return;
            }
            if (fieldToggles.organization && !formData.organization.trim()) {
                toast.error('Please enter organization or disable this field');
                return;
            }
            if (fieldToggles.internship_type && !formData.internship_type.trim()) {
                toast.error('Please select internship type or disable this field');
                return;
            }
            if (fieldToggles.skills_required && formData.skills_required.length === 0) {
                toast.error('Please add at least one skill or disable this field');
                return;
            }
            if (fieldToggles.eligibility_criteria && formData.eligibility_criteria.length === 0) {
                toast.error('Please add at least one eligibility criteria or disable this field');
                return;
            }
            if (fieldToggles.description && !formData.description.trim()) {
                toast.error('Please enter description or disable this field');
                return;
            }

            // Include removedFields in the update data
            const updateData = {
                ...formData,
                removedFields
            };

            //console.log('Removed fields:', removedFields);
            await onSubmit(updateData);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to update internship');
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Internship</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Essential Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Essential Information</h3>
                        
                        {/* Title */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.title} 
                                onToggle={() => toggleField('title')} 
                                label="Title" 
                            />
                            {fieldToggles.title && (
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter internship title"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        {/* Organization */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.organization} 
                                onToggle={() => toggleField('organization')} 
                                label="Organization" 
                            />
                            {fieldToggles.organization && (
                                <input
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    placeholder="Enter organization name"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        {/* Internship Type */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.internship_type} 
                                onToggle={() => toggleField('internship_type')} 
                                label="Internship Type" 
                            />
                            {fieldToggles.internship_type && (
                                <select
                                    name="internship_type"
                                    value={formData.internship_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Internship Type</option>
                                    <option value="On-Site">On-Site</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Optional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Optional Information</h3>
                        
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
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="Enter image URL"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div>
                                <ToggleSwitch 
                                    enabled={fieldToggles.start_date} 
                                    onToggle={() => toggleField('start_date')} 
                                    label="Start Date" 
                                />
                                {fieldToggles.start_date && (
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>

                            {/* Last Date */}
                            <div>
                                <ToggleSwitch 
                                    enabled={fieldToggles.last_date} 
                                    onToggle={() => toggleField('last_date')} 
                                    label="Last Date to Apply" 
                                />
                                {fieldToggles.last_date && (
                                    <input
                                        type="date"
                                        name="last_date"
                                        value={formData.last_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <ToggleSwitch 
                                    enabled={fieldToggles.duration} 
                                    onToggle={() => toggleField('duration')} 
                                    label="Duration" 
                                />
                                {fieldToggles.duration && (
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g., 3 months"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <ToggleSwitch 
                                    enabled={fieldToggles.location} 
                                    onToggle={() => toggleField('location')} 
                                    label="Location" 
                                />
                                {fieldToggles.location && (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter location"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>

                            {/* Stipend */}
                            <div>
                                <ToggleSwitch 
                                    enabled={fieldToggles.stipend} 
                                    onToggle={() => toggleField('stipend')} 
                                    label="Stipend" 
                                />
                                {fieldToggles.stipend && (
                                    <input
                                        type="text"
                                        name="stipend"
                                        value={formData.stipend}
                                        onChange={handleChange}
                                        placeholder="Enter stipend amount"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>

                            {/* Field */}
                            <div>
                                <ToggleSwitch 
                                    enabled={fieldToggles.field} 
                                    onToggle={() => toggleField('field')} 
                                    label="Field/Domain" 
                                />
                                {fieldToggles.field && (
                                    <input
                                        type="text"
                                        name="field"
                                        value={formData.field}
                                        onChange={handleChange}
                                        placeholder="e.g., Software Development, Marketing"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Qualification */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.qualification} 
                                onToggle={() => toggleField('qualification')} 
                                label="Qualification Requirements" 
                            />
                            {fieldToggles.qualification && (
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="Enter qualification requirements"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        {/* Application Link */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.application_link} 
                                onToggle={() => toggleField('application_link')} 
                                label="Application Link" 
                            />
                            {fieldToggles.application_link && (
                                <input
                                    type="url"
                                    name="application_link"
                                    value={formData.application_link}
                                    onChange={handleChange}
                                    placeholder="Enter application URL"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.description} 
                                onToggle={() => toggleField('description')} 
                                label="Description" 
                            />
                            {fieldToggles.description && (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter internship description"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                />
                            )}
                        </div>
                    </div>

                    {/* Array Fields */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Skills & Requirements</h3>
                        
                        {/* Skills Required */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.skills_required} 
                                onToggle={() => toggleField('skills_required')} 
                                label="Skills Required" 
                            />
                            {fieldToggles.skills_required && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentInputs.skill}
                                            onChange={(e) => handleArrayChange('skill', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add skill"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddItem('skills_required')}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.skills_required.map((skill, index) => (
                                            <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm dark:text-white">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem('skills_required', index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Eligibility Criteria */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.eligibility_criteria} 
                                onToggle={() => toggleField('eligibility_criteria')} 
                                label="Eligibility Criteria" 
                            />
                            {fieldToggles.eligibility_criteria && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentInputs.eligibility}
                                            onChange={(e) => handleArrayChange('eligibility', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add eligibility criteria"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddItem('eligibility_criteria')}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.eligibility_criteria.map((criteria, index) => (
                                            <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm dark:text-white">
                                                {criteria}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem('eligibility_criteria', index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO & Advanced Fields */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">SEO & Advanced Options</h3>
                        
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
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="URL slug (auto-generated if empty)"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        {/* Keywords */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.keywords} 
                                onToggle={() => toggleField('keywords')} 
                                label="Keywords" 
                            />
                            {fieldToggles.keywords && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentInputs.keyword}
                                            onChange={(e) => handleArrayChange('keyword', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add keyword"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddItem('keywords')}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.keywords.map((keyword, index) => (
                                            <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm dark:text-white">
                                                {keyword}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem('keywords', index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Description */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.searchDescription} 
                                onToggle={() => toggleField('searchDescription')} 
                                label="Search Description" 
                            />
                            {fieldToggles.searchDescription && (
                                <textarea
                                    name="searchDescription"
                                    value={formData.searchDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Brief description for search results"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                />
                            )}
                        </div>

                        {/* Featured Option */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.is_featured} 
                                onToggle={() => toggleField('is_featured')} 
                                label="Featured Internship" 
                            />
                            {fieldToggles.is_featured && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 mr-3"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Mark as featured internship</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Debug Info */}
                    {removedFields.length > 0 && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Removed Fields:</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">{removedFields.join(', ')}</p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && (user?.role === "admin" || user?.role === "manager") ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Internship
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = "/login"}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Login to Edit
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );   
};

export default EditInternshipModal;