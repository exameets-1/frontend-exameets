import { useState } from 'react';
import { FaTimes, FaRobot, FaSpinner } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
const AddAiAdmission = ({ isOpen, onClose, onSubmit }) => {
    const [admissionDetails, setAdmissionDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate input
        if (!admissionDetails.trim()) {
            setError('Please enter admission details');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Call the onSubmit function passed from parent component
            await onSubmit(admissionDetails.trim());
            
            // Reset form on successful submission
            setAdmissionDetails('');
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to create AI admission');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setAdmissionDetails('');
            setError('');
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setAdmissionDetails(e.target.value);
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <FaRobot className="text-blue-600 dark:text-blue-400 text-xl" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Create AI Admission
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <FaRobot className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">
                                        AI Processing
                                    </h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        Enter admission details in any format. Our AI will process and structure the information automatically, extracting institute name, location, category, dates, eligibility, fees, and other relevant details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="admissionDetails" 
                                className="block text-sm font-bold text-gray-700 dark:text-gray-200"
                            >
                                Admission Details <span className="text-red-500">*</span>
                            </label>
                            
                            <textarea
                                id="admissionDetails"
                                name="admissionDetails"
                                value={admissionDetails}
                                onChange={handleInputChange}
                                placeholder="Example: 
XYZ University is offering admissions for Computer Science Engineering program. The application deadline is March 15, 2024. Located in Mumbai, Maharashtra. Eligibility: 12th pass with PCM. Fee: Rs 2,50,000 per year. Contact: admissions@xyz.edu"
                                rows={12}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                disabled={isLoading}
                                required
                            />
                            
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Minimum 10 characters required</span>
                                <span>{admissionDetails.length} characters</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !admissionDetails.trim() || admissionDetails.trim().length < 10}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaRobot />
                                        Create AI Admission
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAiAdmission;