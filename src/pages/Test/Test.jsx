import { Link } from 'react-router-dom';
import AddQuestion from '../../components/AddQuestion/AddQuestion';
import AddTest from '../../components/AddTest/AddTest';
import { Users } from 'lucide-react';

export default function TestManagement() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Registration Button */}
        <Link
          to="/reg"
          className="absolute -top-2 right-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Users size={20} />
          <span>View Registrations</span>
        </Link>

        {/* Content */}
        <div className="space-y-8 pt-12">
          <AddQuestion />
          <AddTest />
        </div>
      </div>
    </div>
  );
}