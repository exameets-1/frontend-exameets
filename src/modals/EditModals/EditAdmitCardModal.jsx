import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const EditAdmitCardModal = ({ isOpen, onClose, onSubmit, admitCardData }) => {
    const initialFormData = {
        title: '',
        organization: '',
        advertisementNumber: '',
        importantDates: [],
        examDetails: [],
        vacancies: '',
        downloadSteps: [],
        importantLinks: [],
        instructions: [],
        officialWebsite: '',
        slug: '',
        keywords: [],
        searchDescription: '',
        isFeatured: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({
        importantDateEvent: '',
        importantDateDate: '',
        examDate: '',
        shiftTimings: '',
        reportingTime: '',
        downloadStep: '',
        instruction: '',
        linkType: '',
        link: ''
    });

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Load admit card data when component mounts or when admitCardData changes
    useEffect(() => {
        if (admitCardData && Object.keys(admitCardData).length > 0) {
            setFormData({
                ...admitCardData
            });
        }
    }, [admitCardData]);

    const arrayFields = {
        importantDates: { 
            label: 'Important Dates', 
            type: 'object', 
            fields: ['event', 'date'] 
        },
        examDetails: { 
            label: 'Exam Details', 
            type: 'object', 
            fields: ['examDate', 'shiftTimings', 'reportingTime'] 
        },
        downloadSteps: { label: 'Download Steps', type: 'text' },
        instructions: { label: 'Instructions', type: 'text' },
        importantLinks: { 
            label: 'Important Links', 
            type: 'object', 
            fields: ['linkType', 'link'] 
        },
        keywords: { label: 'Keywords', type: 'text' }
    };

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
        const values = fields.map(f => currentInputs[f].trim());
        if (values.some(v => !v)) return;

        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], 
            Object.fromEntries(fields.map((f, i) => [f, values[i]]))
            ]
        }));
        fields.forEach(f => {
            setCurrentInputs(prev => ({ ...prev, [f]: '' }));
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
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: e.target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            admitCardId: admitCardData._id,
            updatedData: formData
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Admit Card</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            {[
                                { name: 'title', label: 'Title' },
                                { name: 'organization', label: 'Organization' },
                                { name: 'advertisementNumber', label: 'Advertisement Number' },
                                { name: 'vacancies', label: 'Vacancies' },
                            ].map(({ name, label }) => (
                                <div key={name} className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{label}</label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
    
                        {/* Website and Slug */}
                        <div className="space-y-6">
                            {[
                                { name: 'officialWebsite', label: 'Official Website', type: 'url' },
                                { name: 'slug', label: 'Slug', type: 'text' },
                            ].map(({ name, label, type }) => (
                                <div key={name} className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
    
                        {/* Array Fields */}
                        {Object.entries(arrayFields).map(([field, config]) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{config.label}</label>
    
                                {config.type === 'object' ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            {config.fields.map(subField => (
                                                <input
                                                    key={subField}
                                                    type="text"
                                                    value={currentInputs[subField]}
                                                    onChange={(e) => handleArrayChange(subField, e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder={`Enter ${subField}`}
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
                                            {formData[field]?.map((item, index) => (
                                                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                                    <div className="flex gap-2 text-gray-800 dark:text-gray-100">
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
                                                value={currentInputs[field]}
                                                onChange={(e) => handleArrayChange(field, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            {formData[field]?.map((item, index) => (
                                                <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-gray-800 dark:text-gray-100">
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
    
                        {/* Search Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Search Description</label>
                            <textarea
                                name="searchDescription"
                                value={formData.searchDescription}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>
    
                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Featured Admit Card</label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                            />
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
                                    Update Admit Card
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
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

EditAdmitCardModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    admitCardData: PropTypes.object.isRequired
};

export default EditAdmitCardModal;