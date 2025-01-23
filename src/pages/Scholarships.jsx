import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchScholarships, clearAllScholarshipErrors } from "../store/slices/scholarshipSlice";
import Spinner from "../components/Spinner";
import "./Scholarships.css";

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

const Scholarships = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('scholarshipPageNumber');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const searchInputRef = useRef(null);
    const searchKeyword = useDebounce(searchInput, 500);

    const { 
        scholarships, 
        loading, 
        error,
        totalPages,
        totalScholarships 
    } = useSelector((state) => state.scholarships);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (searchKeyword !== "") {
            setCurrentPage(1);
            localStorage.setItem('scholarshipPageNumber', '1');
        }
    }, [searchKeyword]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAllScholarshipErrors());
        }
        
        dispatch(fetchScholarships(searchKeyword, currentPage));
    }, [dispatch, error, searchKeyword, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        localStorage.setItem('scholarshipPageNumber', newPage.toString());
    };

    if (loading) return <Spinner />;

    return (
        <div className="scholarships-page">
            <div className="header-bottom">
                <h2>Scholarships</h2>
                <div className="search-container">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search Scholarships here..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className="container">
                    {scholarships?.length > 0 ? (
                        scholarships.map((scholarship) => (
                            <div key={scholarship._id} className="card">
                                <h3>{scholarship.title}</h3>
                                <div className="company">{scholarship.organization}</div>
                                <div className="post">Academic Year: {scholarship.academicYear}</div>
                                <div className="qualification">Qualification: {scholarship.qualification}</div>
                                <div className="start-date">Registration Start Date: {scholarship.registrationStartDate}</div>
                                <div className="end-date">Registration Close Date: {scholarship.registrationCloseDate}</div>
                                <div className="post">Caste: {scholarship.caste}</div>
                                <div className="post">Financial Status: {scholarship.financialStatus}</div>
                                <div className="card-footer">
                                    <span className="posts-available">{scholarship.amount}</span>
                                    <a href={`/scholarship/get/${scholarship._id}`} className="view-details">Apply Link</a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-scholarships">
                            <h3>No scholarships found</h3>
                        </div>
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Scholarships;
