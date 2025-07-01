import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSubjects, createPreviousYear, clearErrors, createAiPreviousYear } from "../../store/slices/previousSlice";
import { toast } from 'react-toastify';
import Spinner from "../../components/Spinner/Spinner";
import AddPreviousYearModal from "../../modals/AddModals/AddPreviousYearModal";
import AddAiPreviousYear from "../../modals/AiModals/AddAiPreviousYear";
import useDebouncedSearch from "../../hooks/useDebouncedSearch"; // Import the custom hook

const PreviousYear = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const searchInputRef = useRef(null);

    const { 
        searchKeyword, 
        setSearchKeyword, 
        debouncedSearchKeyword 
    } = useDebouncedSearch("", 500); // Use the custom hook for debouncing

    const { 
        subjects,
        loading, 
        error,
        message 
    } = useSelector((state) => state.previousYears);
    
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchSubjects());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (message) {
            toast.success(message);
        }
    }, [error, message, dispatch]);

    const handleCardClick = (subject) => {
        navigate(`/papers/${encodeURIComponent(subject)}`);
    };

    const handleAddPaper = async (paperData) => {
        try {
            const result = await dispatch(createPreviousYear(paperData)).unwrap();
            if (result.success) {
                toast.success('Paper added successfully');
                setIsModalOpen(false);
                dispatch(fetchSubjects()); // Refresh subjects list
            }
        } catch (error) {
            toast.error(error || 'Failed to add paper');
        }
    };

        const handleAddAiPreviousYear = async (jobData) => {
            const result = await dispatch(createAiPreviousYear(jobData));
            if(!result.error) {
                setIsAiModalOpen(false);
                toast.success("AI Job created successfully");
            }
            else {
                toast.error(result.error.message || "Failed to create AI job");
            }
        }

    const filteredSubjects = subjects.filter(subject => 
        subject.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
    );

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Top Section */}
            <div className="w-full bg-[#DFF1FF] dark:bg-gray-800 py-10 px-5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-[25px] font-semibold text-[#015990] dark:text-white">
                            Previous Year Question Papers
                        </h1>
                        {isAuthenticated && user?.role === 'admin' && (
                            <><button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#015990] dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-[#014970] dark:hover:bg-blue-700 transition-colors"
                            >
                                Add Paper
                            </button>
                            <button
                                onClick={() => setIsAiModalOpen(true)}
                                className="bg-[#015990] dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-[#014970] dark:hover:bg-blue-700 transition-colors"
                            >
                                Add AI Paper
                            </button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            ref={searchInputRef}
                            className="w-full md:w-[600px] h-[45px] px-4 rounded-md border border-gray-300 focus:outline-none focus:border-[#015990] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                        <button className="absolute right-0 h-[45px] w-[45px] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Subject Cards Container */}
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredSubjects.map((subject) => (
                        <div
                            key={subject}
                            className="group h-[200px] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg overflow-hidden shadow-md flex flex-col transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handleCardClick(subject)}
                        >
                            <div className="flex-grow flex items-center justify-center p-5">
                                <h2 className="text-[23px] font-semibold text-center text-[#015990] dark:text-white">
                                    {subject}
                                </h2>
                            </div>
                            <div className="bg-[#015990] dark:bg-gray-950 h-[50px] flex items-center justify-center text-white text-[20px] font-bold">
                                View Papers
                            </div>
                        </div>
                    ))}
                </div>
    
                {filteredSubjects.length === 0 && !loading && (
                    <div className="text-center text-gray-500 dark:text-gray-300 mt-8">
                        No subjects found {searchKeyword ? "matching your search" : "available"}
                    </div>
                )}
            </div>
    
            <AddPreviousYearModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPaper}
            />
            <AddAiPreviousYear
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onSubmit={handleAddAiPreviousYear}
            />
        </div>
    );
};

export default PreviousYear;