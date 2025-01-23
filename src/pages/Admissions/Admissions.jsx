import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdmissions } from '../../store/slices/admissionSlice';
import { useTheme } from '../../App';
import Spinner from '../../components/Spinner';
import './Admissions.css';

const Admissions = () => {
    const dispatch = useDispatch();
    const { darkMode } = useTheme();
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [page, setPage] = useState(1);

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
        totalPages,
        categories
    } = useSelector((state) => state.admissions);

    const searchKeyword = useDebounce(searchInput, 500);

    useEffect(() => {
        dispatch(fetchAdmissions(searchKeyword, selectedCategory, selectedStatus, page));
    }, [dispatch, searchKeyword, selectedCategory, selectedStatus, page]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        setPage(1);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setPage(1);
    };

    const handlePageChange = (value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="header-bottom">
                <h2>Admissions</h2>
                <div className="search-filter-sort">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search Entrance Exams here..."
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="category-container">
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">All Categories</option>
                            {categories?.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="status-container">
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Closing Soon">Closing Soon</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="container">
                {admissions?.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        No admissions found
                    </div>
                ) : (
                    admissions?.map((admission) => (
                        <div key={admission._id} className="card">
                            <h3>{admission.title}</h3>
                            <div className="course">Course: {admission.program}</div>
                            <div className="card-footer">
                                <span className="end-date">Last Date : {formatDate(admission.applicationDeadline)}</span>
                                <Link
                                    to={`/admission/get/${admission._id}`}
                                    className="view-details"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="pagination">
                <button 
                    className={`pagination-button ${page === 1 ? 'disabled' : ''}`}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="page-info">Page {page} of {totalPages || 1}</span>
                <button 
                    className={`pagination-button ${page === totalPages ? 'disabled' : ''}`}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Admissions;
