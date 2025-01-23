import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPreviousYears } from "../store/slices/previousSlice";
import Spinner from "../components/Spinner";
import { FaDownload, FaCalendarAlt, FaBuilding, FaChartBar, FaArrowLeft } from "react-icons/fa";

const PreviousYearDetails = () => {
    const { subject } = useParams();
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedOrg, setSelectedOrg] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    
    const { previousYears, loading, error } = useSelector((state) => state.previousYears);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPreviousYears("", 1, 1000));
    }, [dispatch]);

    const handleBack = () => {
        navigate('/previousyears');
    };

    // Filter papers for the current subject
    const subjectPapers = previousYears.filter(paper => 
        paper.subject.toLowerCase() === decodeURIComponent(subject).toLowerCase()
    );

    const uniqueYears = [...new Set(subjectPapers.map(paper => paper.year))].sort((a, b) => b - a);
    const uniqueOrgs = [...new Set(subjectPapers.map(paper => paper.organization))];

    const filteredPapers = subjectPapers.filter(paper => {
        const yearMatch = selectedYear === "all" || paper.year.toString() === selectedYear;
        const orgMatch = selectedOrg === "all" || paper.organization === selectedOrg;
        const searchMatch = !searchInput || 
            paper.organization?.toLowerCase().includes(searchInput.toLowerCase()) ||
            paper.year.toString().includes(searchInput);
        return yearMatch && orgMatch && searchMatch;
    });

    const handleDownload = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Top Section */}
            <div className="w-full bg-[#DFF1FF] py-10 px-5">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#015990] hover:text-[#014970] mb-4"
                    >
                        <FaArrowLeft />
                        Back to Subjects
                    </button>

                    <h1 className="text-[25px] font-semibold text-[#015990] mb-4">
                        {decodeURIComponent(subject)} Papers
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search papers..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="h-[45px] px-4 rounded-md border border-gray-300 focus:outline-none focus:border-[#015990]"
                        />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="h-[45px] px-4 rounded-md border border-gray-300 focus:outline-none focus:border-[#015990]"
                        >
                            <option value="all">All Years</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year.toString()}>{year}</option>
                            ))}
                        </select>
                        <select
                            value={selectedOrg}
                            onChange={(e) => setSelectedOrg(e.target.value)}
                            className="h-[45px] px-4 rounded-md border border-gray-300 focus:outline-none focus:border-[#015990]"
                        >
                            <option value="all">All Organizations</option>
                            {uniqueOrgs.map(org => (
                                <option key={org} value={org}>{org}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Papers Grid */}
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto">
                    {filteredPapers.map((paper) => (
                        <div
                            key={paper._id}
                            className="group h-[250px] bg-white border-2 border-[#015990] rounded-lg overflow-hidden shadow-md flex flex-col transition-transform duration-300 hover:scale-105"
                        >
                            {/* Content */}
                            <div className="flex-grow flex flex-col justify-center p-5 space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <FaCalendarAlt className="mr-2" />
                                    <span className="text-lg">{paper.year}</span>
                                </div>
                                {paper.organization && (
                                    <div className="flex items-center text-gray-600">
                                        <FaBuilding className="mr-2" />
                                        <span>{paper.organization}</span>
                                    </div>
                                )}
                                {paper.difficulty_level && (
                                    <div className="flex items-center text-gray-600">
                                        <FaChartBar className="mr-2" />
                                        <span>{paper.difficulty_level}</span>
                                    </div>
                                )}
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={() => handleDownload(paper.file_url)}
                                className="bg-[#015990] h-[50px] flex items-center justify-center text-white text-[20px] font-bold gap-2 hover:bg-[#014970] transition-colors"
                            >
                                <FaDownload />
                                Download
                            </button>
                        </div>
                    ))}
                </div>

                {filteredPapers.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No papers found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviousYearDetails;
