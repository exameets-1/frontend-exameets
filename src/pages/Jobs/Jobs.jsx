import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs, deleteJob, createJob, createAiJob } from "../../store/slices/jobSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import AddJobModal from "../../modals/AddModals//AddJobModal";
import AddAiJob from "../../modals/AiModals/AddAiJob";
import useDebouncedSearch from "../../hooks/useDebouncedSearch"; // Import the custom hook

const Jobs = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [filters, setFilters] = useState({
        city: "All",
        positionType: "All",
        limit: 8
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const { 
        searchKeyword, 
        setSearchKeyword, 
        debouncedSearchKeyword, 
        searchInputRef 
    } = useDebouncedSearch("", 500); // Use the custom hook

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs, loading, totalPages } = useSelector((state) => state.jobs);

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

    // Fetch jobs whenever debouncedSearchKeyword, filters, or currentPage changes
    useEffect(() => {
        dispatch(fetchJobs({
            city: filters.city,
            positionType: filters.positionType,
            search: debouncedSearchKeyword,
            page: currentPage,
            limit: filters.limit
        })).then(() => {
            // Refocus the search bar after the search operation completes
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        });
    }, [dispatch, filters.city, filters.positionType, debouncedSearchKeyword, currentPage, filters.limit, searchInputRef]);

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

    // const handleAddAiJob = async (jobData) => {
    //     const result = await dispatch(createAiJob(jobData));
    //     if(!result.error) {
    //         setIsAiModalOpen(false);
    //         toast.success("AI Job created successfully");
    //     }
    //     else {
    //         toast.error(result.error.message || "Failed to create AI job");
    //     }
    // }

    // In your main GovtJobs component, replace the handleAddAiJob function with this:

    const handleAddAiJob = async (jobData) => {
        try {
            const result = await dispatch(createAiJob(jobData));
            
            // Check if the operation was successful
            if (result.payload && !result.error) {
                toast.success("AI Job added successfully!");
                setIsAiModalOpen(false); // Only close on success
            } else {
                // Handle the error case
                const errorMessage = result.error?.message || result.payload?.message || "Error adding AI job";
                toast.error(errorMessage);
                // Don't close the modal on error
            }
        } catch (error) {
            toast.error(error.message || "Error adding AI job");
            // Don't close the modal on error
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
                   <> 
                   <button 
                        className="mb-6 bg-[#015990] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Job
                    </button>
                         <button 
                        className="mb-6 bg-[#015990] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                        onClick={() => setIsAiModalOpen(true)}
                    >
                        Add AI Job
                    </button>
                    </>
                )}

                <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
                            Jobs
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                ref={searchInputRef}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                                            <option value="All">All Cities</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                            </select>
                            <select
                                value={filters.positionType}
                                onChange={(e) => handleFilterChange('positionType', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                                            <option value="All">All Positions</option>
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {jobs?.length === 0 ? (
    <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
      No jobs found matching your criteria. Try adjusting your filters or search term.
    </div>
  ) : (
    jobs?.map((job) => (
      <div 
        key={job._id} 
        className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
      >
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
          <button 
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
            onClick={() => handleDeleteJob(job._id)}
          >
            <FaTrash className="w-5 h-5" />
          </button>
        )}
        {/* Title Section */}
        <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
          {job.jobTitle}
        </h3>
        {/* Company with Border */}
        <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
          {job.companyName}
        </div>
        {/* Content Section */}
        <div className="grid gap-2 mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Location: {job.city}, {job.state}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Experience: {job.experience}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Education: {job.education.join(", ")}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Position: {job.positionType}
          </div>
        </div>
        {/* Footer Section */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
          <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
            {new Date(job.applicationDeadline).toLocaleDateString()}
          </span>
          <button
            className="text-[#015990] dark:text-blue-400 font-bold hover:underline"
            onClick={(e) => {
              e.preventDefault();
              handleViewDetails(job._id);
            }}
          >
            View Details →
          </button>
        </div>
      </div>
    ))
  )}
</div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 my-8">
                        <button
                            className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        
                        <div className="text-gray-600 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </div>

                        <button
                            className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
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

            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateJob}
            />
            <AddAiJob
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onSubmit={handleAddAiJob}
            />
        </div>
    );
};

export default Jobs;