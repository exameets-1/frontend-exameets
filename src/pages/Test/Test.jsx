import AddQuestion from '../../components/AddQuestion/AddQuestion';
import AddTest from '../../components/AddTest/AddTest';

export default function TestManagement() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <AddQuestion />
        <AddTest />
      </div>
    </div>
  );
};