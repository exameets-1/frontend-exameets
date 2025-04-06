import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchTeams, clearTeamErrors, deleteTeam, createTeam } from "../../store/slices/teamSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import useScrollToTop from "../../hooks/useScrollToTop";
import AddTeamModal from "../../modals/AddModals/AddTeamModal";

const Teams = () => {
    useScrollToTop();
    const { teams, loading, error } = useSelector((state) => state.team);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTeamErrors());
        }
        dispatch(fetchTeams());
    }, [dispatch, error]);

    const handleVerify = (teamId, e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info("Please login to verify team member", {
                position: "top-center",
                autoClose: 2000,
            });
            localStorage.setItem('pendingTeamVerification', teamId);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
            return;
        }
        localStorage.setItem('teamScrollPosition', window.scrollY.toString());
        navigate(`/team/get/${teamId}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this team member?')) {
            dispatch(deleteTeam(id));
            toast.success('Team member deleted successfully');
        }
    };

    const handleAddTeam = async (teamData) => {
        try {
            const { payload } = await dispatch(createTeam(teamData));
            if (payload?.success) {
                toast.success('Team member added successfully!');
                setIsModalOpen(false);
            } else {
                toast.error(payload?.message || 'Failed to add team member');
            }
        } catch (error) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-5">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6">
                    {isAuthenticated && user?.role === 'manager' && (
                        <button
                            className="mb-6 bg-[#005792] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-[#004579] dark:hover:bg-blue-700 transition-colors"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Team Member
                        </button>
                    )}
    
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#005792] dark:bg-gray-950 text-white">
                                    <th className="p-3 text-left font-semibold">Sl.No</th>
                                    <th className="p-3 text-left font-semibold">Name</th>
                                    <th className="p-3 text-left font-semibold">Role</th>
                                    <th className="p-3 text-left font-semibold">Verify</th>
                                    {isAuthenticated && user?.role === 'manager' && (
                                        <th className="p-3 text-left font-semibold">Delete</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {teams?.map((team, index) => (
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
                                        {isAuthenticated && user?.role === 'manager' && (
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
                                ))}
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
        </div>
    );    
};

export default Teams;