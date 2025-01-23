import  { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleQuiz } from '../store/slices/quizSlice';
import { FaBookOpen, FaClock, FaQuestionCircle } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { singleQuiz: quiz, loading, error } = useSelector((state) => state.quiz);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    dispatch(fetchSingleQuiz(id));
  }, [dispatch, id]);

  const handleStartQuiz = () => {
    if (!user?._id) {
      toast.error("Please login to take quizzes");
      navigate('/login');
      return;
    }
    navigate(`/quiz/${id}/start`);
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Quiz Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <FaBookOpen className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {quiz.title}
                  </h1>
                  <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                    {quiz.niche}
                  </span>
                </div>
              </div>
            </div>

            {/* Quiz Info */}
            <div className="space-y-6 mb-8">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {quiz.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <FaQuestionCircle className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {quiz.questions?.length || 0} Questions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <FaClock className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Time</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {quiz.questions?.length * 1.5 || 0} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <FaBookOpen className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {quiz.niche}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                  onClick={handleStartQuiz}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-colors duration-200"
              >
                Start Quiz
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-4 rounded-xl font-medium transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;