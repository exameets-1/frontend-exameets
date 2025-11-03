import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTestCourse, clearCreateTestStatus } from '../../store/slices/testSlice.js';
import { toast } from 'react-toastify';

const AddTest = () => {
  const dispatch = useDispatch();
  const { 
    createTestStatus: {
      isLoading: createTestLoading,
      error: createTestError,
      success: createTestSuccess,
    }
  } = useSelector((state) => state.test);

  const [testCourseData, setTestCourseData] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    totalMarks: 100,
    isActive: false,
    questionsPerTest: 15,
    instructions: [''],
    testDate: ''
  });

  useEffect(() => {
    if (createTestSuccess) {
      toast.success('Test course created successfully!');
      setTestCourseData({
        title: '',
        description: '',
        durationMinutes: 30,
        totalMarks: 100,
        isActive: false,
        questionsPerTest: 15,
        instructions: [''],
        testDate: ''
      });
      setTimeout(() => {
        dispatch(clearCreateTestStatus());
      }, 3000);
    }
  }, [createTestSuccess, dispatch]);

  useEffect(() => {
    if (createTestError) {
      toast.error(`Error: ${createTestError}`);
    }
  }, [createTestError]);

  const handleTestCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...testCourseData.instructions];
    newInstructions[index] = value;
    setTestCourseData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = () => {
    setTestCourseData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    setTestCourseData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateTestCourse = (e) => {
    e.preventDefault();
    
    if (!testCourseData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!testCourseData.testDate) {
      toast.error('Test date is required');
      return;
    }

    // Filter out empty instructions
    const filteredInstructions = testCourseData.instructions.filter(instr => instr.trim());
    
    dispatch(createTestCourse({
      ...testCourseData,
      instructions: filteredInstructions,
      questions: [] // Always empty array as per requirement
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          Create New Test Course
        </h1>
        <p className="text-green-100 text-center mt-2">
          Set up a new test course
        </p>
      </div>

      <form onSubmit={handleCreateTestCourse} className="p-6 space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={testCourseData.title}
              onChange={handleTestCourseChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={testCourseData.description}
              onChange={handleTestCourseChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Duration (minutes) *
            </label>
            <input
              type="number"
              name="durationMinutes"
              value={testCourseData.durationMinutes}
              onChange={handleTestCourseChange}
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Total Marks *
            </label>
            <input
              type="number"
              name="totalMarks"
              value={testCourseData.totalMarks}
              onChange={handleTestCourseChange}
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Questions Per Test *
            </label>
            <input
              type="number"
              name="questionsPerTest"
              value={testCourseData.questionsPerTest}
              onChange={handleTestCourseChange}
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Test Date *
            </label>
            <input
              type="date"
              name="testDate"
              value={testCourseData.testDate}
              onChange={handleTestCourseChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Active
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={testCourseData.isActive}
                onChange={handleTestCourseChange}
                className="w-4 h-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                Enable this test course
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              Instructions
            </label>
            <button
              type="button"
              onClick={addInstruction}
              className="px-4 py-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
            >
              + Add Instruction
            </button>
          </div>
          
          {testCourseData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Instruction ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {testCourseData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 text-xl font-bold"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createTestLoading}
              className="px-8 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {createTestLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Test Course'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTest;