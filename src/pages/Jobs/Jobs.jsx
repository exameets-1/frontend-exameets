import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs, deleteJob, createJob } from "../../store/slices/jobSlice";
import Spinner from "../../components/Spinner";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import AddJobModal from "../../components/AddJobModal/AddJobModal";

import "./Jobs.css";
//show delete button only if authenticated
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

const Jobs = () => {
    const {isAuthenticated,  user } = useSelector(
        (state) => state.user
    );
    const [filters, setFilters] = useState({
        city: "All",
        job_type: "All"
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchKeyword, 500);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs, loading: jobsLoading, error: jobsError, totalPages, currentPage: responsePage } = useSelector((state) => state.jobs);

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useEffect(() => {
        dispatch(fetchJobs(filters.city, filters.job_type, searchKeyword, currentPage));
    }, [dispatch, filters.city, filters.job_type, searchKeyword, currentPage]);

    const handleViewDetails = (jobId) => {
        localStorage.setItem("jobsScrollPosition", window.scrollY.toString());
        navigate(`/job/get/${jobId}`);
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            dispatch(deleteJob(jobId));
            toast.success("Job deleted successfully");
        }
    };

    const handleCreateJob = async (jobData) => {
        try {
            await dispatch(createJob(jobData));
            setIsModalOpen(false);
            toast.success("Job created successfully");
        } catch (error) {
            toast.error(error.message || "Failed to create job");
        }
    };

    return (
        <div className="jobs-page">
            <div className="header-bottom">
                <div className="header-left">
                    <h2>Jobs</h2>
                    {isAuthenticated && user?.role === 'admin' && (
                        <button
                            className="add-job-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus /> Add Job
                        </button>
                    )}
                </div>
                <div className="search-filter-sort">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search Jobs here..."
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                        />
                    </div>

                    <select
                        value={filters.city}
                        onChange={(e) => handleFilterChange("city", e.target.value)}
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
                        onChange={(e) => handleFilterChange("job_type", e.target.value)}
                    >
                        <option value="All">Sort by</option>
                        <option value="Full Time">Date posted: most recent first</option>
                        <option value="Part Time">Application deadline: Nearest First</option>
                    </select>
                </div>
            </div>

            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateJob}
            />

            {jobsLoading ? (
                <div className="loading-spinner">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="container">
                        {jobs?.map((job) => (
                            <div key={job._id} className="card">
                                <div className="card-header">
                                    <h3>{job.role}</h3>
                                    {isAuthenticated && user?.role === 'admin' && (
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="delete-btn"
                                            title="Delete Job"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <div className="company">{job.organization}</div>
                                <div className="post">Location: {job.location}</div>
                                <div className="post">Experience: {job.experience_required}</div>
                                <div className="qualification">Qualification: {job.qualifications}</div>
                                <div className="post">Salary: {job.salary_range}</div>
                                <div className="card-footer">
                                    <span className="posts-available">Posted-{new Date(job.post_date).toLocaleDateString()}</span>
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
                                className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <div className="page-info">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
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

export default Jobs;
