import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchTeams, clearTeamErrors, deleteTeam } from "../../store/slices/teamSlice";
import Spinner from "../../components/Spinner";
import { FaTrash } from "react-icons/fa";
import useScrollToTop from "../../hooks/useScrollToTop";
import "./Teams.css";

const Teams = () => {
    useScrollToTop();
    const { teams, loading, error } = useSelector((state) => state.team);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    if (loading) return <Spinner />;

    return (
        <div className="teams-container">
            <div className="teams-wrapper">
                <div className="teams-table-container">
                    <table className="teams-table">
                        <thead>
                            <tr>
                                <th>Sl.No</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Verify</th>
                                <th>Delete</th>
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
                                    <td>
                                        {isAuthenticated && user?.role === 'admin' && (
                                            <button 
                                                className="delete-button"
                                                onClick={(e) => handleDelete(team._id, e)}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Teams;