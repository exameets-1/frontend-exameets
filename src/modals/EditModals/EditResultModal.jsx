import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const EditResultModal = ({ isOpen, onClose, onUpdate, resultData }) => {
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

    const { isAuthenticated, user } = useSelector((state) => state.user);

    const arrayFields = {
        nextSteps: { label: 'Next Steps', type: 'text' },
        stepsToCheckResult: { label: 'Steps to Check Result', type: 'text' },
        documentsRequired: { label: 'Documents Required', type: 'text' },
        importantDates: { label: 'Important Dates', type: 'object', fields: ['event', 'date'] },
        cutoffMarks: { label: 'Cutoff Marks', type: 'object', fields: ['category', 'marks'] },
        keywords: { label: 'Keywords', type: 'text' },
    };

    useEffect(() => {
        if (resultData) {
            setFormData({
                ...initialFormData,
                ...resultData,
                importantLinks: {
                    ...initialFormData.importantLinks,
                    ...(resultData.importantLinks || {})
                }
            });
        }
    }, [resultData]);

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
        onUpdate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Result</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            {["title", "organization", "postName", "totalVacancies"].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
    
                        {/* Dates & Links */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Result Date</label>
                                <input
                                    type="text"
                                    name="resultDate"
                                    value={formData.resultDate}
                                    onChange={handleChange}
                                    placeholder="DD/MM/YYYY"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
    
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Official Website</label>
                                <input
                                    type="url"
                                    name="officialWebsite"
                                    value={formData.officialWebsite}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
    
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Type</label>
                                <select
                                    name="exam_type"
                                    value={formData.exam_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{config.label}</label>
    
                                {config.type === 'object' ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            {config.fields.map(subField => (
                                                <input
                                                    key={subField}
                                                    type="text"
                                                    value={currentInputs[`${field}${subField}`]}
                                                    onChange={(e) => handleArrayChange(`${field}${subField}`, e.target.value)}
                                                    placeholder={`Add ${subField}`}
                                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ))}
                                            <button type="button" onClick={() => handleAddObjectItem(field)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                                <FaPlus />
                                            </button>
                                        </div>
    
                                        <div className="space-y-2">
                                            {formData[field].map((item, index) => (
                                                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                                                    <div className="flex gap-2 text-sm text-gray-700 dark:text-gray-200">
                                                        {Object.entries(item).map(([key, value]) => (
                                                            <span key={key} className="font-medium">{key}: {value}</span>
                                                        ))}
                                                    </div>
                                                    <button type="button" onClick={() => handleRemoveItem(field, index)} className="text-red-500 hover:text-red-700">
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
                                                value={currentInputs[field]}
                                                onChange={(e) => handleArrayChange(field, e.target.value)}
                                                placeholder={`Add ${config.label.toLowerCase()}`}
                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button type="button" onClick={() => handleAddItem(field)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData[field].map((item, index) => (
                                                <div key={index} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                                    {item}
                                                    <button type="button" onClick={() => handleRemoveItem(field, index)} className="text-red-500 hover:text-red-700">
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
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Important Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(formData.importantLinks).map(([linkType, linkValue]) => (
                                    <div key={linkType} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                            {linkType.replace(/([A-Z])/g, ' $1')}
                                        </label>
                                        <input
                                            type="url"
                                            name={`importantLinks.${linkType}`}
                                            value={linkValue}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
    
                        {/* Textareas */}
                        {["nextStepsDescription", "searchDescription"].map((field) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <textarea
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                />
                            </div>
                        ))}
    
                        {/* Slug */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
    
                        {/* Is Featured */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Is Featured</label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                            />
                        </div>
                    </div>
    
                    {/* Action Buttons */}
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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Result
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Login to Edit Result
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )    
};

export default EditResultModal;