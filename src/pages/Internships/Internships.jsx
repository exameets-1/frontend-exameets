import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchInternships, clearAllInternshipErrors } from "../../store/slices/internshipSlice";
import Spinner from "../../components/Spinner";
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

const normalizeText = (text) => {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
};

const Internships = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('internshipPageNumber');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const searchInputRef = useRef(null);
    const searchKeyword = useDebounce(searchInput, 500);

    const { 
        internships, 
        loading, 
        error,
        totalPages,
        totalInternships 
    } = useSelector((state) => state.internships);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const jobMatchesSearch = (internship) => {
        if (!searchKeyword) return true;
        
        const normalizedSearch = normalizeText(searchKeyword);
        
        // Check internship fields
        if (normalizeText(internship.internship_type).includes(normalizedSearch)) return true;
        if (normalizeText(internship.description).includes(normalizedSearch)) return true;
        if (internship.eligibility_criteria && normalizeText(internship.eligibility_criteria).includes(normalizedSearch)) return true;
        if (internship.organization && normalizeText(internship.organization).includes(normalizedSearch)) return true;
        if (internship.skills_required && internship.skills_required.some(skill => 
            normalizeText(skill).includes(normalizedSearch)
        )) return true;
        
        return false;
    };

    const filteredInternships = internships?.filter(jobMatchesSearch) || [];

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [filteredInternships]);

    useEffect(() => {
        if (searchKeyword !== "") {
            setCurrentPage(1);
            localStorage.setItem('internshipPageNumber', '1');
        }
    }, [searchKeyword]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAllInternshipErrors());
        }
        
        const savedPage = localStorage.getItem('internshipPageNumber');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
        dispatch(fetchInternships(searchKeyword, currentPage));
    }, [dispatch, error, searchKeyword, currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        localStorage.setItem('internshipPageNumber', newPage.toString());
    };

    const handleViewDetails = (internshipId) => {
        localStorage.setItem('internshipsScrollPosition', window.scrollY.toString());
        navigate(`/internship/get/${internshipId}`);
    };

    return (
        <div className="jobs-page">
            <div className="header-bottom">
                <h2>Internships</h2>
                <div className="search-filter-sort">
                    <div className="search-container">
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Search internships, skills, organizations..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="container">
                        {filteredInternships?.map((internship) => (
                            <div key={internship._id} className="card">
                                <h3  className="company">{internship.title}</h3>
                                <div className="organization">{internship.organization}</div>
                                <div className="location">Location: {internship.location}</div>
                                <div className="qualification">Qualification: {internship.qualification}</div>
                                <div className="start-date">
                                    Start Date: {new Date(internship.start_date).toLocaleDateString()}
                                </div>
                                <div className="location">Duration: {internship.duration}</div>
                                <div className="location">Field: {internship.field}</div>
                                <div className="card-footer">
                                    <span className="internship-label">{internship.stipend}</span>
                                    <a 
                                        href="#" 
                                        className="view-details"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleViewDetails(internship._id);
                                        }}
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <div className="page-info">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button 
                                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Internships;