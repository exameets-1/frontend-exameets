import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddPreviousYearModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        exam_name: '',
        description: '',
        subject: '',
        year: new Date().getFullYear(),
        difficulty_level: '',
        category: '',
        paper_link: '',
        solution_link: '',
        is_featured: false,
        keywords: [],
        searchDescription: '',
        slug: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({ keyword: '' });
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const categories = [
        "Engineering",
        "Medical",
        "Civil Services",
        "Banking",
        "Railways",
        "Teaching",
        "Defence",
        "State Services",
        "Other"
    ];

    const difficultyLevels = ["Easy", "Medium", "Hard", "Very Hard"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            handleLogin();
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Add Previous Year Paper</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title and Exam Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter paper title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                            <input
                                type="text"
                                name="exam_name"
                                value={formData.exam_name}
                                onChange={handleChange}
                                required
                                placeholder="Enter exam name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category and Subject */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="Enter subject name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Year and Difficulty Level */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                            <select
                                name="difficulty_level"
                                value={formData.difficulty_level}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select difficulty</option>
                                {difficultyLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        {/* Paper Links */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Question Paper Link</label>
                            <input
                                type="url"
                                name="paper_link"
                                value={formData.paper_link}
                                onChange={handleChange}
                                required
                                placeholder="Enter question paper URL"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Solution Link (Optional)</label>
                            <input
                                type="url"
                                name="solution_link"
                                value={formData.solution_link}
                                onChange={handleChange}
                                placeholder="Enter solution paper URL"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Enter paper description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>

                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured Paper</span>
                            </label>
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="Enter paper slug"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Search Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Search Description</label>
                            <textarea
                                name="searchDescription"
                                value={formData.searchDescription}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter search description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>

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
                                    Add Paper
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

export default AddPreviousYearModal;