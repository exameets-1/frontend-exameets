import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaExternalLinkAlt, FaEdit, FaLink } from 'react-icons/fa';
import { fetchSingleResult, resetResultDetails, updateResult } from '../../store/slices/resultSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';
import EditResultModal from '../../modals/EditModals/EditResultModal';

const ResultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { result, loading, error } = useSelector((state) => state.results);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Add update handler
    const handleUpdateResult = (updatedData) => {
        dispatch(updateResult(result._id, updatedData))
            .unwrap()
            .then(() => {
                toast.success('Result updated successfully');
                setIsEditModalOpen(false);
                dispatch(fetchSingleResult(id)); // Refresh data
            })
            .catch((error) => {
                toast.error(error || 'Failed to update result');
        });
    };

  useEffect(() => {
    if (id) dispatch(fetchSingleResult(id));
    return () => dispatch(resetResultDetails());
  }, [dispatch, id]);

  const handleBack = () => navigate('/results');

  const handleVisitResult = () => {
    window.open(result?.importantLinks?.resultLink, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (error) return <div className="max-w-6xl mx-auto p-6">Error: {error}</div>;
  if (!result) return <div className="max-w-6xl mx-auto p-6">No result found</div>;

  return (
    <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Results
        </button>
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FaEdit /> Edit Result
          </button>
        )}
      </div>

      <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-white text-center">{result.title}</h1>
        <p className="mt-2 text-white text-center">{result.organization}</p>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Post Name</h3>
          <p className="text-gray-700 dark:text-gray-300">{result.postName}</p>
        </div>
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Total Vacancies</h3>
          <p className="text-gray-700 dark:text-gray-300">{result.totalVacancies}</p>
        </div>
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Exam Type</h3>
          <p className="text-gray-700 dark:text-gray-300">{result.exam_type}</p>
        </div>
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Result Date</h3>
          <p className="text-gray-700 dark:text-gray-300">{result.resultDate}</p>
        </div>
      </div>

      {/* Important Dates */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-center">Event</th>
              <th className="px-4 py-2 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {result.importantDates?.map((date, index) => (
              <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-center">{date.event}</td>
                <td className="px-4 py-2 text-center">{date.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Cutoff Marks */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Cutoff Marks</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-center">Category</th>
              <th className="px-4 py-2 text-center">Marks</th>
            </tr>
          </thead>
          <tbody>
            {result.cutoffMarks?.map((cutoff, index) => (
              <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-center">{cutoff.category}</td>
                <td className="px-4 py-2 text-center">{cutoff.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Steps Sections */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Steps to Check Result</h3>
            <ul className="list-disc pl-5 space-y-2">
              {result.stepsToCheckResult?.map((step, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Next Steps</h3>
            <ul className="list-disc pl-5 space-y-2">
              {result.nextSteps?.map((step, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Required Documents</h2>
        <ul className="list-disc pl-5 space-y-2">
          {result.documentsRequired?.map((doc, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">{doc}</li>
          ))}
        </ul>
      </section>

      {/* SEO Section */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">SEO Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Slug</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.slug}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Search Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.searchDescription}</p>
          </div>
        </div>
      </section>

      {/* Important Links */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(result.importantLinks || {}).map(([key, value]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </h3>
              {value ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                >
                  <FaLink /> Open Link
                </a>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">N/A</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* View Result Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleVisitResult}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          disabled={!result?.importantLinks?.resultLink}
        >
          <FaExternalLinkAlt /> View Official Result
        </button>
      </div>

      {/* Edit Modal */}
      <EditResultModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateResult}
                resultData={result}
            />
    </div>
  );
};

export default ResultDetails;