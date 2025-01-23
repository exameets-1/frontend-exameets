import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdmitCards } from '../../store/slices/admitCardSlice';
import { useTheme } from '../../App';
import Spinner from '../../components/Spinner';
import './AdmitCard.css';

const AdmitCard = () => {
    const dispatch = useDispatch();
    const { darkMode } = useTheme();
    const [searchInput, setSearchInput] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('');
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
        admitCards,
        loading,
        error,
        totalPages,
    } = useSelector((state) => state.admitCards);

    const searchKeyword = useDebounce(searchInput, 500);

    useEffect(() => {
        dispatch(fetchAdmitCards(searchKeyword, selectedOrganization, selectedStatus, page));
    }, [dispatch, searchKeyword, selectedOrganization, selectedStatus, page]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        setPage(1);
    };

    const handleOrganizationChange = (e) => {
        setSelectedOrganization(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setPage(1);
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
                <h2>Admit Cards</h2>
                <div className="search-filter-sort">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search Admit Cards here..."
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="organization-container">
                        <select
                            value={selectedOrganization}
                            onChange={handleOrganizationChange}
                        >
                            <option value="">All Organizations</option>
                            <option value="UPSC">UPSC</option>
                            <option value="SSC">SSC</option>
                            <option value="IBPS">IBPS</option>
                            <option value="RRB">RRB</option>
                            <option value="State PSC">State PSC</option>
                        </select>
                    </div>
                    <div className="status-container">
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="container">
                {admitCards?.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        No admit cards found
                    </div>
                ) : (
                    admitCards?.map((card) => (
                        <div key={card._id} className="card">
                            <h3>{card.title}</h3>
                            <div className="organization">Organization: {card.organization}</div>
                            <div className="exam-date">
                                <strong>Exam Date:</strong> {formatDate(card.exam_date)}
                            </div>
                            <div className="registration-dates">
                                <div><strong>Registration Start:</strong> {formatDate(card.registration_start_date)}</div>
                                <div><strong>Registration End:</strong> {formatDate(card.registration_end_date)}</div>
                            </div>
                            <div className="card-footer">
                                <Link 
                                    to={`/admitcard/get/${card._id}`}
                                    className="view-details"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
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
            )}
        </div>
    );
};

export default AdmitCard;