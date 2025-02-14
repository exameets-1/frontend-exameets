import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdmissions, deleteAdmission, createAdmission } from '../../store/slices/admissionSlice';
import AddAdmissionModal from '../../components/AddAdmissionModal/AddAdmissionModal';
import { useTheme } from '../../App';
import Spinner from '../../components/Spinner/Spinner';
import './Admissions.css';
import { toast } from 'react-toastify';
import {FaPlus,  FaTrash} from 'react-icons/fa'

const Admissions = () => {
    const dispatch = useDispatch();
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filters, setFilters] = useState({
        location: "All",
        category: "All",
        showActiveOnly: false
    });
    const [currentPage, setCurrentPage] = useState(1);

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
    
    const {
        admissions,
        loading,
        error,
        pagination,
        categories
    } = useSelector((state) => state.admissions);

    const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchAdmissions({
            searchKeyword: debouncedSearchKeyword,
            category: filters.category,
            location: filters.location,
            page: currentPage,
            showActiveOnly: filters.showActiveOnly
        }));
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
        setSearchKeyword(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1);
    };


    const handlePageChange = (value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="admission_page">
            <div className="header-bottom">
            <h1 className="text-[25px] font-semibold text-[#015990] mt-1 mb-4">
            Admissions</h1>
            {isAuthenticated && user?.role === 'admin' && (
                        <button 
                            className="add-admission-button ml-4"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus /> Add Admission
                        </button>
                    )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="h-[45px] px-0 rounded-md  focus:outline-none focus:border-[#015990]">
                        <input
                            type="text"
                            placeholder="Search Admissions here..."
                            value={searchKeyword}
                            onChange={handleSearch}
                            className="h-[45px] px-0 rounded-md  focus:outline-none focus:border-[#015990]"

                        />
                    </div>
                    <div className="h-[45px] px-0 rounded-md  focus:outline-none focus:border-[#015990]">
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="h-[45px] px-0 rounded-md  focus:outline-none focus:border-[#015990]"

                        >
                            <option value="">All Categories</option>
                            {categories?.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="h-[45px] px-0 rounded-md  focus:outline-none focus:border-[#015990]">
                        <select
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="h-[45px] px-0 rounded-md  focus:outline-none focus:border-[#015990]"

                        >
                            <option value="">All Locations</option>
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

            <div className="container justify-items-center  px-1 py-2 pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
                {admissions?.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        No admissions found
                    </div>
                ) : (
                    admissions?.map((admission) => (
                        <div key={admission._id} className="card w-[300px]">
                            <div className="h3 mb-2 border-none">{admission.title}
                            {isAuthenticated && user?.role === 'admin' && (
                                    <button
                                        className="delete-btn float-right"
                                        onClick={() => handleDeleteAdmission(admission._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                            <div className="course border-none">Course: {admission.institute}</div>
                            <div className="card-footer">
                                <span className="end-date">Last Date: {formatDate(admission.last_date)}</span>
                                <button
                                    onClick={() => handleViewDetails(admission._id)}
                                    className="view-details"
                                >
                                    Details
                                </button>
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

            <AddAdmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddAdmission}
            />
        </div>
    );
};

export default Admissions;
