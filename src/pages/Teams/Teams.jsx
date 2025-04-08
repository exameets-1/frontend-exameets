import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    fetchTeams,
    fetchPendingTeams,
    clearTeamErrors,
    deleteTeam,
    createTeam,
    approveTeam
} from "../../store/slices/teamSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import useScrollToTop from "../../hooks/useScrollToTop";
import AddTeamModal from "../../modals/AddModals/AddTeamModal";
import PendingRequestsModal from "../../modals/Utils/PendingRequestsModal";

const Teams = () => {
    useScrollToTop();
    const { teams, pendingTeams, loading, error } = useSelector((state) => state.team);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const [hasFetchedPending, setHasFetchedPending] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTeamErrors());
        }
        dispatch(fetchTeams());
    }, [dispatch, error]);

    // Reset fetch flag on unmount
    useEffect(() => {
        return () => {
            setHasFetchedPending(false);
        };
    }, []);

    const handleVerify = (teamId, e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info("Please login to verify team member", {
                position: "top-center",
                autoClose: 2000,
            });
            localStorage.setItem("pendingTeamVerification", teamId);
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            return;
        }
        localStorage.setItem("teamScrollPosition", window.scrollY.toString());
        navigate(`/team/get/${teamId}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this team member?")) {
            dispatch(deleteTeam(id))
                .then(() => {
                    toast.success("Team member deleted successfully");
                })
                .catch((error) => {
                    toast.error(error.message || "Failed to delete team member");
                });
        }
    };

    const handleAddTeam = async (teamData) => {
        console.log("handleAddTeam called with teamData: ", teamData);
        try {
            const result = await dispatch(createTeam(teamData));
            console.log("handleAddTeam result: ", result);
            if (result.payload?.success) {
                console.log("handleAddTeam success");
                toast.success("Team member added successfully! Waiting for manager approval.");
                setIsModalOpen(false);
            } else {
                console.log("handleAddTeam failed", result.payload?.message);
                toast.error(result.payload?.message);
            }
        } catch (error) {
            console.log("handleAddTeam error", error);
            toast.error(error.message);
        }
    };

    const handleOpenPendingModal = () => {
        setIsPendingModalOpen(true);
        if (!hasFetchedPending) {
            dispatch(fetchPendingTeams())
                .then(() => {
                    setHasFetchedPending(true);
                })
                .catch((error) => {
                    toast.error(error.message || "Failed to fetch pending teams");
                });
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-5">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Team Members</h1>
                        <div className="flex space-x-4">
                            {isAuthenticated && user?.role === "admin" && (
                                <button
                                    className="bg-[#005792] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-[#004579] dark:hover:bg-blue-700 transition-colors"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add Team Member
                                </button>
                            )}

                            {isAuthenticated && user?.role === "manager" && (
                                <button
                                    className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
                                    onClick={handleOpenPendingModal}
                                >
                                    View Pending Requests
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#005792] dark:bg-gray-950 text-white">
                                    <th className="p-3 text-left font-semibold">Sl.No</th>
                                    <th className="p-3 text-left font-semibold">Name</th>
                                    <th className="p-3 text-left font-semibold">Role</th>
                                    <th className="p-3 text-left font-semibold">Verify</th>
                                    {isAuthenticated && user?.role === "manager" && (
                                        <th className="p-3 text-left font-semibold">Delete</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {teams?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-4 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No team members found
                                        </td>
                                    </tr>
                                ) : (
                                    teams?.map((team, index) => (
                                        <tr
                                            key={team._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-blue-50 dark:even:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                                        >
                                            <td className="p-3 dark:text-white">{index + 1}</td>
                                            <td className="p-3 dark:text-white">{team.name}</td>
                                            <td className="p-3 dark:text-white">{team.position}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={(e) => handleVerify(team._id, e)}
                                                    className="bg-[#005792] dark:bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-[#004579] dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    Verify
                                                </button>
                                            </td>
                                            {isAuthenticated && user?.role === "manager" && (
                                                <td className="p-3">
                                                    <button
                                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 p-2 transition-colors"
                                                        onClick={(e) => handleDelete(team._id, e)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTeam}
            />

            <PendingRequestsModal
                isOpen={isPendingModalOpen}
                onClose={() => setIsPendingModalOpen(false)}
                loading={loading}
                error={error}
                pendingTeams={pendingTeams}
                onApprove={(id) => dispatch(approveTeam(id))}
                onDelete={(id) => dispatch(deleteTeam(id))}
            />
        </div>
    );
};

export default Teams;
