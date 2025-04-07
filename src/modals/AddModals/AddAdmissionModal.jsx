import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAdmissionModal = ({ isOpen, onClose, onSubmit }) => {
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
    const [currentInputs, setCurrentInputs] = useState({ keyword: '' });
    const { isAuthenticated, user } = useSelector((state) => state.user);

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

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const isFormValid = () => {
        const requiredFields = [
            'title',
            'institute',
            'description',
            'eligibility_criteria',
            'course',
            'application_link',
            'start_date',
            'last_date',
            'category',
            'fees',
            'location',
            'searchDescription',
            'slug',
        ];

        for (const field of requiredFields) {
            if (!formData[field]?.trim()) return false;
        }

        if (formData.searchDescription.length > 160) return false;
        if (!isValidUrl(formData.application_link)) return false;
        if (!Array.isArray(formData.keywords)) return false;

        return true;
    };

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

    const handleFormKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName.toLowerCase() !== 'textarea') {
            e.preventDefault();
        }
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            handleLogin();
            return;
        }

        // Client-side validations
        const requiredFields = [
            'title',
            'institute',
            'description',
            'eligibility_criteria',
            'course',
            'application_link',
            'start_date',
            'last_date',
            'category',
            'fees',
            'location',
            'searchDescription',
            'slug',
        ];

        for (const field of requiredFields) {
            if (!formData[field]?.trim()) {
                toast.error(`${field.replace('_', ' ').toUpperCase()} is required`);
                return;
            }
        }

        if (formData.searchDescription.length > 160) {
            toast.error('Search description must be less than 160 characters');
            return;
        }

        if (!isValidUrl(formData.application_link)) {
            toast.error('Application link must be a valid URL');
            return;
        }

        if (!Array.isArray(formData.keywords)) {
            toast.error('Keywords must be an array');
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add New Admission</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form 
                    onSubmit={handleSubmit} 
                    onKeyDown={handleFormKeyDown}
                    className="p-6 space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
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
    
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
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
    
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Application Link</label>
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
    
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Eligibility Criteria</label>
                            <textarea
                                name="eligibility_criteria"
                                value={formData.eligibility_criteria}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter eligibility criteria"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>
    
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Enter admission description"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>
    
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Search Description</label>
                            <textarea
                                name="searchDescription"
                                value={formData.searchDescription}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter search description (max 160 chars)"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                maxLength={160}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formData.searchDescription.length}/160 characters
                            </span>
                        </div>
    
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Featured Admission</span>
                            </label>
                        </div>
    
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Keywords</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add keyword"
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded"
                                    value={currentInputs.keyword}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, keyword: e.target.value }))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (currentInputs.keyword.trim()) {
                                                handleArrayAdd('keywords', currentInputs.keyword);
                                                setCurrentInputs(prev => ({ ...prev, keyword: '' }));
                                            }
                                        }
                                    }}
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
                            {isAuthenticated && user?.role === 'admin' ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isFormValid()}
                                >
                                    Add Admission
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

export default AddAdmissionModal;