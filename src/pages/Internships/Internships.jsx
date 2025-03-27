import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInternships, deleteInternship, createInternship } from "../../store/slices/internshipSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import AddInternshipModal from "../../components/AddInternshipModal/AddInternshipModal";
import useDebouncedSearch from "../../hooks/useDebouncedSearch"; // Import the custom hook

const Internships = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [filters, setFilters] = useState({
        city: "All",
        internship_type: "All",
        limit: 8
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { 
        searchKeyword, 
        setSearchKeyword, 
        debouncedSearchKeyword, 
        searchInputRef 
    } = useDebouncedSearch("", 500); // Use the custom hook

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, internships, error, pagination } = useSelector((state) => state.internships);
    const totalPages = pagination?.totalPages || 1;

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value); // Update the search keyword
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Reset to the first page when searchKeyword or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchKeyword, filters]);

    // Fetch internships whenever debouncedSearchKeyword, filters, or currentPage changes
    useEffect(() => {
        dispatch(fetchInternships({
            city: filters.city,
            internship_type: filters.internship_type,
            searchKeyword: debouncedSearchKeyword,
            page: currentPage,
            limit: filters.limit
        })).then(() => {
            // Refocus the search bar after the search operation completes
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        });
    }, [dispatch, filters.city, filters.internship_type, debouncedSearchKeyword, currentPage, filters.limit]);

    const handleInternshipClick = (internshipId) => {
        localStorage.setItem('internshipsScrollPosition', window.scrollY.toString());
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
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {isAuthenticated && user?.role === 'admin' && (
                    <button 
                        className="mb-6 bg-[#015990] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Internship
                    </button>
                )}

                <div className="bg-[#e6f4ff] p-6 rounded-lg mb-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-[#003366]">
                            Internships
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search internships..."
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                ref={searchInputRef} // Attach the ref from the custom hook
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <select
                                value={filters.internship_type}
                                onChange={(e) => handleFilterChange('internship_type', e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Types</option>
                                <option value="Remote">Remote</option>
                                <option value="On-Site">On-Site</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {internships?.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-600">
                            No internships found matching your criteria. Try adjusting your filters or search term.
                        </div>
                    ) : (
                        internships?.map((internship) => (
                            <div key={internship._id} className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative">
                                {isAuthenticated && user?.role === 'admin' && (
                                    <button 
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteInternship(internship._id)}
                                    >
                                        <FaTrash className="w-5 h-5" />
                                    </button>
                                )}
                                
                                <h3 className="text-xl font-semibold mb-2">{internship.title}</h3>
                                <div className="text-sm text-gray-600 border-b border-gray-200 pb-2 mb-3">
                                    {internship.organization}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Location: {internship.location}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Duration: {internship.duration}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Start Date: {internship.start_date}
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                    Last Date to Apply: {internship.last_date}
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="bg-[#015990] text-white text-xs px-3 py-1 rounded">
                                        Stipend: {internship.stipend}
                                    </span>
                                    <button
                                        className="text-[#015990] font-medium hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleInternshipClick(internship._id);
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
                            className={`px-4 py-2 bg-[#015990] text-white rounded ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#015990]'
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

            <AddInternshipModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateInternship}
            />
        </div>
    );
};

export default Internships;