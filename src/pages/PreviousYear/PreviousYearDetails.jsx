import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPreviousYears, deleteYear, updateYear } from "../../store/slices/previousSlice";
import Spinner from "../../components/Spinner/Spinner";
import { 
    FaDownload, 
    FaCalendarAlt, 
    FaBuilding, 
    FaChartBar, 
    FaArrowLeft, 
    FaTrash, 
    FaEdit,
    FaSave,
    FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";


const PreviousYearDetails = () => {
    const { subject } = useParams();
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedOrg, setSelectedOrg] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    
    const { previousYears, loading, error } = useSelector((state) => state.previousYears);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPreviousYears("", 1, 1000));
    }, [dispatch]);

    const handleBack = () => {
        navigate('/previousyears');
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this paper?')) {
            dispatch(deleteYear(id));
            toast.success('Paper deleted successfully');
        }
    };

    const handleEdit = (paper, e) => {
        e.stopPropagation();
        setEditingId(paper._id);
        setEditData({
            year: paper.year,
            organization: paper.organization,
            difficulty_level: paper.difficulty_level,
            file_url: paper.file_url
        });
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setEditingId(null);
        setEditData(null);
    };

    const handleSave = async (id, e) => {
        e.stopPropagation();
        try {
            await dispatch(updateYear(id, editData));
            setEditingId(null);
            setEditData(null);
            toast.success('Paper updated successfully');
        } catch (error) {
            toast.error('Failed to update paper');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) : value
        }));
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
                                    {editingId === paper._id ? (
                                        <input
                                            type="number"
                                            name="year"
                                            value={editData.year}
                                            onChange={handleInputChange}
                                            className="w-full px-2 py-1 border rounded focus:outline-none focus:border-[#015990]"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    ) : (
                                        <span className="text-lg">{paper.year}</span>
                                    )}
                                </div>
                                {(paper.organization || editingId === paper._id) && (
                                    <div className="flex items-center text-gray-600">
                                        <FaBuilding className="mr-2" />
                                        {editingId === paper._id ? (
                                            <input
                                                type="text"
                                                name="organization"
                                                value={editData.organization}
                                                onChange={handleInputChange}
                                                className="w-full px-2 py-1 border rounded focus:outline-none focus:border-[#015990]"
                                            />
                                        ) : (
                                            <span>{paper.organization}</span>
                                        )}
                                    </div>
                                )}
                                {(paper.difficulty_level || editingId === paper._id) && (
                                    <div className="flex items-center text-gray-600">
                                        <FaChartBar className="mr-2" />
                                        {editingId === paper._id ? (
                                            <select
                                                name="difficulty_level"
                                                value={editData.difficulty_level}
                                                onChange={handleInputChange}
                                                className="w-full px-2 py-1 border rounded focus:outline-none focus:border-[#015990]"
                                            >
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        ) : (
                                            <span>{paper.difficulty_level}</span>
                                        )}
                                    </div>
                                )}
                                {editingId === paper._id && (
                                    <div className="flex items-center text-gray-600">
                                        <FaDownload className="mr-2" />
                                        <input
                                            type="url"
                                            name="file_url"
                                            value={editData.file_url}
                                            onChange={handleInputChange}
                                            className="w-full px-2 py-1 border rounded focus:outline-none focus:border-[#015990]"
                                            placeholder="File URL"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col">
                                {isAuthenticated && user?.role === 'admin' && (
                                    <div className="flex">
                                        {editingId === paper._id ? (
                                            <>
                                                <button
                                                    onClick={(e) => handleSave(paper._id, e)}
                                                    className="bg-green-600 h-[50px] flex-1 flex items-center justify-center text-white text-[20px] font-bold gap-2 hover:bg-green-700 transition-colors"
                                                >
                                                    <FaSave className="text-[18px]" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-600 h-[50px] flex-1 flex items-center justify-center text-white text-[20px] font-bold gap-2 hover:bg-gray-700 transition-colors"
                                                >
                                                    <FaTimes className="text-[18px]" />
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={(e) => handleEdit(paper, e)}
                                                    className="bg-blue-600 h-[50px] flex-1 flex items-center justify-center text-white text-[20px] font-bold gap-2 hover:bg-blue-700 transition-colors"
                                                >
                                                    <FaEdit className="text-[18px]" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(paper._id, e)}
                                                    className="bg-red-600 h-[50px] flex-1 flex items-center justify-center text-white text-[20px] font-bold gap-2 hover:bg-red-700 transition-colors"
                                                >
                                                    <FaTrash className="text-[18px]" />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDownload(paper.file_url)}
                                    className="bg-[#015990] h-[50px] flex items-center justify-center text-white text-[20px] font-bold gap-2 hover:bg-[#014970] transition-colors"
                                >
                                    <FaDownload />
                                    Download
                                </button>
                            </div>
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
