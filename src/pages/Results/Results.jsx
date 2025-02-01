import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults, deleteResult, createResult } from '../../store/slices/resultSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaArrowRight, FaSearch, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import AddResultModal from '../../components/AddResultModal/AddResultModal';
import './Results.css';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};

const Results = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { results, loading, error, currentPage, totalPages } = useSelector((state) => state.results);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  // Apply debouncing to search
  const debouncedSearchTerm = useDebounce(searchKeyword, 500);

  // Auto-focus on search input
  useEffect(() => {
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once on mount

  // Fetch results when debounced search term changes
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchResults({ keyword: debouncedSearchTerm, page: currentPage }));
      // Maintain focus after search
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    fetchData();
  }, [dispatch, debouncedSearchTerm, currentPage]);

  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      const response = await dispatch(deleteResult(resultId));
      if (response.success) {
        toast.success('Result deleted successfully');
      } else {
        toast.error(response.error || 'Error deleting result');
      }
    }
  };

  const handleAddResult = async (resultData) => {
    const result = await dispatch(createResult(resultData));
    if (result.success) {
      toast.success('Result added successfully!');
      setIsModalOpen(false);
    } else {
      toast.error(result.error || 'Error adding result');
    }
  };

  const handleViewDetails = (resultId) => {
    navigate(`/results/get/${resultId}`);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    // Maintain focus while typing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(fetchResults({ keyword: debouncedSearchTerm, page: currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(fetchResults({ keyword: debouncedSearchTerm, page: currentPage + 1 }));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="results-page bg-[#DFF1FF] min-h-screen p-2">
      <div className="results-container">
        <div className="header-section bg-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-[#015990] text-center mb-6">
            Government Exams - Results
          </h1>
          <div className="search-container">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search Results here..." 
                value={searchKeyword}
                onChange={handleSearch}
                className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-[#C0E3FF] focus:outline-none focus:border-[#015990] transition-colors"
              />
            </div>
          </div>
          {isAuthenticated && user?.role === 'admin' && (
            <button 
              className="add-result-button mt-4 mx-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Add Result
            </button>
          )}
        </div>

        <div className="results-grid">
          {results && results.map((result) => (
            <div 
              key={result._id}
              className="result-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-[#015990] mb-4 line-clamp-2">
                {result.exam_title}
              </h3>
              <div className="card-footer flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 bg-[#C0E3FF] px-3 py-2 rounded-lg text-sm">
                  <FaCalendarAlt className="text-[#015990]" />
                  <span>{new Date(result.result_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="view-details-btn bg-[#015990] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#014970] transition-colors"
                    onClick={() => handleViewDetails(result._id)}
                  >
                    View Details
                  </button>
                  {isAuthenticated && user?.role === 'admin' && (
                    <button 
                      className="delete-button text-red-500 hover:text-red-700 p-2"
                      onClick={() => handleDeleteResult(result._id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {results && results.length > 0 && (
          <div className="pagination-container bg-white rounded-lg p-4 mt-6 flex justify-center items-center gap-6">
            <button 
              className="pagination-btn flex items-center gap-2 bg-[#015990] text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#014970] transition-colors"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <FaArrowLeft /> Prev
            </button>
            <span className="page-info text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn flex items-center gap-2 bg-[#015990] text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#014970] transition-colors"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next <FaArrowRight />
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