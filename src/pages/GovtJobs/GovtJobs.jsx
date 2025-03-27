import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGovtJobs, deleteGovtJob, createGovtJob } from "../../store/slices/govtJobSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import AddGovtJobModal from "../../components/AddGovtJobModal/AddGovtJobModal";
import useDebouncedSearch from "../../hooks/useDebouncedSearch"; // Import the custom hook

const GovtJobs = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [filters, setFilters] = useState({
        location: "All",
        sort: "All",
        limit: 8
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { 
        searchKeyword, 
        setSearchKeyword, 
        debouncedSearchKeyword, 
        searchInputRef 
    } = useDebouncedSearch("", 500); // Use the custom hook

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { govtJobs, loading, error, totalPages } = useSelector((state) => state.govtJobs);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Reset to the first page when searchKeyword or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchKeyword, filters]);

    // Fetch government jobs whenever debouncedSearchKeyword, filters, or currentPage changes
    useEffect(() => {
        dispatch(fetchGovtJobs({
            location: filters.location,
            sort: filters.sort,
            searchKeyword: debouncedSearchKeyword,
            page: currentPage,
            limit: filters.limit
        })).then(() => {
            // Refocus the search bar after the search operation completes
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        });
    }, [dispatch, filters.location, filters.sort, debouncedSearchKeyword, currentPage, filters.limit, searchInputRef]);

    const handleViewDetails = (jobId) => {
        localStorage.setItem("govtJobsScrollPosition", window.scrollY.toString());
        navigate(`/govtjob/get/${jobId}`);
    };

    const handleDeleteJob = (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            dispatch(deleteGovtJob(jobId));
            toast.success("Job deleted successfully");
        }
    };

    const handleAddJob = async (jobData) => {
        const result = await dispatch(createGovtJob(jobData));
        if (result.success) {
            toast.success("Government Job added successfully!");
            setIsModalOpen(false);
        } else {
            toast.error(result.error || "Error adding government job");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {isAuthenticated && user?.role === "admin" && (
                    <button 
                        className="mb-6 bg-[#015990] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Government Job
                    </button>
                )}

                <div className="bg-[#e6f4ff] p-6 rounded-lg mb-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-[#003366]">
                            Government Jobs
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                ref={searchInputRef} // Attach the ref from the custom hook
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filters.location}
                                onChange={(e) => handleFilterChange("location", e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Cities</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Pune">Pune</option>
                                <option value="Ahmedabad">Ahmedabad</option>
                                <option value="Kolkata">Kolkata</option>
                            </select>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange("sort", e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">Sort by</option>
                                <option value="recent">Recent First</option>
                                <option value="deadline">Nearest Deadline</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {govtJobs?.map((job) => (
                        <div key={job._id} className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative">
                            {isAuthenticated && user?.role === "admin" && (
                                <button 
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteJob(job._id)}
                                >
                                    <FaTrash className="w-5 h-5" />
                                </button>
                            )}
                            
                            <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
                            <div className="text-sm text-gray-600 border-b border-gray-200 pb-2 mb-3">
                                {job.organization}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Post: {job.postNames}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Qualification: {job.educationalQualifications}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Start: {job.applicationStartDate}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                Close: {job.applicationEndDate}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <span className="bg-[#015990] text-white text-xs px-3 py-1 rounded">
                                    {job.totalVacancies} posts
                                </span>
                                <button
                                    className="text-[#015990] font-medium hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewDetails(job._id);
                                    }}
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
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#015990]"
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
                                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <AddGovtJobModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddJob}
            />
        </div>
    );
};

export default GovtJobs;