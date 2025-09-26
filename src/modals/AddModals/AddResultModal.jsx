import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddResultModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        title: '',
        organization: '',
        postName: '',
        totalVacancies: '',
        exam_type: 'Written Exam',
        resultDate: '',
        nextSteps: [],
        officialWebsite: '',
        importantDates: [],
        stepsToCheckResult: [],
        cutoffMarks: [],
        importantLinks: {
            resultLink: '',
            meritListLink: '',
            cutoffLink: '',
            nextStepsLink: '',
            aboutJobLink: ''
        },
        nextStepsDescription: '',
        documentsRequired: [],
        slug: '',
        keywords: [],
        searchDescription: '',
        isFeatured: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({
        nextStep: '',
        importantDateEvent: '',
        importantDateDate: '',
        stepToCheck: '',
        cutoffCategory: '',
        cutoffMark: '',
        documentRequired: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => state.user);

    const arrayFields = {
        nextSteps: { label: 'Next Steps', type: 'text' },
        stepsToCheckResult: { label: 'Steps to Check Result', type: 'text' },
        documentsRequired: { label: 'Documents Required', type: 'text' },
        importantDates: { label: 'Important Dates', type: 'object', fields: ['event', 'date'] },
        cutoffMarks: { label: 'Cutoff Marks', type: 'object', fields: ['category', 'marks'] },
        keywords: { label: 'Keywords', type: 'text' },
    };

    // Form validation
    useEffect(() => {
        const requiredFields = ['title', 'organization', 'postName', 'resultDate', 'officialWebsite'];
        const isValid = requiredFields.every(field => formData[field].trim() !== '');
        setIsFormValid(isValid);
    }, [formData]);

    const handleArrayChange = (field, value) => {
        setCurrentInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = (field) => {
        if (!currentInputs[field].trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], currentInputs[field].trim()]
        }));
        setCurrentInputs(prev => ({ ...prev, [field]: '' }));
    };

    const handleAddObjectItem = (field) => {
        const fields = arrayFields[field].fields;
        const values = fields.map(f => currentInputs[`${field}${f}`].trim());
        if (values.some(v => !v)) return;

        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], Object.fromEntries(fields.map((f, i) => [f, values[i]]))]
        }));
        fields.forEach(f => {
            setCurrentInputs(prev => ({ ...prev, [`${field}${f}`]: '' }));
        });
    };

    const handleRemoveItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (name.startsWith('importantLinks')) {
            const linkField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                importantLinks: { ...prev.importantLinks, [linkField]: value }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: e.target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(formData);
        }
    };

    // Handle key press to prevent form submission on Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Result</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            {["title", "organization", "postName", "totalVacancies"].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
                                        {field.replace(/([A-Z])/g, " $1")}
                                        {["title", "organization", "postName"].includes(field) && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        required={["title", "organization", "postName"].includes(field)}
                                    />
                                </div>
                            ))}
                        </div>
    
                        {/* Dates and Links */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Result Date<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="resultDate"
                                    value={formData.resultDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="DD/MM/YYYY"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Official Website<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="url"
                                    name="officialWebsite"
                                    value={formData.officialWebsite}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Exam Type</label>
                                <select
                                    name="exam_type"
                                    value={formData.exam_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="Written Exam">Written Exam</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Skill Test">Skill Test</option>
                                </select>
                            </div>
                        </div>
    
                        {/* Array Fields */}
                        {Object.entries(arrayFields).map(([field, config]) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{config.label}</label>
    
                                {config.type === 'object' ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            {config.fields.map(subField => (
                                                <input
                                                    key={subField}
                                                    type="text"
                                                    value={currentInputs[`${field}${subField}`] || ''}
                                                    onChange={(e) => handleArrayChange(`${field}${subField}`, e.target.value)}
                                                    placeholder={`Add ${subField}`}
                                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddObjectItem(field);
                                                        }
                                                    }}
                                                />
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => handleAddObjectItem(field)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData[field].map((item, index) => (
                                                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                                                    <div className="flex gap-2 text-gray-700 dark:text-gray-200">
                                                        {Object.entries(item).map(([key, value]) => (
                                                            <span key={key} className="font-bold">{key}: {value}</span>
                                                        ))}
                                                    </div>
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
                                ) : (
                                    <>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={currentInputs[field] || ''}
                                                onChange={(e) => handleArrayChange(field, e.target.value)}
                                                placeholder={`Add ${config.label.toLowerCase()}`}
                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddItem(field);
                                                    }
                                                }}
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
                                                <div key={index} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2 text-gray-800 dark:text-gray-100">
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
                                    </>
                                )}
                            </div>
                        ))}
    
                        {/* Important Links */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Important Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(formData.importantLinks).map(([linkType, linkValue]) => (
                                    <div key={linkType} className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
                                            {linkType.replace(/([A-Z])/g, ' $1')}
                                        </label>
                                        <input
                                            type="url"
                                            name={`importantLinks.${linkType}`}
                                            value={linkValue}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
    
                        {/* Next Steps Description */}
                        {["nextStepsDescription", "slug", "searchDescription"].map((field) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <textarea
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        ))}
    
                        {/* Is Featured */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Is Featured</label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                            />
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
                            {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') ? (
                                <button
                                    type="submit"
                                    className={`px-6 py-2 ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'} text-white rounded-lg`}
                                    disabled={!isFormValid}
                                >
                                    Add Result
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Login to Add Result
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResultModal;