import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdCalendarToday, MdAttachMoney, MdLocationOn, MdPerson, MdDescription, MdSchool } from "react-icons/md";
import { fetchSingleExam } from "../store/slices/examSlice";
import Spinner from "./Spinner";
import { FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";

const ExamDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { exam, loading, error } = useSelector((state) => state.exams);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleExam(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    return () => {
      const savedScrollPosition = localStorage.getItem('examScrollPosition');
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          localStorage.removeItem('examScrollPosition');
        }, 0);
      }
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        An error occurred: {error}
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-10 text-gray-500">
        No exam details found
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Exams
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {exam.title}
            </h1>
            <p className="text-blue-600 dark:text-blue-400 text-lg">
              {exam.organization}
            </p>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <MdCalendarToday className="text-blue-500 text-xl mt-1" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Exam Date</p>
                  <p className="text-gray-600 dark:text-gray-400">{formatDate(exam.examDate)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MdAttachMoney className="text-green-500 text-xl mt-1" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Application Fee</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    General: ₹{exam.applicationFee.general}<br />
                    Reserved: ₹{exam.applicationFee.reserved}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MdPerson className="text-orange-500 text-xl mt-1" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Age Limit</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {exam.ageLimit.min} - {exam.ageLimit.max} years
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MdSchool className="text-purple-500 text-xl mt-1" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Total Vacancies</p>
                  <p className="text-gray-600 dark:text-gray-400">{exam.vacancies}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MdCalendarToday className="text-red-500 text-xl mt-1" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Registration Period</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatDate(exam.registrationStartDate)} - {formatDate(exam.registrationEndDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <MdDescription className="mr-2" />
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {exam.description}
              </p>
            </div>

            {/* Eligibility Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Eligibility
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {exam.eligibility}
              </p>
            </div>

            {/* Exam Pattern Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Exam Pattern
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {exam.examPattern}
              </p>
            </div>

            {/* Syllabus Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Syllabus
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {exam.syllabus}
              </p>
            </div>

            {/* Important Links */}
            <div className="space-y-4">
              <a
                href={exam.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full sm:w-auto text-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center space-x-2"
              >
                <span>Apply Now</span>
                <FaExternalLinkAlt />
              </a>

              <a
                href={exam.notificationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full sm:w-auto text-center bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center space-x-2"
              >
                <span>Official Notification</span>
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
