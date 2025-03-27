import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults, deleteResult, createResult } from '../../store/slices/resultSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import Spinner from '../../components/Spinner/Spinner';
import AddResultModal from '../../components/AddResultModal/AddResultModal';
import useDebouncedSearch from '../../hooks/useDebouncedSearch'; // Import the custom hook
import './Results.css';

const Results = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    searchKeyword, 
    setSearchKeyword, 
    debouncedSearchKeyword, 
    searchInputRef 
  } = useDebouncedSearch("", 500); // Use the custom hook

  const { results, loading, error, totalPages } = useSelector((state) => state.results);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Reset to the first page when searchKeyword or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchKeyword]);

  // Fetch results whenever debouncedSearchKeyword, filters, or currentPage changes
  useEffect(() => {
    dispatch(fetchResults({
      keyword: debouncedSearchKeyword,
      page: currentPage,
    })).then(() => {
      // Refocus the search bar after the search operation completes
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    });
  }, [dispatch, debouncedSearchKeyword, currentPage, searchInputRef]);

  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      const { payload } = await dispatch(deleteResult(resultId));
      if (!payload.error) {
        toast.success('Result deleted successfully');
      } else {
        toast.error(payload.error);
      }
    }
  };

  const handleAddResult = async (resultData) => {
    const { payload } = await dispatch(createResult(resultData));
    if (!payload.error) {
      toast.success('Result added successfully!');
      setIsModalOpen(false);
    } else {
      toast.error(payload.error);
    }
  };

  const handleViewDetails = (resultId) => {
    navigate(`/results/get/${resultId}`);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {isAuthenticated && user?.role === 'admin' && (
          <button 
            className="mb-6 bg-[#015990] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add Government Exam Result
          </button>
        )}

        <div className="bg-[#e6f4ff] p-6 rounded-lg mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#003366]">
              Government Exam Results
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search results..."
                value={searchKeyword}
                onChange={handleSearch}
                ref={searchInputRef} // Attach the ref from the custom hook
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results?.map((result) => (
            <div key={result._id} className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative">
              {isAuthenticated && user?.role === 'admin' && (
                <button 
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteResult(result._id)}
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
              <div className="text-sm text-gray-600 border-b border-gray-200 pb-2 mb-3">
                {result.organization}
              </div>
              {result.postName && (
                <div className="text-sm text-gray-600 mb-2">
                  Post: {result.postName}
                </div>
              )}
              <div className="text-sm text-gray-600 mb-2">
                Result Date: {result.resultDate}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="bg-[#015990] text-white text-xs px-3 py-1 rounded">
                  {result.totalVacancies} posts
                </span>
                <button
                  className="text-[#015990] font-medium hover:underline"
                  onClick={() => handleViewDetails(result._id)}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-8">
            <button
              className={`px-4 py-2 bg-[#015990] text-white rounded ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <button
              className={`px-4 py-2 bg-[#015990] text-white rounded ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AddResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddResult}
      />
    </div>
  );
};

export default Results;