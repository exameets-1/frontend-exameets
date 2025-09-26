import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const EditInternshipModal = ({ isOpen, onClose, onSubmit, internship }) => {
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

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Populate the form with existing internship data when available
    useEffect(() => {
        if (internship) {
            setFormData({
                internship_type: internship.internship_type || '',
                title: internship.title || '',
                start_date: internship.start_date || '',
                duration: internship.duration || '',
                skills_required: internship.skills_required || [],
                stipend: internship.stipend || '',
                organization: internship.organization || '',
                location: internship.location || '',
                qualification: internship.qualification || '',
                eligibility_criteria: internship.eligibility_criteria || [],
                application_link: internship.application_link || '',
                last_date: internship.last_date || '',
                is_featured: internship.is_featured || false,
                field: internship.field || '',
                description: internship.description || '',
                slug: internship.slug || '',
                keywords: internship.keywords || [],
                searchDescription: internship.searchDescription || ''
            });
        }
    }, [internship]);

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
                          field === 'eligibility_criteria' ? 'eligibility' : 
                          field === 'keywords' ? 'keyword' : field;
        
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
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Internship</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
    
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Fields */}
                        {/* Repeat this pattern for all input fields */}
                        {[
                            { label: "Title", name: "title" },
                            { label: "Organization", name: "organization" },
                            { label: "Internship Type", name: "internship_type", type: "select", options: ["On-Site", "Remote"] },
                            { label: "Field", name: "field" },
                            { label: "Start Date", name: "start_date" },
                            { label: "Last Date to Apply", name: "last_date" },
                            { label: "Duration", name: "duration" },
                            { label: "Stipend", name: "stipend" },
                            { label: "Location", name: "location" },
                            { label: "Qualification", name: "qualification" },
                            { label: "Application Link", name: "application_link", type: "url" },
                            { label: "Slug", name: "slug" }
                        ].map((field, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{field.label}</label>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        ))}
    
                        {/* Array Fields */}
                        {Object.entries(arrayFields).map(([field, config]) => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{config.label}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={
                                            field === "skills_required" ? currentInputs.skill :
                                            field === "eligibility_criteria" ? currentInputs.eligibility :
                                            field === "keywords" ? currentInputs.keyword : currentInputs[field]
                                        }
                                        onChange={(e) => handleArrayChange(
                                            field === "skills_required" ? "skill" :
                                            field === "eligibility_criteria" ? "eligibility" :
                                            field === "keywords" ? "keyword" : field,
                                            e.target.value
                                        )}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
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
    
                        {/* Description Fields */}
                        {[
                            { label: "Description", name: "description", required: true },
                            { label: "Search Description", name: "searchDescription" }
                        ].map((field) => (
                            <div key={field.name} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{field.label}</label>
                                <textarea
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    rows={4}
                                    required={field.required}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                />
                            </div>
                        ))}
    
                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Featured Internship</label>
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
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
                                className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && (user?.role === "admin" || user?.role === "manager") ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Internship
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = "/login"}
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

export default EditInternshipModal;