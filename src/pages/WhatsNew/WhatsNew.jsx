import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestJobs } from '../../store/slices/jobSlice';
import { fetchLatestGovtJobs } from '../../store/slices/govtJobSlice';
import { fetchLatestInternships } from '../../store/slices/internshipSlice';
import { fetchLatestScholarships } from '../../store/slices/scholarshipSlice';
import { fetchLatestResults } from '../../store/slices/resultSlice';
import { fetchLatestAdmitCards } from '../../store/slices/admitCardSlice';
import { fetchLatestAdmissions } from '../../store/slices/admissionSlice';
import { fetchLatestYears } from '../../store/slices/previousSlice';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import useScrollToTop from '../../hooks/useScrollToTop';

const WhatsNew = () => {
    useScrollToTop();
    const dispatch = useDispatch();

    const { latestJobs, loading: jobsLoading, error: jobsError } = useSelector((state) => state.jobs);
    const { latestGovtJobs, loading: govtJobsLoading, error: govtJobsError } = useSelector((state) => state.govtJobs);
    const { latestInternships } = useSelector((state) => state.internships);
    const { latestScholarships } = useSelector((state) => state.scholarships);
    const { latestResults } = useSelector((state) => state.results);
    const { latestAdmitCards } = useSelector((state) => state.admitCards);
    const { latestAdmissions } = useSelector((state) => state.admissions);
    const { latestYears } = useSelector((state) => state.previousYears);

    useEffect(() => {
        dispatch(fetchLatestJobs());
        dispatch(fetchLatestGovtJobs());
        dispatch(fetchLatestInternships());
        dispatch(fetchLatestScholarships());
        dispatch(fetchLatestResults());
        dispatch(fetchLatestAdmitCards());
        dispatch(fetchLatestAdmissions());
        dispatch(fetchLatestYears());
    }, [dispatch]);

    if (jobsLoading || govtJobsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Spinner />
            </div>
        );
    }

    if (jobsError || govtJobsError) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <p className="text-red-500">{jobsError || govtJobsError}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-[#015990] p-6 rounded-lg mb-8">
                <h1 className="text-3xl font-bold text-white text-center">What&apos;s New</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Latest Jobs Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Jobs</h2>
                    {latestJobs && latestJobs.length > 0 ? (
                        latestJobs.map((job) => (
                            <div key={job._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/job/get/${job._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{job.jobTitle} - {job.companyName}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent jobs</p>
                    )}
                    <Link to="/jobs" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Previous Year Papers Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Previous Year Papers</h2>
                    {latestYears && latestYears.length > 0 ? (
                        latestYears.map((paper) => (
                            <div key={paper._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/pyqs/${paper.subject}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{paper.title} - {paper.year}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent previous year papers</p>
                    )}
                    <Link to="/pyqs" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Government Jobs Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Government Jobs</h2>
                    {latestGovtJobs && latestGovtJobs.length > 0 ? (
                        latestGovtJobs.map((job) => (
                            <div key={job._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/govtjob/get/${job._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{job.jobTitle} - {job.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent government jobs</p>
                    )}
                    <Link to="/govtjobs" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Internships Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Internships</h2>
                    {latestInternships && latestInternships.length > 0 ? (
                        latestInternships.map((internship) => (
                            <div key={internship._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/internship/get/${internship._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{internship.title} - {internship.companyName}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent internships</p>
                    )}
                    <Link to="/internships" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Scholarships Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Scholarships</h2>
                    {latestScholarships && latestScholarships.length > 0 ? (
                        latestScholarships.map((scholarship) => (
                            <div key={scholarship._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/scholarship/get/${scholarship._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{scholarship.title} - {scholarship.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent scholarships</p>
                    )}
                    <Link to="/scholarships" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Results Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Results</h2>
                    {latestResults && latestResults.length > 0 ? (
                        latestResults.map((result) => (
                            <div key={result._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/result/get/${result._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{result.title} - {result.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent results</p>
                    )}
                    <Link to="/results" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Admit Cards Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Admit Cards</h2>
                    {latestAdmitCards && latestAdmitCards.length > 0 ? (
                        latestAdmitCards.map((admitCard) => (
                            <div key={admitCard._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/admitcards/get/${admitCard._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{admitCard.title} - {admitCard.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent admit cards</p>
                    )}
                    <Link to="/admitcards" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>

                {/* Latest Admissions Section */}
                <div className="bg-white border-2 border-[#015990] rounded-lg p-4 shadow-md flex flex-col">
                    <h2 className="text-xl font-semibold text-[#015990] border-b-2 border-[#015990] pb-2 mb-4">Latest Admissions</h2>
                    {latestAdmissions && latestAdmissions.length > 0 ? (
                        latestAdmissions.map((admission) => (
                            <div key={admission._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 transition">
                                <Link to={`/admission/get/${admission._id}`} className="text-gray-800 hover:text-[#015990]">
                                    <p>{admission.title} - {admission.organization}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent admissions</p>
                    )}
                    <Link to="/admissions" className="mt-auto">
                        <button className="mt-4 bg-[#015990] text-white px-4 py-2 rounded hover:bg-[#014d7a] transition">
                            View All
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WhatsNew;