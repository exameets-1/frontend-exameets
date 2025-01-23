import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestJobs } from '../../store/slices/jobSlice';
import { fetchLatestGovtJobs } from '../../store/slices/govtJobSlice';
import { fetchLatestInternships } from '../../store/slices/internshipSlice';
import { fetchLatestScholarships } from '../../store/slices/scholarshipSlice';
import { fetchLatestResults } from '../../store/slices/resultSlice';
import { fetchLatestAdmitCards } from '../../store/slices/admitCardSlice';
import { fetchLatestAdmissions } from '../../store/slices/admissionSlice';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import './WhatsNew.css';

const WhatsNew = () => {
    const dispatch = useDispatch();
    const { 
        latestJobs,
        loading: jobsLoading,
        error: jobsError 
    } = useSelector((state) => state.jobs);

    const {
        latestGovtJobs,
        loading: govtJobsLoading,
        error: govtJobsError
    } = useSelector((state) => state.govtJobs);

    const {
        latestInternships,
        loading: internshipsLoading,
        error: internshipsError
    } = useSelector((state) => state.internships);

    const {
        latestScholarships,
        loading: scholarshipsLoading,
        error: scholarshipsError
    } = useSelector((state) => state.scholarships);

    const {
        latestResults,
        loading: resultsLoading,
        error: resultsError
    } = useSelector((state) => state.results);

    const {
        latestAdmitCards,
        loading: admitCardsLoading,
        error: admitCardsError
    } = useSelector((state) => state.admitCards);

    const {
        latestAdmissions,
        loading: admissionsLoading,
        error: admissionsError
    } = useSelector((state) => state.admissions);

    useEffect(() => {
        dispatch(fetchLatestJobs());
        dispatch(fetchLatestGovtJobs());
        dispatch(fetchLatestInternships());
        dispatch(fetchLatestScholarships());
        dispatch(fetchLatestResults());
        dispatch(fetchLatestAdmitCards());
        dispatch(fetchLatestAdmissions());
    }, [dispatch]);

    if (jobsLoading || govtJobsLoading || internshipsLoading || scholarshipsLoading || resultsLoading || admitCardsLoading || admissionsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Spinner />
            </div>
        );
    }

    if (jobsError || govtJobsError || internshipsError || scholarshipsError || resultsError || admitCardsError || admissionsError) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <p className="text-red-500">
                    {jobsError || govtJobsError || internshipsError || scholarshipsError || resultsError || admitCardsError || admissionsError}
                </p>
            </div>
        );
    }

    return (
        <div className="whatsnew-page">
            <div className="whatsnew-header">
                <h1>What's New</h1>
            </div>

            <div className="whatsnew-grid">
                {/* Latest Jobs Section */}
                <div className="section-card">
                    <h2>Latest Jobs</h2>
                    {latestJobs && latestJobs.length > 0 ? (
                        latestJobs.map((job) => (
                            <div key={job._id} className="section-item">
                                <Link to={`/job/get/${job._id}`}>
                                    <p>{job.role} - {job.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent jobs</p>
                    )}
                </div>

                {/* Latest Govt Jobs Section */}
                <div className="section-card">
                    <h2>Latest Government Jobs</h2>
                    {latestGovtJobs && latestGovtJobs.length > 0 ? (
                        latestGovtJobs.map((job) => (
                            <div key={job._id} className="section-item">
                                <Link to={`/govtjob/get/${job._id}`}>
                                    <p>{job.role} - {job.department}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent government jobs</p>
                    )}
                </div>

                {/* Latest Internships Section */}
                <div className="section-card">
                    <h2>Latest Internships</h2>
                    {latestInternships && latestInternships.length > 0 ? (
                        latestInternships.map((internship) => (
                            <div key={internship._id} className="section-item">
                                <Link to={`/internship/get/${internship._id}`}>
                                    <p>{internship.internship_type} - {internship.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent internships</p>
                    )}
                </div>

                {/* Latest Scholarships Section */}
                <div className="section-card">
                    <h2>Latest Scholarships</h2>
                    {latestScholarships && latestScholarships.length > 0 ? (
                        latestScholarships.map((scholarship) => (
                            <div key={scholarship._id} className="section-item">
                                <Link to={`/scholarship/get/${scholarship._id}`}>
                                    <p>{scholarship.title} - {scholarship.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent scholarships</p>
                    )}
                </div>

                {/* Latest Results Section */}
                <div className="section-card">
                    <h2>Latest Results</h2>
                    {latestResults && latestResults.length > 0 ? (
                        latestResults.map((result) => (
                            <div key={result._id} className="section-item">
                                <Link to={`/results/get/${result._id}`}>
                                    <p>{result.exam_title}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent results</p>
                    )}
                </div>

                {/* Latest Admit Cards Section */}
                <div className="section-card">
                    <h2>Latest Admit Cards</h2>
                    {latestAdmitCards && latestAdmitCards.length > 0 ? (
                        latestAdmitCards.map((admitCard) => (
                            <div key={admitCard._id} className="section-item">
                                <Link to={`/admitcard/get/${admitCard._id}`}>
                                    <p>{admitCard.title} - {admitCard.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent admit cards</p>
                    )}
                </div>

                {/* Latest Admissions Section */}
                <div className="section-card">
                    <h2>Latest Admissions</h2>
                    {latestAdmissions && latestAdmissions.length > 0 ? (
                        latestAdmissions.map((admission) => (
                            <div key={admission._id} className="section-item">
                                <Link to={`/admission/get/${admission._id}`}>
                                    <p>{admission.title} - {admission.institution}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="empty-message">No recent admissions</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhatsNew;
