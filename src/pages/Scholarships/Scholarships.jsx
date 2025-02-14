import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchScholarships, deleteScholarship, createScholarship } from '../../store/slices/scholarshipSlice';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddScholarshipModal from '../../components/AddScholarshipModal/AddScholarshipModal';
import Spinner from '../../components/Spinner/Spinner';

const Scholarships = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filters, setFilters] = useState({
        category: "All",
        amount: "All"
    });
    
    const { scholarships, loading, error } = useSelector((state) => state.scholarships);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchScholarships());
    }, [dispatch]);

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

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    const filteredScholarships = scholarships?.filter(scholarship => {
        const matchesSearch = scholarship.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                            scholarship.organization.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesCategory = filters.category === "All" || scholarship.category === filters.category;
        const matchesAmount = filters.amount === "All" || handleAmountFilter(scholarship.amount, filters.amount);
        
        return matchesSearch && matchesCategory && matchesAmount;
    });

    function handleAmountFilter(scholarshipAmount, filterValue) {
        const amount = parseInt(scholarshipAmount.replace(/[^0-9]/g, ''));
        switch(filterValue) {
            case "below50k": return amount < 50000;
            case "50kTo1L": return amount >= 50000 && amount <= 100000;
            case "above1L": return amount > 100000;
            default: return true;
        }
    }

    return (
        <div className="scholarships-page">
            <div className="header-bottom">
                <div className="header-left">
                    <h2>Scholarships</h2>
                    {isAuthenticated && user?.role === 'admin' && (
                        <button 
                            className="add-scholarship-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlus /> Add Scholarship
                        </button>
                    )}
                </div>
                <div className="search-filter-sort">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search scholarships..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                    >
                        <option value="All">Filter by Category</option>
                        <option value="Merit">Merit Based</option>
                        <option value="Need">Need Based</option>
                        <option value="Research">Research</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <select
                        value={filters.amount}
                        onChange={(e) => handleFilterChange("amount", e.target.value)}
                    >
                        <option value="All">Filter by Amount</option>
                        <option value="below50k">Below ₹50,000</option>
                        <option value="50kTo1L">₹50,000 - ₹1,00,000</option>
                        <option value="above1L">Above ₹1,00,000</option>
                    </select>
                </div>
            </div>

            <div className="container">
                {filteredScholarships?.map((scholarship) => (
                    <div key={scholarship._id} className="card">
                        <div className="card-header">
                            <h3>{scholarship.title}</h3>
                            {isAuthenticated && user?.role === 'admin' && (
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteScholarship(scholarship._id)}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <div className="organization">{scholarship.organization}</div>
                        <div className="category">Category: {scholarship.category}</div>
                        <div className="amount">Amount: {scholarship.amount}</div>
                        <div className="eligibility">Eligibility: {scholarship.eligibility}</div>
                        <div className="card-footer">
                            <div className="dates">
                                <span className="end-date">
                                    Last Date: {new Date(scholarship.last_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="actions">
                                <button 
                                    onClick={() => handleViewDetails(scholarship._id)}
                                    className="view-details"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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