import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddInternshipModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        internship_type: '',
        title: '',
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

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({
        skill: '',
        eligibility: ''
    });

    const { isAuthenticated, user } = useSelector((state) => state.user);

    const arrayFields = {
        skills_required: { label: 'Skills Required', type: 'text' },
        eligibility_criteria: { label: 'Eligibility Criteria', type: 'text' },
        keywords: { label: 'Keywords', type: 'text' }
    };

    const handleArrayChange = (field, value) => {
        setCurrentInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = (field) => {
        const inputField = field === 'skills_required' ? 'skill' : 
                          field === 'eligibility_criteria' ? 'eligibility' : field;
        
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Internship</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Organization</label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Internship Type</label>
                                <select
                                    name="internship_type"
                                    value={formData.internship_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Internship Type</option>
                                    <option value="On-Site">On-Site</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Field</label>
                                <input
                                    type="text"
                                    name="field"
                                    value={formData.field}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Dates and Duration */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="text"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Last Date to Apply</label>
                                <input
                                    type="text"
                                    name="last_date"
                                    value={formData.last_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Stipend</label>
                                <input
                                    type="text"
                                    name="stipend"
                                    value={formData.stipend}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Location and Qualification */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Links and Slug */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Application Link</label>
                                <input
                                    type="url"
                                    name="application_link"
                                    value={formData.application_link}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Array Fields */}
                        {Object.entries(arrayFields).map(([field, config]) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">{config.label}</label>
                                
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={field === 'skills_required' ? currentInputs.skill : 
                                              field === 'eligibility_criteria' ? currentInputs.eligibility : 
                                              currentInputs[field]}
                                        onChange={(e) => handleArrayChange(
                                            field === 'skills_required' ? 'skill' : 
                                            field === 'eligibility_criteria' ? 'eligibility' : field, 
                                            e.target.value
                                        )}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Add ${config.label.toLowerCase()}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem(field)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData[field].map((item, index) => (
                                        <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(field, index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                required
                            />
                        </div>

                        {/* Search Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Search Description</label>
                            <textarea
                                name="searchDescription"
                                value={formData.searchDescription}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>

                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Featured Internship</label>
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && user?.role === 'admin' ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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