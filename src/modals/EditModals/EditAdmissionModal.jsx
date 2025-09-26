import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EditAdmissionModal = ({ isOpen, onClose, admission, admissionId, onUpdate}) => {
    const initialFormData = {
        title: '',
        institute: '',
        description: '',
        eligibility_criteria: '',
        course: '',
        application_link: '',
        start_date: '',
        last_date: '',
        category: '',
        fees: '',
        location: '',
        keywords: [],
        searchDescription: '',
        slug: '',
        is_featured: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({
        keyword: ''
    });
    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Load existing data when modal opens or admissionData changes
    useEffect(() => {
        if (admission) {
            setFormData(admission);
            // Initialize array fields with existing data
            const arrayFields = [
                'keywords'
            ];
            
            arrayFields.forEach(field => {
                setCurrentInputs(prev => ({
                    ...prev,
                    [field]: admission[field].join(', ') || ''
                }));
            });
        }
    }, [admission]);

    const categories = [
        'Engineering',
        'Medical',
        'Arts',
        'Science',
        'Commerce',
        'Management',
        'Law',
        'Design',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const handleLogin = () => {
        window.location.href = '/login';
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const cleanData = (({ _id, createdAt, ...rest }) => rest)(formData);
      
      await onUpdate({ admissionId, updatedData: cleanData });
      onClose();
    } catch (error) {
      console.error('Failed to update admission:', error);
    }
  };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Admission</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Text Inputs */}
                        {[
                            { name: 'title', label: 'Title', placeholder: 'Enter admission title' },
                            { name: 'institute', label: 'Institute', placeholder: 'Enter institute name' },
                            { name: 'course', label: 'Course', placeholder: 'Enter course name' },
                            { name: 'start_date', label: 'Start Date', placeholder: 'eg: 02/05/24' },
                            { name: 'last_date', label: 'Last Date to Apply', placeholder: 'eg: 02/05/24' },
                            { name: 'fees', label: 'Fees', placeholder: 'Enter course fees' },
                            { name: 'location', label: 'Location', placeholder: 'Enter institute location' },
                            { name: 'slug', label: 'Slug', placeholder: 'Enter admission slug' },
                        ].map(({ name, label, placeholder }) => (
                            <div key={name} className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                    placeholder={placeholder}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
    
                        {/* Category Select */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
    
                        {/* Application Link */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Application Link</label>
                            <input
                                type="url"
                                name="application_link"
                                value={formData.application_link}
                                onChange={handleChange}
                                required
                                placeholder="Enter application URL"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
    
                        {/* Textareas */}
                        {[
                            { name: 'eligibility_criteria', label: 'Eligibility Criteria', rows: 3 },
                            { name: 'description', label: 'Description', rows: 4 },
                            { name: 'searchDescription', label: 'Search Description', rows: 3 },
                        ].map(({ name, label, rows }) => (
                            <div key={name} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{label}</label>
                                <textarea
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                    rows={rows}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                />
                            </div>
                        ))}
    
                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                                />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Featured Admission</span>
                            </label>
                        </div>
    
                        {/* Keywords Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Keywords</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add keyword"
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded"
                                    value={currentInputs.keyword}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, keyword: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                    onClick={() => {
                                        handleArrayAdd('keywords', currentInputs.keyword);
                                        setCurrentInputs(prev => ({ ...prev, keyword: '' }));
                                    }}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.keywords.map((keyword, index) => (
                                    <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 text-gray-800 dark:text-gray-100">
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
                    </div>
    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Admission
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleLogin}
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

export default EditAdmissionModal;