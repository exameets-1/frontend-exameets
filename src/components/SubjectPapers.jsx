import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPapersBySubject, deletePreviousPaper } from "../store/slices/previousSlice";
import Spinner from "../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const SubjectPapers = () => {
    const { subjectSlug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { papersBySubject, loading, error } = useSelector((state) => state.previousYears);
    const { user } = useSelector((state) => state.user); // Get user details from state

    const subjectPapers = papersBySubject[decodeURIComponent(subjectSlug)] || {};

    useEffect(() => {
        dispatch(fetchPapersBySubject(subjectSlug));
    }, [dispatch, subjectSlug]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleDelete = async (paperId) => {
        if (window.confirm("Are you sure you want to delete this paper?")) {
            const result = await dispatch(deletePreviousPaper(paperId));
            if (result.payload?.success) {
                toast.success("Paper deleted successfully");
                dispatch(fetchPapersBySubject(subjectSlug)); // Refresh the papers list
            } else {
                toast.error(result.payload || "Failed to delete paper");
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#015990] mb-8">
                    {decodeURIComponent(subjectSlug)} Previous Year Papers
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Object.keys(subjectPapers).length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-600">
                            No papers found for this subject.
                        </div>
                    ) : (
                        Object.keys(subjectPapers)
                            .sort((a, b) => b - a)
                            .map((year) =>
                                subjectPapers[year].map((paper) => (
                                    <div
                                        key={paper._id}
                                        className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative"
                                    >
                                        {user?.role === "admin" && (
                                            <button
                                                onClick={() => handleDelete(paper._id)}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash className="w-5 h-5" />
                                            </button>
                                        )}

                                        <h3 className="text-xl font-semibold mb-2">{paper.title}</h3>
                                        <div className="text-sm text-gray-600 border-b border-gray-200 pb-2 mb-3">
                                            Exam: {paper.exam_name}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            Difficulty: {paper.difficulty_level}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                            Year: {year}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="bg-[#015990] text-white text-xs px-3 py-1 rounded">
                                                {paper.category || "General"}
                                            </span>
                                            <button
                                                className="text-[#015990] font-medium hover:underline"
                                                onClick={() => navigate(`${year}`)}
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectPapers;