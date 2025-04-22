import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPapersBySubjectAndYear, updatePreviousPaper } from "../store/slices/previousSlice";
import Spinner from "../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { FaEdit, FaSave } from "react-icons/fa";

const YearPapers = () => {
    const { subjectSlug, year } = useParams();
    const dispatch = useDispatch();
    const { papersBySubjectAndYear, loading, error } = useSelector((state) => state.previousYears);
    const { user } = useSelector((state) => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editedPapers, setEditedPapers] = useState([]);

    const categoryOptions = [
        "Engineering",
        "Medical",
        "Civil Services",
        "Banking",
        "Railways",
        "Teaching",
        "Defence",
        "State Services",
        "Other",
    ];

    useEffect(() => {
        dispatch(fetchPapersBySubjectAndYear({ subjectSlug, year }));
    }, [dispatch, subjectSlug, year]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (papersBySubjectAndYear) {
            setEditedPapers(JSON.parse(JSON.stringify(papersBySubjectAndYear)));
        }
    }, [papersBySubjectAndYear]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async (paperId, updatedPaper) => {
        try {
            await dispatch(updatePreviousPaper({ id: paperId, updates: updatedPaper }));
            toast.success("Paper updated successfully");
            setIsEditing(false);
        } catch {
            toast.error("Failed to update paper");
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedPapers = [...editedPapers];
        updatedPapers[index][field] = value;
        setEditedPapers(updatedPapers);
    };

    const handleKeywordChange = (index, keywords) => {
        const updatedPapers = [...editedPapers];
        updatedPapers[index].keywords = keywords;
        setEditedPapers(updatedPapers);
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-5 py-10">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[#015990] dark:text-white mb-2">
                        {decodeURIComponent(subjectSlug)} - {year} Papers
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Detailed view of all question papers</p>
                </header>

                {editedPapers.map((paper, index) => (
                    <div key={paper._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8 p-8">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={paper.title}
                                        onChange={(e) => handleInputChange(index, "title", e.target.value)}
                                        className="text-3xl font-bold text-gray-800 dark:text-white mb-2 w-full border dark:border-gray-700 p-2 rounded dark:bg-gray-700"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{paper.title}</h2>
                                )}
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            paper.is_featured
                                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {paper.is_featured ? "⭐ Featured Paper" : "Standard Paper"}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Added on {new Date(paper.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {user?.role === "admin" || user?.role === "manager" && (
                                <button
                                    onClick={() =>
                                        isEditing
                                            ? handleSave(paper._id, paper)
                                            : handleEditToggle()
                                    }
                                    className={`${
                                        isEditing ? "bg-green-600" : "bg-[#015990]"
                                    } text-white px-4 py-2 rounded flex items-center gap-2`}
                                >
                                    {isEditing ? <FaSave /> : <FaEdit />}
                                    {isEditing ? "Save Changes" : "Edit Paper"}
                                </button>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                    <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">Paper Overview</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={paper.description || ""}
                                            onChange={(e) =>
                                                handleInputChange(index, "description", e.target.value)
                                            }
                                            className="w-full p-2 border dark:border-gray-600 rounded h-32 dark:bg-gray-800 dark:text-white"
                                        />
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {paper.description || "No description available"}
                                        </p>
                                    )}

                                    <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4 mt-6">Search Information</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={paper.searchDescription || ""}
                                            onChange={(e) =>
                                                handleInputChange(index, "searchDescription", e.target.value)
                                            }
                                            className="w-full p-2 border dark:border-gray-600 rounded h-32 dark:bg-gray-800 dark:text-white"
                                            placeholder="Enter search description for better search results"
                                        />
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {paper.searchDescription || "No search description available"}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">Exam Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["exam_name", "subject", "year"].map((field) => (
                                            <div key={field} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">
                                                    {field.replace("_", " ")}
                                                </p>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={paper[field] || ""}
                                                        onChange={(e) =>
                                                            handleInputChange(index, field, e.target.value)
                                                        }
                                                        className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                    />
                                                ) : (
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">{paper[field]}</p>
                                                )}
                                            </div>
                                        ))}

                                        {/* Category Field */}
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                                            {isEditing ? (
                                                <select
                                                    value={paper.category || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, "category", e.target.value)
                                                    }
                                                    className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                >
                                                    {categoryOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{paper.category}</p>
                                            )}
                                        </div>

                                        {/* Slug Field */}
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Slug</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={paper.slug || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, "slug", e.target.value)
                                                    }
                                                    className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{paper.slug}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-[#015990] dark:text-blue-400 mb-4">Keywords</h3>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            {paper.keywords?.map((keyword, keywordIndex) => (
                                                <div key={keywordIndex} className="flex gap-2">
                                                    <input
                                                        value={keyword}
                                                        onChange={(e) => {
                                                            const newKeywords = [...paper.keywords];
                                                            newKeywords[keywordIndex] = e.target.value;
                                                            handleKeywordChange(index, newKeywords);
                                                        }}
                                                        className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newKeywords = paper.keywords.filter(
                                                                (_, i) => i !== keywordIndex
                                                            );
                                                            handleKeywordChange(index, newKeywords);
                                                        }}
                                                        className="text-red-500 dark:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() =>
                                                    handleKeywordChange(index, [...(paper.keywords || []), ""])
                                                }
                                                className="text-sm text-blue-600 dark:text-blue-400"
                                            >
                                                + Add Keyword
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {paper.keywords?.map((keyword, keywordIndex) => (
                                                <span
                                                    key={keywordIndex}
                                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    #{keyword}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {!editedPapers.length && (
                    <div className="text-center py-20">
                        <div className="text-2xl text-gray-500 dark:text-gray-400 mb-4">No papers found for {year}</div>
                        <p className="text-gray-600 dark:text-gray-300">Please check back later or try a different year</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YearPapers;