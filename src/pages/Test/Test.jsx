import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveTests, addQuestion, clearAddQuestionStatus } from '../../store/slices/testSlice.js';

const Test = () => {
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
    selectedTests: [],
  });

  useEffect(() => {
    dispatch(fetchActiveTests());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
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
        selectedTests: [],
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        dispatch(clearAddQuestionStatus());
      }, 3000);
    }
  }, [submitSuccess, dispatch]);

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

  const handleTestSelection = (testId) => {
    const newSelectedTests = formData.selectedTests.includes(testId)
      ? formData.selectedTests.filter((id) => id !== testId)
      : [...formData.selectedTests, testId];
    
    setFormData({ ...formData, selectedTests: newSelectedTests });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (formData.options.some((opt) => !opt.text.trim())) {
      alert('Please fill all options');
      return;
    }

    if (formData.selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    // Prepare data for API
    const questionData = {
      questionText: formData.questionText,
      options: formData.options,
      correctOptionIndex: formData.correctOptionIndex,
      testCourseIds: formData.selectedTests,
    };

    dispatch(addQuestion(questionData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
            Add New Question
          </h1>

          {loading && (
            <div className="text-center py-4 text-indigo-600 font-medium">
              Loading tests...
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          )}

          {submitError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">Error: {submitError}</p>
            </div>
          )}

          {submitSuccess && submitResponse && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 font-medium">
                Question added successfully to {submitResponse.addedToTestCourses?.length || 0} test(s)!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label htmlFor="questionText" className="block text-sm font-semibold text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                id="questionText"
                value={formData.questionText}
                onChange={handleQuestionChange}
                placeholder="Enter your question here..."
                rows="4"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-vertical"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Options *
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0">
                      Option {index + 1}:
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Enter option ${index + 1}`}
                      required
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <label htmlFor="correctOption" className="block text-sm font-semibold text-gray-700 mb-2">
                Correct Answer *
              </label>
              <select
                id="correctOption"
                value={formData.correctOptionIndex}
                onChange={handleCorrectOptionChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white cursor-pointer"
              >
                {formData.options.map((_, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Tests *
              </label>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {activeTests.map((test) => (
                  <div key={test.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
                    <input
                      type="checkbox"
                      id={test.id}
                      checked={formData.selectedTests.includes(test.id)}
                      onChange={() => handleTestSelection(test.id)}
                      className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor={test.id} className="flex-1 cursor-pointer">
                      <p className="font-semibold text-gray-800">{test.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {submitLoading ? 'Adding Question...' : 'Add Question'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Test;