import { useState, useEffect } from 'react';
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
        eligibility: '',
        keyword: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Define required fields
    const requiredFields = [
        'internship_type', 'title', 'start_date', 'duration', 
        'organization', 'location', 'description', 'last_date'
    ];

    // Validate form on data change
    useEffect(() => {
        const checkFormValidity = () => {
            // Check if all required fields are filled
            const allRequiredFieldsFilled = requiredFields.every(field => 
                formData[field] && formData[field].toString().trim() !== ''
            );
            
            // Additional check for array fields
            const hasSkills = formData.skills_required.length > 0;
            
            setIsFormValid(allRequiredFieldsFilled && hasSkills);
        };
        
        checkFormValidity();
    }, [formData]);

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
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
                        {/* Input Field Generator */}
                        {[
                            { label: "Title", name: "title", required: true },
                            { label: "Organization", name: "organization", required: true },
                            { label: "Field", name: "field", required: false },
                            { label: "Start Date", name: "start_date", type: "date", required: true },
                            { label: "Last Date to Apply", name: "last_date", type: "date", required: true },
                            { label: "Duration", name: "duration", required: true },
                            { label: "Stipend", name: "stipend", required: false },
                            { label: "Location", name: "location", required: true },
                            { label: "Qualification", name: "qualification", required: false },
                            { label: "Application Link", name: "application_link", type: "url", required: false },
                            { label: "Slug", name: "slug", required: false }
                        ].map(({ label, name, type = "text", required }) => (
                            <div key={name} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {label} {required && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required={required}
                                    className={`w-full px-4 py-2 border ${
                                        required && !formData[name] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    } dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {required && !formData[name] && (
                                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                                )}
                            </div>
                        ))}
    
                        {/* Internship Type */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Internship Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="internship_type"
                                value={formData.internship_type}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2 border ${
                                    !formData.internship_type ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                } dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Select Internship Type</option>
                                <option value="On-Site">On-Site</option>
                                <option value="Remote">Remote</option>
                            </select>
                            {!formData.internship_type && (
                                <p className="text-red-500 text-xs mt-1">This field is required</p>
                            )}
                        </div>
    
                        {/* Array Fields */}
                        {Object.entries(arrayFields).map(([field, config]) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {config.label} {field === 'skills_required' && <span className="text-red-500">*</span>}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentInputs[field === 'skills_required' ? 'skill' : field === 'eligibility_criteria' ? 'eligibility' : 'keyword']}
                                        onChange={(e) => handleArrayChange(
                                            field === 'skills_required' ? 'skill' : 
                                            field === 'eligibility_criteria' ? 'eligibility' : 'keyword',
                                            e.target.value
                                        )}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm dark:text-white">
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
                                {field === 'skills_required' && formData[field].length === 0 && (
                                    <p className="text-red-500 text-xs mt-1">At least one skill is required</p>
                                )}
                            </div>
                        ))}
    
                        {/* Description Fields */}
                        {[
                            { name: "description", label: "Description", required: true },
                            { name: "searchDescription", label: "Search Description", required: false }
                        ].map(({ name, label, required }) => (
                            <div key={name} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {label} {required && <span className="text-red-500">*</span>}
                                </label>
                                <textarea
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`w-full px-4 py-2 border ${
                                        required && !formData[name] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                                    } dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y`}
                                    required={required}
                                />
                                {required && !formData[name] && (
                                    <p className="text-red-500 text-xs mt-1">This field is required</p>
                                )}
                            </div>
                        ))}
    
                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Featured Internship</span>
                            </label>
                        </div>
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