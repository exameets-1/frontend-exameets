import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveTests, addQuestion, clearAddQuestionStatus } from '../../store/slices/testSlice.js';
import { toast } from 'react-toastify';

const AddQuestion = () => {
  const dispatch = useDispatch();
  const { 
    activeTests, 
    isLoading: loading, 
    error, 
    addQuestionStatus: {
      isLoading: submitLoading,
      error: submitError,
      success: submitSuccess,
      response: submitResponse
    }
  } = useSelector((state) => state.test);

  const [formData, setFormData] = useState({
    questionText: '',
    options: [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ],
    correctOptionIndex: 0,
    minTimeToSolve: 30,
    selectedTests: [],
  });

  useEffect(() => {
    dispatch(fetchActiveTests());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      toast.success(`Question added successfully to ${submitResponse?.addedToTestCourses?.length || 0} test(s)!`);
      
      // Reset form on success
      setFormData({
        questionText: '',
        options: [
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
        ],
        correctOptionIndex: 0,
        minTimeToSolve: 30,
        selectedTests: [],
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        dispatch(clearAddQuestionStatus());
      }, 3000);
    }
  }, [submitSuccess, dispatch, submitResponse]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
    if (submitError) {
      toast.error(`Error: ${submitError}`);
    }
  }, [error, submitError]);

  const handleQuestionChange = (e) => {
    setFormData({ ...formData, questionText: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { text: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectOptionChange = (e) => {
    setFormData({ ...formData, correctOptionIndex: parseInt(e.target.value) });
  };

  const handleMinTimeChange = (e) => {
    setFormData({ ...formData, minTimeToSolve: parseInt(e.target.value) || 0 });
  };

  const handleTestSelection = (testId) => {
    const newSelectedTests = formData.selectedTests.includes(testId)
      ? formData.selectedTests.filter((id) => id !== testId)
      : [...formData.selectedTests, testId];
    
    setFormData({ ...formData, selectedTests: newSelectedTests });
  };

  const isFormValid = () => {
    if (!formData.questionText.trim()) return false;
    if (formData.options.some((opt) => !opt.text.trim())) return false;
    if (formData.selectedTests.length === 0) return false;
    return true;
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName.toLowerCase() !== 'textarea') {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation with toast messages
    if (!formData.questionText.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (formData.options.some((opt) => !opt.text.trim())) {
      toast.error('All options must be filled');
      return;
    }

    if (formData.selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }

    // Prepare data for API
    const questionData = {
      questionText: formData.questionText,
      options: formData.options,
      correctOptionIndex: formData.correctOptionIndex,
      minTimeToSolve: formData.minTimeToSolve,
      testCourseIds: formData.selectedTests,
    };

    dispatch(addQuestion(questionData));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          Add New Question
        </h1>
        <p className="text-indigo-100 text-center mt-2">
          Create questions for your tests
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-6 text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading tests...
          </div>
        </div>
      )}

      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        onKeyDown={handleFormKeyDown}
        className="p-6 space-y-6"
      >
        {/* Question Text */}
        <div className="space-y-2">
          <label htmlFor="questionText" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
            Question Text *
          </label>
          <textarea
            id="questionText"
            value={formData.questionText}
            onChange={handleQuestionChange}
            placeholder="Enter your question here..."
            rows="4"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-vertical"
          />
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
            Options *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.options.map((option, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Option {index + 1}
                </label>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Enter option ${index + 1}`}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Correct Answer */}
        <div className="space-y-2">
          <label htmlFor="correctOption" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
            Correct Answer *
          </label>
          <select
            id="correctOption"
            value={formData.correctOptionIndex}
            onChange={handleCorrectOptionChange}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {formData.options.map((option, index) => (
              <option key={index} value={index}>
                Option {index + 1}{option.text ? `: ${option.text}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Time to Solve */}
        <div className="space-y-2">
          <label htmlFor="minTimeToSolve" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
            Minimum Time to Solve (seconds) *
          </label>
          <input
            type="number"
            id="minTimeToSolve"
            value={formData.minTimeToSolve}
            onChange={handleMinTimeChange}
            min="1"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minimum time required for students to solve this question
          </p>
        </div>

        {/* Test Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
            Select Tests *
          </label>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
            {activeTests && activeTests.length > 0 ? (
              <div className="space-y-3">
                {activeTests.map((test) => (
                  <div key={test.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-200">
                    <input
                      type="checkbox"
                      id={test.id}
                      checked={formData.selectedTests.includes(test.id)}
                      onChange={() => handleTestSelection(test.id)}
                      className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor={test.id} className="flex-1 cursor-pointer">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{test.name}</p>
                      {test.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{test.description}</p>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium">No tests available</p>
                <p className="text-xs mt-1">Please create some tests first</p>
              </div>
            )}
          </div>
          {formData.selectedTests.length > 0 && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              {formData.selectedTests.length} test(s) selected
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  questionText: '',
                  options: [
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                  ],
                  correctOptionIndex: 0,
                  minTimeToSolve: 30,
                  selectedTests: [],
                });
              }}
              className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={submitLoading || !isFormValid()}
              className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {submitLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Question...
                </span>
              ) : (
                'Add Question'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;