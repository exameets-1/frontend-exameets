import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../../store/slices/resultSlice';
import Spinner from '../../components/Spinner';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Results.css';

const Results = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const { results, loading, error, currentPage, totalPages } = useSelector((state) => state.results);

  useEffect(() => {
    dispatch(fetchResults(searchKeyword, currentPage));
  }, [dispatch, searchKeyword, currentPage]);

  const handleViewDetails = (resultId) => {
    navigate(`/results/${resultId}`);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(fetchResults(searchKeyword, currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(fetchResults(searchKeyword, currentPage + 1));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="results-page">
      <div className="header-bottom">
        <h2>Government Exams - Results</h2>
        <div className="search-filter-sort">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search Results here..." 
              value={searchKeyword}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {results && results.map((result) => (
          <div className="card" key={result._id}>
            <h3>{result.exam_title}</h3>
            <div className="card-footer">
              <span className="end-date">Result Date: {new Date(result.result_date).toLocaleDateString()}</span>
              <button 
                className="view-details" 
                onClick={() => handleViewDetails(result._id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft /> Prev
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Results;