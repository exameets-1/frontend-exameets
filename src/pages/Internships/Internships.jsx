import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInternships, deleteInternship, createInternship } from "../../store/slices/internshipSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import AddInternshipModal from "../../components/AddInternshipModal/AddInternshipModal";

import "./Internships.css";

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

const Internships = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [filters, setFilters] = useState({
        city: "All",
        internship_type: "All"
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, internships, error, pagination } = useSelector((state) => state.internships);

    useEffect(() => {
        dispatch(fetchInternships(filters.city, filters.internship_type, debouncedSearchKeyword, currentPage));
    }, [dispatch, filters.city, filters.internship_type, debouncedSearchKeyword, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handleInternshipClick = (internshipId) => {
        navigate(`/internship/get/${internshipId}`);
    };

    const handleDeleteInternship = async (internshipId) => {
        if (window.confirm("Are you sure you want to delete this internship?")) {
            dispatch(deleteInternship(internshipId));
            toast.success("Internship deleted successfully");
        }
    };

    const handleCreateInternship = async (internshipData) => {
        try {
            await dispatch(createInternship(internshipData));
            setIsModalOpen(false);
            toast.success("Internship created successfully");
        } catch (error) {
            toast.error(error.message || "Failed to create internship");
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="jobs-page">
            <div className="header-bottom">
                <div className="header-left">
                    <h2>Internships</h2>
                    {isAuthenticated && user?.role === 'admin' && (
                        <button
                            className="add-job-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus /> Add Internship
                        </button>
                    )}
                </div>
            </div>

            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="city">City:</label>
                    <select
                        id="city"
                        name="city"
                        value={filters.city}
                        onChange={handleFilterChange}
                    >
                        <option value="All">All Cities</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Pune">Pune</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="internship_type">Type:</label>
                    <select
                        id="internship_type"
                        name="internship_type"
                        value={filters.internship_type}
                        onChange={handleFilterChange}
                    >
                        <option value="All">All Types</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Work from Home">Work from Home</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="search">Search:</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search internships..."
                        value={searchKeyword}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="container">
                        {internships?.length === 0 ? (
                            <div className="no-results">
                                No internships found matching your criteria. Try adjusting your filters or search term.
                            </div>
                        ) : (
                            internships?.map((internship) => (
                                <div key={internship._id} className="card">
                                    <div className="card-header">
                                        <h3>{internship.title}</h3>
                                        {isAuthenticated && user?.role === 'admin' && (
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteInternship(internship._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                    <div className="company">{internship.organization}</div>
                                    <div className="post">Location: {internship.location}</div>
                                    <div className="qualification">Duration: {internship.duration}</div>
                                    <div className="start-date">Start Date: {new Date(internship.start_date).toLocaleDateString()}</div>
                                    <div className="end-date">Last Date to Apply: {new Date(internship.last_date).toLocaleDateString()}</div>
                                    <div className="card-footer">
                                        <span className="posts-available">Stipend: {internship.stipend}</span>
                                        <a
                                            href="#"
                                            className="view-details"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleInternshipClick(internship._id);
                                            }}
                                        >
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className={`pagination-button ${!pagination.hasPrevPage ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(pagination.prevPage)}
                                disabled={!pagination.hasPrevPage}
                            >
                                Previous
                            </button>

                            <div className="page-numbers">
                                {pagination.currentPage > 2 && (
                                    <>
                                        <button onClick={() => handlePageChange(1)}>1</button>
                                        {pagination.currentPage > 3 && <span>...</span>}
                                    </>
                                )}

                                {pagination.currentPage > 1 && (
                                    <button onClick={() => handlePageChange(pagination.currentPage - 1)}>
                                        {pagination.currentPage - 1}
                                    </button>
                                )}

                                <button className="active">{pagination.currentPage}</button>

                                {pagination.currentPage < pagination.totalPages && (
                                    <button onClick={() => handlePageChange(pagination.currentPage + 1)}>
                                        {pagination.currentPage + 1}
                                    </button>
                                )}

                                {pagination.currentPage < pagination.totalPages - 1 && (
                                    <>
                                        {pagination.currentPage < pagination.totalPages - 2 && <span>...</span>}
                                        <button onClick={() => handlePageChange(pagination.totalPages)}>
                                            {pagination.totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                className={`pagination-button ${!pagination.hasNextPage ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(pagination.nextPage)}
                                disabled={!pagination.hasNextPage}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            <AddInternshipModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateInternship}
            />
        </div>
    );
};

export default Internships;