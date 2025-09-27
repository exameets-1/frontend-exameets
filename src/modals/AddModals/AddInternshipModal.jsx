/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddInternshipModal = ({ isOpen, onClose, onSubmit }) => {
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

    // Field toggles - default enabled for essential fields
    const initialFieldToggles = {
        title: true,
        organization: true,
        imageUrl: true,
        internshipType: true,
        basicInfo: true, // start_date, duration, location
        skills: true, // skills_required
        stipend: false,
        qualification: false,
        eligibility: false, // eligibility_criteria
        applicationDetails: true, // application_link, last_date
        field: false,
        description: true,
        seoFields: false, // slug, keywords, searchDescription
        featured: true,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [fieldToggles, setFieldToggles] = useState(initialFieldToggles);
    const [currentInputs, setCurrentInputs] = useState({
        skill: '',
        eligibility: '',
        keyword: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Updated validation - properly organized
    useEffect(() => {
        const isValid = 
            (!fieldToggles.title || formData.title.trim() !== '') &&
            (!fieldToggles.organization || formData.organization.trim() !== '') &&
            (!fieldToggles.internshipType || formData.internship_type.trim() !== '') &&
            (!fieldToggles.basicInfo || (
                formData.start_date.trim() !== '' && 
                formData.duration.trim() !== '' && 
                formData.location.trim() !== '' && 
                formData.last_date.trim() !== ''
            )) &&
            (!fieldToggles.skills || formData.skills_required.length > 0) &&
            (!fieldToggles.description || formData.description.trim() !== '') &&
            (!fieldToggles.applicationDetails || formData.application_link.trim() !== '');
        
        setIsFormValid(isValid);
    }, [formData, fieldToggles]);

    const toggleField = (field) => {
        setFieldToggles(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleArrayChange = (field, value) => {
        setCurrentInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = (field) => {
        const inputField = field === 'skills_required' ? 'skill' : 
                          field === 'eligibility_criteria' ? 'eligibility' : 'keyword';
        
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

    // Prevent form submission on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            // For add buttons, trigger their click when Enter is pressed in their associated input
            if (e.target.tagName === 'INPUT' && e.target.nextElementSibling?.tagName === 'BUTTON') {
                e.target.nextElementSibling.click();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only validate enabled fields
            if (fieldToggles.skills && formData.skills_required.length === 0) {
                alert('Please add at least one skill or disable this field');
                return;
            }
            if (fieldToggles.eligibility && formData.eligibility_criteria.length === 0) {
                alert('Please add at least one eligibility criteria or disable this field');
                return;
            }
            if (fieldToggles.description && !formData.description.trim()) {
                alert('Please enter description or disable this field');
                return;
            }

            await onSubmit(formData);
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Failed to create internship');
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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add New Internship</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Basic Information</h3>
                        
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
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>

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
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Internship Type */}
                        <div>
                            <ToggleSwitch 
                                enabled={fieldToggles.internshipType} 
                                onToggle={() => toggleField('internshipType')} 
                                label="Internship Type" 
                            />
                            {fieldToggles.internshipType && (
                                <select
                                    name="internship_type"
                                    value={formData.internship_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Internship Type</option>
                                    <option value="On-Site">On-Site</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Basic Info (Dates & Location) */}
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={fieldToggles.basicInfo} 
                            onToggle={() => toggleField('basicInfo')} 
                            label="Basic Information (Dates & Location)" 
                        />
                        {fieldToggles.basicInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Date to Apply</label>
                                    <input
                                        type="date"
                                        name="last_date"
                                        value={formData.last_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g., 3 months"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter location"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Skills Required */}
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={fieldToggles.skills} 
                            onToggle={() => toggleField('skills')} 
                            label="Skills Required" 
                        />
                        {fieldToggles.skills && (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentInputs.skill}
                                        onChange={(e) => handleArrayChange('skill', e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add skill"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleAddItem('skills_required');
                                            setCurrentInputs(prev => ({...prev, skill: ''}));
                                        }}
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

                    {/* Optional Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>

                        {/* Qualification */}
                        <div className="md:col-span-2">
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
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    </div>

                    {/* Eligibility Criteria */}
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={fieldToggles.eligibility} 
                            onToggle={() => toggleField('eligibility')} 
                            label="Eligibility Criteria" 
                        />
                        {fieldToggles.eligibility && (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentInputs.eligibility}
                                        onChange={(e) => handleArrayChange('eligibility', e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add eligibility criteria"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleAddItem('eligibility_criteria');
                                            setCurrentInputs(prev => ({...prev, eligibility: ''}));
                                        }}
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

                    {/* Application Details */}
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={fieldToggles.applicationDetails} 
                            onToggle={() => toggleField('applicationDetails')} 
                            label="Application Details" 
                        />
                        {fieldToggles.applicationDetails && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Application Link</label>
                                <input
                                    type="url"
                                    name="application_link"
                                    value={formData.application_link}
                                    onChange={handleChange}
                                    placeholder="Enter application URL"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        )}
                    </div>

                    {/* SEO Fields */}
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={fieldToggles.seoFields} 
                            onToggle={() => toggleField('seoFields')} 
                            label="SEO & Advanced Options" 
                        />
                        {fieldToggles.seoFields && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">URL Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="URL slug (auto-generated if empty)"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Keywords */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Keywords</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentInputs.keyword}
                                            onChange={(e) => handleArrayChange('keyword', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add keyword"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleAddItem('keywords');
                                                setCurrentInputs(prev => ({...prev, keyword: ''}));
                                            }}
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

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Search Description</label>
                                    <textarea
                                        name="searchDescription"
                                        value={formData.searchDescription}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Brief description for search results"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Featured Option */}
                    <div className="space-y-4">
                        <ToggleSwitch 
                            enabled={fieldToggles.featured} 
                            onToggle={() => toggleField('featured')} 
                            label="Visibility Options" 
                        />
                        {fieldToggles.featured && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 mr-3"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-bold">Featured Internship</span>
                            </div>
                        )}
                    </div>
    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') ? (
                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`px-6 py-2 ${
                                        isFormValid 
                                        ? 'bg-blue-600 hover:bg-blue-700' 
                                        : 'bg-blue-300 cursor-not-allowed'
                                    } text-white rounded-lg`}
                                >
                                    Add Internship
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Login to Add
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );    
};

export default AddInternshipModal;