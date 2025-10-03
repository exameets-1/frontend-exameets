import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Exameets
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your gateway to career opportunities and educational resources
          </p>
        </div>

        {/* User Greeting */}
        {isAuthenticated && user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Hello, {user.name || 'User'}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back to your dashboard. Explore the latest opportunities tailored for you.
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Jobs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Job Opportunities
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse through thousands of job listings from top companies across various industries.
            </p>
          </div>

          {/* Internships Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Internships
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find internship opportunities to gain valuable experience and kickstart your career.
            </p>
          </div>

          {/* Government Jobs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Government Jobs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with the latest government job notifications and exam schedules.
            </p>
          </div>

          {/* Scholarships Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🎖️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Scholarships
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover scholarship opportunities to fund your education and achieve your goals.
            </p>
          </div>

          {/* Admissions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Admissions
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get information about college admissions, entrance exams, and application deadlines.
            </p>
          </div>

          {/* Previous Papers Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Previous Papers
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access previous year question papers to prepare effectively for your exams.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;