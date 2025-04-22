import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdmissions, deleteAdmission, createAdmission } from '../../store/slices/admissionSlice';
import AddAdmissionModal from '../../modals/AddModals/AddAdmissionModal';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import useDebouncedSearch from '../../hooks/useDebouncedSearch'; // Import the custom hook

const Admissions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        location: "All",
        category: "All",
        showActiveOnly: false
    });
    const [currentPage, setCurrentPage] = useState(1);

    const {
        admissions,
        loading,
        error,
        pagination,
    } = useSelector((state) => state.admissions);

    const { 
        searchKeyword, 
        setSearchKeyword, 
        debouncedSearchKeyword, 
        searchInputRef 
    } = useDebouncedSearch("", 500); // Use the custom hook

    const { isAuthenticated, user } = useSelector((state) => state.user);

    // Reset to the first page when searchKeyword or filters change
    useEffect(() => {
        setCurrentPage(1); // Reset to the first page
    }, [debouncedSearchKeyword, filters]);

    // Fetch admissions whenever debouncedSearchKeyword, filters, or currentPage changes
    useEffect(() => {
        dispatch(fetchAdmissions({
            searchKeyword: debouncedSearchKeyword,
            category: filters.category,
            location: filters.location,
            page: currentPage,
            showActiveOnly: filters.showActiveOnly
        })).then(() => {
            // Refocus the search bar after the search operation completes
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        });
    }, [dispatch, debouncedSearchKeyword, filters.category, filters.location, filters.showActiveOnly, currentPage]);

    const handleDeleteAdmission = async (admissionId) => {
        if (window.confirm('Are you sure you want to delete this admission?')) {
            const response = await dispatch(deleteAdmission(admissionId));
            if (response.success) {
                toast.success('Admission deleted successfully');
            } else {
                toast.error(response.error || 'Error deleting admission');
            }
        }
    };

    const handleAddAdmission = async (admissionData) => {
        const result = await dispatch(createAdmission(admissionData));
        if (!result.error) {
            toast.success('Admission added successfully!');
            setIsModalOpen(false);
        } else {
            toast.error(result.error || 'Error adding admission');
        }
    };

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value); // Update the search keyword
        setCurrentPage(1); // Reset to the first page
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to the first page
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = (admissionId) => {
        navigate(`/admission/get/${admissionId}`);
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
                    <button 
                        className="mb-6 bg-[#015990] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus className="inline mr-2" />
                        Add Admission
                    </button>
                )}
    
                <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
                            Admissions
                        </h2>
                    </div>
    
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search admissions..."
                                value={searchKeyword}
                                onChange={handleSearch}
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
                                <option value="Engineering">Engineering</option>
                                <option value="Medical">Medical</option>
                                <option value="Arts">Arts</option>
                                <option value="Science">Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Management">Management</option>
                                <option value="Law">Law</option>
                                <option value="Design">Design</option>
                                <option value="Other">Other</option>
                            </select>
                            <select
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="All">All Locations</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Kolkata">Kolkata</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Pune">Pune</option>
                            </select>
                        </div>
                    </div>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {admissions?.length === 0 ? (
        <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
            No admissions found matching your criteria. Try adjusting your filters or search term.
        </div>
    ) : (
        admissions?.map((admission) => (
            <div 
                key={admission._id} 
                className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
            >
                {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
                    <button 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                        onClick={() => handleDeleteAdmission(admission._id)}
                    >
                        <FaTrash className="w-5 h-5" />
                    </button>
                )}

                {/* Title Section */}
                <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {admission.title}
                </h3>

                {/* Institute with Border */}
                <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                    {admission.institute}
                </div>

                {/* Content Section */}
                <div className="grid gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Location: {admission.location}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        Last Date: {formatDate(admission.last_date)}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                        {admission.category}
                    </span>
                    <button
                        className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
                        onClick={(e) => {
                            e.preventDefault();
                            handleViewDetails(admission._id);
                        }}
                    >
                        View Details →
                    </button>
                </div>
            </div>
        ))
    )}
</div>
    
                {pagination?.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 my-8">
                        <button
                            className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        
                        <div className="text-gray-600 dark:text-gray-300">
                            Page {currentPage} of {pagination.totalPages}
                        </div>
    
                        <button
                            className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                                currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
    
            <AddAdmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddAdmission}
            />
        </div>
    );
};

export default Admissions;