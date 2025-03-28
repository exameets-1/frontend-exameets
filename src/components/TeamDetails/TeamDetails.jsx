import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { fetchSingleTeam } from "../../store/slices/teamSlice";
import Spinner from "../Spinner/Spinner";
import React from "react";

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
      const savedScrollPosition = localStorage.getItem("teamScrollPosition");
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          localStorage.removeItem("teamScrollPosition");
        }, 0);
      }
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        An error occurred: {error}
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        No team member details found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span className="font-medium">Back to Team</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={team.image}
              alt={team.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mb-6 shadow-md"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
            <h2 className="text-xl text-gray-600 mb-2">{team.position}</h2>
            <div className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
              {team.duration} with company
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">{team.description}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Strengths</h3>
              <p className="text-gray-600 leading-relaxed">
                {team.strengths.split(".").map((paragraph, index) => (
                  <React.Fragment key={index}>
                    {paragraph}
                    {index !== team.strengths.split(".").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>

            {team.certificates?.length > 0 && (
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.certificates.map((certificate, index) => (
                    <a
                      key={index}
                      href={certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={certificate}
                        alt={`Certificate ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="text-white text-sm font-medium">
                          Certificate {index + 1}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;