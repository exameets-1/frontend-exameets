import { useState } from 'react';
import { FaRobot, FaSpinner, FaTimes } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
export const AddAiPreviousYear = ({ isOpen, onClose, onSubmit }) => {
    const [previousYearDetails, setPreviousYearDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!previousYearDetails.trim()) {
            setError('Please enter previous year details');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onSubmit(previousYearDetails.trim());
            setPreviousYearDetails('');
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to create AI previous year details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setPreviousYearDetails('');
            setError('');
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setPreviousYearDetails(e.target.value);
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
                        <FaRobot className="text-green-600 dark:text-green-400 text-xl" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Create AI Previous Paper
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
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <FaRobot className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                                        AI Processing
                                    </h4>
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        Enter previous year details in any format. AI will automatically extract key fields like subject, year, and important topics.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="previousYearDetails" 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Previous Year Details <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                id="previousYearDetails"
                                name="previousYearDetails"
                                value={previousYearDetails}
                                onChange={handleInputChange}
                                placeholder="Example:
The 2023 Computer Science Engineering exam focused on data structures, algorithms, and software engineering principles. Key topics included binary trees, sorting algorithms, and software development life cycle. The exam consisted of 100 questions with a total of 200 marks. Important topics to review include complexity analysis and design patterns."
                                rows={12}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                                disabled={isLoading}
                                required
                            />

                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Minimum 10 characters required</span>
                                <span>{previousYearDetails.length} characters</span>
                            </div>
                        </div>

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
                                disabled={isLoading || !previousYearDetails.trim() || previousYearDetails.trim().length < 10}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaRobot />
                                        Create AI Previous Year
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

export default AddAiPreviousYear;
