import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { fetchSingleGovtJob, updateGovtJob } from '../../store/slices/govtJobSlice';
import Spinner from '../Spinner/Spinner';
import EditGovtJobModal from '../../modals/EditModals/EditGovtJobModal';
import { toast } from 'react-toastify';

const GovtJobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const { job, loading, error } = useSelector((state) => state.govtJobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) dispatch(fetchSingleGovtJob(id));
  }, [dispatch, id]);

  const handleBack = () => navigate(-1);
  const handleEdit = () => setShowEditModal(true);

  const handleUpdateJob = async ({ jobId, updatedData }) => {
    try {
      await dispatch(updateGovtJob({ jobId, updatedData }));
      setShowEditModal(false);
      toast.success('Job updated successfully');
      dispatch(fetchSingleGovtJob(id));
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const renderArrayAsList = (array, emptyMessage = "None specified") => {
    if (!array || array.length === 0) {
      return <p className="text-gray-500 dark:text-white-400">{emptyMessage}</p>;
    }
    return (
      <ul className="list-disc pl-5 space-y-2">
        {array.map((item, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-200">{item}</li>
        ))}
      </ul>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (error) return <div className="max-w-6xl mx-auto p-6">Error: {error}</div>;
  if (!job) return <div className="max-w-6xl mx-auto p-6">No job found</div>;

  return (
    <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Govt Jobs
        </button>
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
          <button 
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FaEdit /> Edit Job
          </button>
        )}
      </div>
  
      <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-white text-center">{job.jobTitle}</h1>
        <p className="mt-2 text-white text-center">{job.organization}</p>
      </div>
  
      {/* Job Overview */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Job Overview</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.jobOverview}</p>
      </section>
  
      {/* Job Location & Vacancies */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Job Location</h2>
        <p className="text-gray-700 dark:text-gray-300">{job.jobLocation || "Not specified"}</p>
      </section>
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Total Vacancies</h2>
        <p className="text-gray-700 dark:text-gray-300">{job.totalVacancies || "Not specified"}</p>
      </section>
  
      {/* Important Dates */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
        <ul className="space-y-3">
          {[
            ['Notification Release Date', job.notificationReleaseDate],
            ['Application Start Date', job.applicationStartDate],
            ['Application End Date', job.applicationEndDate],
            ['Exam/Interview Date', job.examInterviewDate],
          ].map(([label, date], index) => (
            <li
              key={index}
              className={`flex justify-between items-center ${index < 3 ? 'border-b pb-2 border-gray-200 dark:border-gray-700' : ''}`}
            >
              <span className="font-medium">{label}:</span>
              <span>{(date)}</span>
            </li>
          ))}
        </ul>
      </section>
  
      {/* Eligibility Criteria */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Educational Qualifications</h3>
            {renderArrayAsList(job.educationalQualifications)}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Age Limit</h3>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <p>Minimum: {job.ageLimitMin || "Not specified"}</p>
              <p>Maximum: {job.ageLimitMax || "Not specified"}</p>
              <p>Age Relaxation: {job.ageRelaxation || "Not specified"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Additional Requirements</h3>
            {renderArrayAsList(job.additionalRequirements)}
          </div>
        </div>
      </section>
  
      {/* Vacancy Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Vacancy Details</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-center">Post Name</th>
              <th className="px-4 py-2 text-center">Vacancy Count</th>
              <th className="px-4 py-2 text-center">Pay Scale</th>
            </tr>
          </thead>
          <tbody>
            {job.vacancyPostNames?.map((postName, index) => (
              <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 text-center">{postName}</td>
                <td className="px-4 py-2 text-center">{job.vacancyCounts?.[index]}</td>
                <td className="px-4 py-2 text-center">{job.vacancyPayScales?.[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
  
      {/* Application Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Application Details</h2>
        <ul className="space-y-3">
          {[
            ['Application Mode', job.applicationMode],
            ['Application Fee (General)', job.applicationFeeGeneral],
            ['Application Fee (SC/ST/PWD)', job.applicationFee_SC_ST_PWD],
            ['Payment Mode', job.applicationFeePaymentMode],
          ].map(([label, value], index) => (
            <li
              key={index}
              className={`flex justify-between items-center ${index < 3 ? 'border-b pb-2 border-gray-200 dark:border-gray-700' : ''}`}
            >
              <span className="font-medium">{label}:</span>
              <span>{value || "Not specified"}</span>
            </li>
          ))}
        </ul>
      </section>
  
      {/* Selection Process */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Selection Process</h2>
        {renderArrayAsList(job.selectionProcess)}
      </section>
  
      {/* How to Apply */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">How to Apply</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium dark:text-white mb-2">Online Application Steps</h3>
            {renderArrayAsList(job.howToApplyOnlineSteps)}
          </div>
          <div>
            <h3 className="text-lg font-medium dark:text-white mb-2">Offline Application Steps</h3>
            {renderArrayAsList(job.howToApplyOfflineSteps)}
          </div>
          <div>
            <h3 className="text-lg font-medium dark:text-white mb-2">Required Documents</h3>
            {renderArrayAsList(job.requiredDocuments)}
          </div>
        </div>
      </section>
  
      {/* Exam Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Exam Details</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Exam Subject</th>
              <th className="px-4 py-2 text-left">Question Count</th>
              <th className="px-4 py-2 text-left">Marks Distribution</th>
              <th className="px-4 py-2 text-left">Exam Duration</th>
            </tr>
          </thead>
          <tbody>
            {job.examSubjects?.map((subject, index) => (
              <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">{subject}</td>
                <td className="px-4 py-2">{job.examQuestionCounts?.[index]}</td>
                <td className="px-4 py-2">{job.examMarks?.[index]}</td>
                <td className="px-4 py-2">{job.examDurations?.[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
  
      {/* Important Links */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
        <ul className="space-y-3">
          {job.notificationPDFLink && (
            <li className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
              <span className="font-medium">Notification PDF:</span>
              <a href={job.notificationPDFLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </li>
          )}
          {job.applyOnlineLink && (
            <li className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
              <span className="font-medium">Apply Online:</span>
              <a href={job.applyOnlineLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                Visit
              </a>
            </li>
          )}
          {job.officialWebsiteLink && (
            <li className="flex justify-between items-center">
              <span className="font-medium">Official Website:</span>
              <a href={job.officialWebsiteLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                Visit
              </a>
            </li>
          )}
        </ul>
      </section>
  
      {/* FAQ */}
      {job.faq?.length > 0 && (
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Frequently Asked Questions</h2>
          <ul className="space-y-4">
            {job.faq.map((item, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <strong className="text-gray-800 dark:text-gray-200">Q:</strong> {item.question}<br />
                <strong className="text-gray-800 dark:text-gray-200 mt-2 block">A:</strong> {item.answer}
              </li>
            ))}
          </ul>
        </section>
      )}
  
      {/* Keywords */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {job.keywords?.map((keyword, index) => (
            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              {keyword}
            </span>
          ))}
        </div>
      </section>
  
      {/* Featured Badge */}
      {job.isFeatured && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          Featured Job
        </div>
      )}
  
      {/* Apply Button */}
      {job.applyOnlineLink && (
        <div className="text-center mt-8">
          <a
            href={job.applyOnlineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Apply Now
          </a>
        </div>
      )}
  
      {/* Edit Modal */}
      {showEditModal && (
        <EditGovtJobModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          job={job}
          jobId={id}
          onUpdate={handleUpdateJob}
        />
      )}
    </div>
  );
};

export default GovtJobDetails;