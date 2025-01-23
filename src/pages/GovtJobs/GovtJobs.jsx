import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGovtJobs } from "../../store/slices/govtJobSlice";
import Spinner from "../../components/Spinner";
import "./GovtJobs.css";

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

const GovtJobs = () => {
    const [filters, setFilters] = useState({
        city: "All",
        job_type: "All"
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchKeyword, 500);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { govtJobs, loading, error, totalPages, currentPage: responsePage } = useSelector((state) => state.govtJobs);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        dispatch(fetchGovtJobs(filters.city, filters.job_type, searchKeyword, currentPage));
    }, [dispatch, filters.city, filters.job_type, searchKeyword, currentPage]);

    const handleViewDetails = (jobId) => {
        localStorage.setItem('govtJobsScrollPosition', window.scrollY.toString());
        navigate(`/govtjob/get/${jobId}`);
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="jobs-page">
            <div className="header-bottom">
                <h2>Government Jobs</h2>
                <div className="search-filter-sort">
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search Government Jobs here..."
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                        />
                    </div>
                    
                    <select 
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                    >
                        <option value="All">Filter by Location</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                    </select>

                    <select 
                        value={filters.job_type}
                        onChange={(e) => handleFilterChange('job_type', e.target.value)}
                    >
                        <option value="All">Sort by</option>
                        <option value="Full Time">Date posted: most recent first</option>
                        <option value="Part Time">Application deadline: Nearest First</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <Spinner />
                </div>
            ) : (
                <>
            <div className="container">
                        {govtJobs?.map((job) => (
                            <div key={job._id} className="card">
                                <h3>{job.role}</h3>
                                <div className="company">{job.organization}</div>
                        <div className="post">Post: {job.post}</div>
                                <div className="qualification">Qualification: {job.qualifications}</div>
                                <div className="start-date">
                                    Registration Start Date: {new Date(job.post_date).toLocaleDateString()}
                                </div>
                                <div className="end-date">
                                    Registration Close Date: {new Date(job.last_date).toLocaleDateString()}
                                </div>
                                <div className="card-footer">
                                    <span className="posts-available">{job.vacancy} posts</span>
                                    <a 
                                        href="#" 
                                        className="view-details"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleViewDetails(job._id);
                                        }}
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="pagination">
                                <button 
                                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                >
                                Previous
                                </button>
                            <div className="page-info">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button 
                                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GovtJobs;