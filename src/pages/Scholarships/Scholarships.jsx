import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchScholarships, deleteScholarship, createScholarship } from '../../store/slices/scholarshipSlice';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddScholarshipModal from '../../modals/AddModals/AddScholarshipModal';
import Spinner from '../../components/Spinner/Spinner';
import useDebouncedSearch from '../../hooks/useDebouncedSearch';

const Scholarships = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        category: "All",
        qualification: "All"
    });

    const { scholarships, loading, error, totalPages } = useSelector((state) => state.scholarships);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const { 
        searchKeyword, 
        setSearchKeyword,
        debouncedSearchKeyword,
        searchInputRef 
    } = useDebouncedSearch("", 500);

    // Reset to the first page when searchKeyword or filters change
    useEffect(() => {
        setCurrentPage(1); // Reset to the first page
    }, [debouncedSearchKeyword, filters]);

    // Fetch scholarships whenever debouncedSearchKeyword, currentPage, or filters change
    useEffect(() => {
        dispatch(fetchScholarships({ 
            searchKeyword: debouncedSearchKeyword, 
            page: currentPage,
            filters
        })).then(() => {
            // Refocus the search bar after the search operation completes
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        });
    }, [dispatch, debouncedSearchKeyword, currentPage, filters, searchInputRef]);

    const handleDeleteScholarship = async (scholarshipId) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            const response = await dispatch(deleteScholarship(scholarshipId));
            if (response.success) {
                toast.success('Scholarship deleted successfully');
            } else {
                toast.error(response.error || 'Error deleting scholarship');
            }
        }
    };

    const handleAddScholarship = async (scholarshipData) => {
        const result = await dispatch(createScholarship(scholarshipData));
        if (!result.error) {
            toast.success('Scholarship added successfully!');
            setIsModalOpen(false);
        } else {
            toast.error(result.error || 'Error adding scholarship');
        }
    };

    const handleViewDetails = (scholarshipId) => {
        navigate(`/scholarship/get/${scholarshipId}`);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {isAuthenticated && user?.role === 'admin' && (
                    <button 
                        className="mb-6 bg-[#015990] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus className="inline mr-2" />
                        Add Scholarship
                    </button>
                )}
    
                <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
                            Scholarships
                        </h2>
                    </div>
    
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search scholarships..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="All">All Categories</option>
                                <option value="Merit-based">Merit Based</option>
                                <option value="Need-based">Need Based</option>
                                <option value="Research">Research</option>
                                <option value="Sports">Sports</option>
                                <option value="Cultural">Cultural</option>
                                <option value="International">International</option>
                                <option value="Government">Government</option>
                                <option value="Private">Private</option>
                                <option value="Other">Other</option>
                            </select>
                            <select
                                value={filters.qualification}
                                onChange={(e) => handleFilterChange('qualification', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="All">All Qualifications</option>
                                <option value="Class 8">Class 8</option>
                                <option value="Class 9">Class 9</option>
                                <option value="Class 10">Class 10</option>
                                <option value="Class 11">Class 11</option>
                                <option value="Class 12">Class 12</option>
                                <option value="Graduation">Graduation</option>
                                <option value="Post Graduation">Post Graduation</option>
                                <option value="Post Graduation Diploma">Post Graduation Diploma</option>
                                <option value="Phd">Phd</option>
                                <option value="ITI">ITI</option>
                                <option value="Polytechnic/Diploma">Polytechnic/Diploma</option>
                                <option value="Post Doctoral">Post Doctoral</option>
                                <option value="Vocational Course">Vocational Course</option>
                                <option value="Coaching classes">Coaching classes</option>
                            </select>
                        </div>
                    </div>
                </div>
    
                {/* Scholarships Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {scholarships?.length === 0 ? (
    <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
      No scholarships found matching your criteria. Try adjusting your filters or search term.
    </div>
  ) : (
    scholarships?.map((scholarship) => (
      <div 
        key={scholarship._id} 
        className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
      >
        {isAuthenticated && user?.role === 'admin' && (
          <button 
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
            onClick={() => handleDeleteScholarship(scholarship._id)}
          >
            <FaTrash className="w-5 h-5" />
          </button>
        )}
        {/* Title Section */}
        <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
          {scholarship.title}
        </h3>
        {/* Organization with Border */}
        <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
          {scholarship.organization}
        </div>
        {/* Content Section */}
        <div className="grid gap-2 mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Category: {scholarship.category}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Qualification: {scholarship.qualification}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Last Date: {scholarship.last_date}
          </div>
        </div>
        {/* Footer Section */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
          <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
            Scholarship
          </span>
          <button
            className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
            onClick={(e) => {
              e.preventDefault();
              handleViewDetails(scholarship._id);
            }}
          >
            View Details →
          </button>
        </div>
      </div>
    ))
  )}
</div>
    
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 my-8">
                        <button
                            className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
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
                                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                            }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
    
            <AddScholarshipModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddScholarship}
            />
        </div>
    );
};

export default Scholarships;