import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllITJobs, fetchAllNonITJobs } from "../../store/slices/jobSlice";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import "./SelectedJobs.css";

const SelectedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { jobs, loading } = useSelector((state) => state.jobs);
    const [jobType, setJobType] = useState("");

    useEffect(() => {
        if (user?.preferences?.notifications_about) {
            const type = user.preferences.notifications_about;
            setJobType(type);
            if (type === 'IT') {
                dispatch(fetchAllITJobs());
            } else if (type === 'NON-IT') {
                dispatch(fetchAllNonITJobs());
            }
        }
    }, [user, dispatch]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="teams-container">
            <div className="teams-wrapper">
                <h1 className="jobs-title">
                    {jobType === 'IT' ? 'IT JOBS' : 'NON-IT JOBS'}
                </h1>
                <div className="teams-table-container">
                    <table className="teams-table">
                        <thead>
                            <tr>
                                <th>Sl.No</th>
                                <th>Title</th>
                                <th>Organization</th>
                                <th>Location</th>
                                <th>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs && jobs.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{index + 1}</td>
                                    <td>{job.role}</td>
                                    <td>{job.organization}</td>
                                    <td>{job.location}</td>
                                    <td>
                                        <Link 
                                            to={`/job/get/${job._id}`} 
                                            className="verify-button"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {jobs?.length === 0 && (
                        <p className="no-jobs">No jobs available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectedJobs;