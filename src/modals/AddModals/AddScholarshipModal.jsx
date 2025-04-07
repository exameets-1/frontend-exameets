import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { FaPlus, FaTrash } from 'react-icons/fa';

const AddScholarshipModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        organization: '',
        description: '',
        eligibility_criteria: '',
        amount: '',
        application_link: '',
        start_date: '',
        last_date: '',
        category: '',
        qualification: '',
        keywords: [],
        searchDescription: '',
        slug: '',
        is_featured: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({
        keyword: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const categories = [
        'Merit-based',
        'Need-based',
        'Research',
        'Sports',
        'Cultural', 
        'International',
        'Government',
        'Private',
        'Other'
    ];

    const qualifications = [
        'Class 8',
        'Class 9',
        'Class 10',
        'Class 11',
        'Class 12',
        'Graduation',
        'Post Graduation',
        'Post Graduation Diploma',
        'Phd',
        'ITI',
        'Polytechnic/Diploma',
        'Post Doctoral',
        'Vocational Course',
        'Coaching classes',
        'Other'
    ];

    // Check form validity whenever formData changes
    useEffect(() => {
        const requiredFields = [
            'title',
            'organization',
            'description',
            'eligibility_criteria',
            'amount',
            'application_link',
            'start_date',
            'last_date',
            'category',
            'qualification',
            'slug',
            'searchDescription'
        ];
        
        const allFieldsFilled = requiredFields.every(field => formData[field].trim() !== '');
        setIsFormValid(allFieldsFilled);
    }, [formData]);

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

    // Prevent form submission on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // If Enter is pressed in keyword field, add the keyword
            if (e.target.name === 'keyword' && currentInputs.keyword.trim()) {
                handleArrayAdd('keywords', currentInputs.keyword);
                setCurrentInputs(prev => ({ ...prev, keyword: '' }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            handleLogin();
            return;
        }

        if (!isFormValid) return;

        // Format dates if needed
        const formattedData = {
            ...formData,
        };

        onSubmit(formattedData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add New Scholarship</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter scholarship title"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Organization */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                required
                                placeholder="Enter organization name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
    
                        {/* Qualification */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qualification</label>
                            <select
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Select qualification</option>
                                {qualifications.map(qualification => (
                                    <option key={qualification} value={qualification}>{qualification}</option>
                                ))}
                            </select>
                        </div>
    
                        {/* Dates */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                            <input
                                type="text"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                placeholder="eg: 02-05-2025"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Date to Apply</label>
                            <input
                                type="text"
                                name="last_date"
                                value={formData.last_date}
                                onChange={handleChange}
                                required
                                placeholder="eg: 02-05-2025"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scholarship Amount</label>
                            <input
                                type="text"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                placeholder="Enter scholarship amount"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Application Link */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Application Link</label>
                            <input
                                type="url"
                                name="application_link"
                                value={formData.application_link}
                                onChange={handleChange}
                                required
                                placeholder="Enter application URL"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Eligibility Criteria */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Eligibility Criteria</label>
                            <textarea
                                name="eligibility_criteria"
                                value={formData.eligibility_criteria}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter eligibility criteria"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Enter scholarship description"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">Featured Scholarship</span>
                            </label>
                        </div>
    
                        {/* Slug */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="Enter scholarship slug"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Search Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Description</label>
                            <textarea
                                name="searchDescription"
                                value={formData.searchDescription}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter search description"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y dark:bg-gray-800 dark:text-white"
                            />
                        </div>
    
                        {/* Keywords */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="keyword"
                                    placeholder="Add keyword"
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
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
                                    <div key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1 text-gray-800 dark:text-white">
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
                                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && user?.role === 'admin' ? (
                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`px-6 py-2 rounded-lg ${isFormValid 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-blue-300 text-gray-100 cursor-not-allowed'}`}
                                >
                                    Add Scholarship
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleLogin}
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

export default AddScholarshipModal;