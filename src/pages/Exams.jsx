import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchExams, clearExamErrors } from "../store/slices/examSlice";
import Spinner from "../components/Spinner";
import { FaCalendarAlt, FaBuilding, FaMoneyBillWave, FaUserGraduate } from "react-icons/fa";

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
    return text?.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
};

const Exams = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem('examPageNumber');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const searchInputRef = useRef(null);
    const searchKeyword = useDebounce(searchInput, 500);

    const { 
        exams, 
        loading, 
        error,
        totalPages,
        totalExams 
    } = useSelector((state) => state.exams);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const examMatchesSearch = (exam) => {
        if (!searchKeyword) return true;
        
        const normalizedSearch = normalizeText(searchKeyword);
        
        if (normalizeText(exam.title).includes(normalizedSearch)) return true;
        if (exam.organization && normalizeText(exam.organization).includes(normalizedSearch)) return true;
        if (exam.description && normalizeText(exam.description).includes(normalizedSearch)) return true;
        
        return false;
    };

    const filteredExams = exams?.filter(examMatchesSearch) || [];

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [filteredExams]);

    useEffect(() => {
        if (searchKeyword !== "") {
            setCurrentPage(1);
            localStorage.setItem('examPageNumber', '1');
        }
    }, [searchKeyword]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearExamErrors());
        }
        
        const savedPage = localStorage.getItem('examPageNumber');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
        dispatch(fetchExams(searchKeyword, currentPage));
    }, [dispatch, error, searchKeyword, currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        localStorage.setItem('examPageNumber', newPage.toString());
    };

    const handleViewDetails = (examId) => {
        localStorage.setItem('examScrollPosition', window.scrollY.toString());
        navigate(`/exam/get/${examId}`);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-16">
            {/* Fixed Search Section */}
            <div className="fixed top-18 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-900 px-4 py-2">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search by exam name, organization..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}      
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 pt-28 max-w-7xl">
                <div className="grid grid-cols-12 gap-4">
                    {/* Main content */}
                    <div className="col-span-12">
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {filteredExams.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredExams.map((exam) => (
                                                <div
                                                    key={exam._id}
                                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
                                                >
                                                    <div className="p-6">
                                                        <div className="mb-4">
                                                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                                                                {exam.title}
                                                            </h3>
                                                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                                                                {exam.organization}
                                                            </p>
                                                        </div>

                                                        {/* Exam Details */}
                                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                                <FaCalendarAlt className="mr-2 text-blue-500" />
                                                                <span>Exam: {formatDate(exam.examDate)}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                                <FaMoneyBillWave className="mr-2 text-green-500" />
                                                                <span>Fee: ₹{exam.applicationFee.general}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                                <FaBuilding className="mr-2 text-orange-500" />
                                                                <span>{exam.organization}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                                <FaUserGraduate className="mr-2 text-purple-500" />
                                                                <span>Vacancies: {exam.vacancies}</span>
                                                            </div>
                                                        </div>

                                                        {/* View Details Button */}
                                                        <button
                                                            onClick={() => handleViewDetails(exam._id)}
                                                            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-lg ${
                                                    currentPage === 1
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white transition`}
                                            >
                                                Previous
                                            </button>
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Page {currentPage} of {totalPages} ({totalExams} total exams)
                                            </span>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-lg ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white transition`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                                        <p className="text-gray-600 dark:text-gray-300 text-lg">No exams found matching your criteria</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exams;
