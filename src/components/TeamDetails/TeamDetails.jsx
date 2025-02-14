import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { fetchSingleTeam } from "../../store/slices/teamSlice";
import Spinner from "../Spinner/Spinner";
import "./TeamDetails.css";

const TeamDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { team, loading, error } = useSelector((state) => state.team);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleTeam(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleBack = () => {
    navigate("/team");
  };

  useEffect(() => {
    return () => {
      const savedScrollPosition = localStorage.getItem('teamScrollPosition');
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          localStorage.removeItem('teamScrollPosition');
        }, 0);
      }
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        An error occurred: {error}
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-10 text-gray-500">
        No team member details found
      </div>
    );
  }

  return (
    <div className="team-details-container">
      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft /> Back to Team
      </button>

      <div className="profile-section">
        <img
          src={team.image}
          alt={team.name}
          className="profile-image"
        />
        <h1 className="profile-name">{team.name}</h1>
        <h2 className="profile-role">{team.position}</h2>
        <div className="duration">
          Duration: {team.duration }
        </div>
      </div>

      <div className="info-section">
        <div className="info-label">About:</div>
        <div className="info-content">
          {team.description }
        </div>
      </div>

      <div className="info-section">
        <div className="info-label">Strengths:</div>
        <div className="info-content">
          {team.strengths }
        </div>
      </div>

      <div className="certificate-section">
        <div className="info-label">Certificate:</div>
        <div className="certificate-placeholder">
          {team.certificates?.map((certificate, index) => (
            <div key={index}>{certificate}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
