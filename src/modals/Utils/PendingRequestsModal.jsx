import { FaCheck, FaTrash } from "react-icons/fa";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";

const PendingRequestsModal = ({ 
    isOpen, 
    onClose,
    loading,
    error,
    pendingTeams,
    onApprove,
    onDelete
}) => {
    if (!isOpen) return null;

    const handleApprove = async (id) => {
        try {
            await onApprove(id);
            toast.success("Team member approved");
        } catch (error) {
            toast.error(error.message);
        }
    };
      
    const handleDelete = async (id) => {
        if (window.confirm("Reject this member?")) {
            try {
                await onDelete(id);
                toast.success("Request rejected");
            } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    return (
        <div className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Pending Team Member Requests
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    >
                        &times;
                    </button>
                </div>

                <div className="overflow-y-auto p-4 max-h-[calc(80vh-130px)]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                            {error}
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="flex justify-center">
                            <Spinner />
                        </div>
                    ) : pendingTeams?.length === 0 ? (
                        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                            No pending team member requests.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#005792] dark:bg-gray-950 text-white">
                                        <th className="p-3 text-left font-semibold">Name</th>
                                        <th className="p-3 text-left font-semibold">Position</th>
                                        <th className="p-3 text-left font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingTeams?.map((team) => (
                                        <tr
                                            key={team._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                                        >
                                            <td className="p-3 dark:text-white">{team.name}</td>
                                            <td className="p-3 dark:text-white">{team.position}</td>
                                            <td className="p-3 flex space-x-2">
                                                <button
                                                    onClick={() => handleApprove(team._id)}
                                                    className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(team._id)}
                                                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                                                    title="Reject"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingRequestsModal;