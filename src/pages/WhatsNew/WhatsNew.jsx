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
            <div className="bg-[#015990] dark:bg-gray-950 p-6 rounded-lg mb-8">
                <h1 className="text-3xl font-bold text-white text-center">What&apos;s New</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[{
                    title: "Latest Jobs",
                    data: latestJobs,
                    path: "/job/get/",
                    viewAll: "/jobs"
                }, {
                    title: "Latest Previous Year Papers",
                    data: latestYears,
                    path: "/pyqs/",
                    viewAll: "/pyqs"
                }, {
                    title: "Latest Government Jobs",
                    data: latestGovtJobs,
                    path: "/govtjob/get/",
                    viewAll: "/govtjobs"
                }, {
                    title: "Latest Internships",
                    data: latestInternships,
                    path: "/internship/get/",
                    viewAll: "/internships"
                }, {
                    title: "Latest Scholarships",
                    data: latestScholarships,
                    path: "/scholarship/get/",
                    viewAll: "/scholarships"
                }, {
                    title: "Latest Results",
                    data: latestResults,
                    path: "/result/get/",
                    viewAll: "/results"
                }, {
                    title: "Latest Admit Cards",
                    data: latestAdmitCards,
                    path: "/admitcards/get/",
                    viewAll: "/admitcards"
                }, {
                    title: "Latest Admissions",
                    data: latestAdmissions,
                    path: "/admission/get/",
                    viewAll: "/admissions"
                }].map((section, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md flex flex-col">
                        <h2 className="text-xl font-semibold text-[#015990] dark:text-white border-b-2 border-[#015990] dark:border-gray-700 pb-2 mb-4">{section.title}</h2>
                        {section.data && section.data.length > 0 ? (
                            section.data.map((item) => (
                                <div key={item._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    <Link to={`${section.path}${item._id}`} className="text-gray-800 dark:text-gray-200 hover:text-[#015990] dark:hover:text-[#6BB6E8]">
                                        <p>{item.title || item.jobTitle} - {item.companyName || item.organization || item.year}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">No recent {section.title.toLowerCase()}</p>
                        )}
                        <Link to={section.viewAll} className="mt-auto">
                            <button className="mt-4 bg-[#015990] dark:bg-gray-950 text-white px-4 py-2 rounded hover:bg-[#014d7a] dark:hover:bg-[#013A5C] transition">
                                View All
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default WhatsNew;