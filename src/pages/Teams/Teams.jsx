import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchTeams, clearTeamErrors, deleteTeam, createTeam } from "../../store/slices/teamSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import useScrollToTop from "../../hooks/useScrollToTop";
import AddTeamModal from "../../components/AddTeamModal/AddTeamModal"; // Import the modal component
//import "./Teams.css";

const Teams = () => {
    useScrollToTop();
    const { teams, loading, error } = useSelector((state) => state.team);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
        <div className="teams-container">
            <div className="teams-wrapper">
                {isAuthenticated && user?.role === 'manager' && (
                    <button
                        className="mb-6 bg-[#015990] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Team Member
                    </button>
                )}

                <div className="teams-table-container">
                    <table className="teams-table">
                        <thead>
                            <tr>
                                <th>Sl.No</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Verify</th>
                                {isAuthenticated && user?.role === 'manager' && <th>Delete</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {teams?.map((team, index) => (
                                <tr key={team._id}>
                                    <td>{index + 1}</td>
                                    <td>{team.name}</td>
                                    <td>{team.position}</td>
                                    <td>
                                        <button
                                            onClick={(e) => handleVerify(team._id, e)}
                                            className="verify-button"
                                        >
                                            Verify
                                        </button>
                                    </td>
                                    {isAuthenticated && user?.role === 'manager' && (
                                        <td>
                                            <button
                                                className="delete-button"
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

            {/* Add Team Modal */}
            <AddTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTeam}
            />
        </div>
    );
};

export default Teams;
