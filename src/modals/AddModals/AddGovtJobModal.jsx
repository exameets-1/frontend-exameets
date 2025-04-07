import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AddGovtJobModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        jobTitle: '',
        slug: '',
        jobOverview: '',
        year: '',
        organization: '',
        postNames: [],
        totalVacancies: '',
        applicationMode: '',
        jobLocation: '',
        officialWebsite: '',
        notification_about: '',
        notificationReleaseDate: '',
        applicationStartDate: '',
        applicationEndDate: '',
        examInterviewDate: '',
        educationalQualifications: [],
        ageLimitMin: '',
        ageLimitMax: '',
        ageRelaxation: '',
        additionalRequirements: [],
        vacancyPostNames: [],
        vacancyCounts: [],
        vacancyPayScales: [],
        applicationFeeGeneral: '',
        applicationFee_SC_ST_PWD: '',
        applicationFeePaymentMode: '',
        selectionProcess: [],
        howToApplyOnlineSteps: [],
        howToApplyOfflineSteps: [],
        requiredDocuments: [],
        examSubjects: [],
        examQuestionCounts: [],
        examMarks: [],
        examDurations: [],
        notificationPDFLink: '',
        applyOnlineLink: '',
        officialWebsiteLink: '',
        keywords: [],
        searchDescription: '',
        isFeatured: false,
        faq: []
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentInputs, setCurrentInputs] = useState({
        postNames: '',
        educationalQualifications: '',
        additionalRequirements: '',
        vacancyPostNames: '',
        vacancyCounts: '',
        vacancyPayScales: '',
        selectionProcess: '',
        howToApplyOnlineSteps: '',
        howToApplyOfflineSteps: '',
        requiredDocuments: '',
        examSubjects: '',
        examQuestionCounts: '',
        examMarks: '',
        examDurations: '',
        keywords: ''
    });
    const [currentFAQ, setCurrentFAQ] = useState({ question: '', answer: '' });

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Define required fields
    const requiredFields = [
        'jobTitle',
        'slug',
        'organization',
        'notification_about',
        'notificationReleaseDate',
        'applicationStartDate',
        'applicationEndDate'
        // Add other required fields as needed
    ];

    // Validation function
    const isFormValid = () => {
        return requiredFields.every(field => 
            formData[field] && formData[field].toString().trim() !== ''
        );
    };

    const arrayFields = [
        'postNames', 'educationalQualifications', 'additionalRequirements',
        'vacancyPostNames', 'vacancyCounts', 'vacancyPayScales', 'selectionProcess',
        'howToApplyOnlineSteps', 'howToApplyOfflineSteps', 'requiredDocuments',
        'examSubjects', 'examQuestionCounts', 'examMarks', 'examDurations', 'keywords'
    ];

    const fieldTypes = {
        notification_about: {
            type: 'select',
            label: 'Government Job Type',
            options: [
                'UPSC', 'SSC', 'IBPS Banking', 'Teaching', 'Railway', 'Defense',
                'State Govt', 'PSUs', 'Medical', 'Judiciary', 'Insurance', 'Post Office',
                'Agriculture', 'Indian Railways', 'Environment', 'Economic', 'Media',
                'Energy', 'Social Welfare', 'Customs', 'Taxation', 'Transport', 'Tourism',
                'Cultural', 'Science', 'Meteorological'
            ]
        },
        slug: { type: 'text', label: 'Slug (URL-friendly identifier)' },
        jobTitle: { type: 'text', label: 'Job Title' },
        jobOverview: { type: 'text', label: 'Job Overview', multiline: true },
        year: { type: 'text', label: 'Year' },
        organization: { type: 'text', label: 'Organization' },
        totalVacancies: { type: 'text', label: 'Total Vacancies' },
        applicationMode: { type: 'select', label: 'Application Mode', options: ['Online', 'Offline', 'Both'] },
        jobLocation: { type: 'text', label: 'Job Location' },
        officialWebsite: { type: 'text', label: 'Official Website' },
        notificationReleaseDate: { type: 'text', label: 'Notification Release Date' },
        applicationStartDate: { type: 'text', label: 'Application Start Date DD/MM/YYYY' },
        applicationEndDate: { type: 'text', label: 'Application End Date DD/MM/YYYY' },
        examInterviewDate: { type: 'text', label: 'Exam/Interview Date DD/MM/YYYY' },
        ageLimitMin: { type: 'text', label: 'Minimum Age' },
        ageLimitMax: { type: 'text', label: 'Maximum Age' },
        ageRelaxation: { type: 'text', label: 'Age Relaxation' },
        applicationFeeGeneral: { type: 'text', label: 'Fee (General)' },
        applicationFee_SC_ST_PWD: { type: 'text', label: 'Fee (SC/ST/PWD)' },
        applicationFeePaymentMode: { type: 'select', label: 'Payment Mode', options: ['Online', 'Offline', 'Bank Transfer'] },
        notificationPDFLink: { type: 'text', label: 'PDF Link' },
        applyOnlineLink: { type: 'text', label: 'Apply Online Link' },
        officialWebsiteLink: { type: 'text', label: 'Official Website' },
        searchDescription: { type: 'text', label: 'Search Description', multiline: true },
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

    const handleRemoveItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Prevent form submission on Enter key
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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Government Job</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(fieldTypes).map(([fieldName, fieldInfo]) => (
                            <div key={fieldName} className={fieldInfo.type === 'checkbox' ? 'md:col-span-2' : ''}>
                                {fieldInfo.type === 'checkbox' ? (
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            name={fieldName}
                                            checked={formData[fieldName]}
                                            onChange={handleChange}
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700 dark:text-gray-200 font-medium">{fieldInfo.label}</span>
                                    </label>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {fieldInfo.label}
                                            {requiredFields.includes(fieldName) && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {fieldInfo.type === 'select' ? (
                                            <select
                                                name={fieldName}
                                                value={formData[fieldName]}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select {fieldInfo.label}</option>
                                                {fieldInfo.options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        ) : fieldInfo.multiline ? (
                                            <textarea
                                                name={fieldName}
                                                value={formData[fieldName]}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                name={fieldName}
                                                value={formData[fieldName]}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder={fieldInfo.label}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {arrayFields.map(field => (
                            <div key={field} className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentInputs[field]}
                                        onChange={(e) => handleArrayChange(field, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Add ${field.replace(/([A-Z])/g, ' $1')}`}
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
                                        <div key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1 rounded-full flex items-center gap-2">
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

                        {/* FAQ Section */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Frequently Asked Questions (FAQ)
                            </label>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={currentFAQ.question}
                                        onChange={(e) => setCurrentFAQ(prev => ({ ...prev, question: e.target.value }))}
                                        placeholder="Question"
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={currentFAQ.answer}
                                        onChange={(e) => setCurrentFAQ(prev => ({ ...prev, answer: e.target.value }))}
                                        placeholder="Answer"
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (currentFAQ.question.trim() && currentFAQ.answer.trim()) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    faq: [...prev.faq, {
                                                        question: currentFAQ.question.trim(),
                                                        answer: currentFAQ.answer.trim()
                                                    }]
                                                }));
                                                setCurrentFAQ({ question: '', answer: '' });
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.faq.map((item, index) => (
                                        <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium dark:text-white">{item.question}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem('faq', index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700 dark:text-gray-200 font-medium">Mark as Featured</span>
                            </label>
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
                                    disabled={!isFormValid()}
                                    className={`px-6 py-2 ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'} text-white rounded-lg`}
                                >
                                    Add Government Job
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Login to Add Job
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGovtJobModal;