import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPreviousYears, deleteYear, createPreviousYear } from "../../store/slices/previousSlice";

import { toast } from 'react-toastify';
import Spinner from "../../components/Spinner/Spinner";
import AddPreviousYearModal from "../../components/AddPreviousYearModal/AddPreviousYearModal";

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

const PreviousYear = () => {
    const [searchInput, setSearchInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchInputRef = useRef(null);
    const searchKeyword = useDebounce(searchInput, 500);
    const { previousYears, loading, error } = useSelector((state) => state.previousYears);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPreviousYears("", 1, 1000));
    }, [dispatch]);

    const handleCardClick = (subject) => {
        navigate(`/previous-year-details/${encodeURIComponent(subject)}`);
    };
    
    const handleAddPaper = async (paperData) => {
        try {
            const result = await dispatch(createPreviousYear(paperData)).unwrap();
            if (result.success) {
                toast.success('Paper added successfully');
                setIsModalOpen(false);
                dispatch(fetchPreviousYears("", 1, 1000));
            } else {
                toast.error(result.message || 'Failed to add paper');
            }
        } catch (error) {
            toast.error(error || 'Failed to add paper');
        }
    };

    const subjects = [...new Set(previousYears?.map(paper => paper.subject) || [])];
    const filteredSubjects = subjects.filter(subject => 
        !searchKeyword || subject.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-white">
            {/* Top Section */}
            <div className="w-full bg-[#DFF1FF] py-10 px-5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-[25px] font-semibold text-[#015990]">
                            Previous Year Question Papers
                        </h1>
                        {isAuthenticated && user?.role === 'admin' && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#015990] text-white px-4 py-2 rounded-md hover:bg-[#014970] transition-colors"
                            >
                                Add Paper
                            </button>
                        )}
                    </div>
                    <div className="flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search here..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            ref={searchInputRef}
                            className="w-full md:w-[600px] h-[45px] px-4 rounded-md border border-gray-300 focus:outline-none focus:border-[#015990]"
                        />
                        <button className="absolute right-0 h-[45px] w-[45px] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Box Container */}
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto">
                    {filteredSubjects.map((subject) => (
                        <div
                            key={subject}
                            className="group h-[200px] bg-white border-2 border-[#015990] rounded-lg overflow-hidden shadow-md flex flex-col transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handleCardClick(subject)}
                        >
                            {/* Content */}
                            <div className="flex-grow flex items-center justify-center p-5">
                                <h2 className="text-[23px] font-semibold text-center text-[#015990]">
                                    {subject}
                                </h2>
                            </div>

                            {/* Download Button */}
                            <div className="bg-[#015990] h-[50px] flex items-center justify-center text-white text-[20px] font-bold">
                                View Papers
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSubjects.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No subjects found matching your search.
                    </div>
                )}
            </div>

            <AddPreviousYearModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPaper}
            />
        </div>
    );
};

export default PreviousYear;