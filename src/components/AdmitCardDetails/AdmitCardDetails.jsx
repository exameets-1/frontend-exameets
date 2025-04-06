import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaExternalLinkAlt, FaEdit, FaLink } from 'react-icons/fa';
import { fetchSingleAdmitCard, resetAdmitCard, updateAdmitCard } from '../../store/slices/admitCardSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';
import EditAdmitCardModal from '../../modals/EditModals/EditAdmitCardModal';

const AdmitCardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admitCard, loading, error } = useSelector((state) => state.admitCards);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    if (id) dispatch(fetchSingleAdmitCard(id));
    return () => dispatch(resetAdmitCard());
  }, [dispatch, id]);

  const handleBack = () => navigate('/admitcards');

  const handleVisitAdmitCard = () => {
    const downloadLink = admitCard?.importantLinks?.find(link => link.linkType === 'downloadLink');
    if (downloadLink) {
      window.open(downloadLink.link, '_blank');
    }
  };

  const handleEditSubmit = (formData) => {
    dispatch(updateAdmitCard(formData))
      .then((data) => {
        if (data) {
          toast.success("Admit Card updated successfully");
          setIsEditModalOpen(false);
        }
      })
      .catch(() => {
        toast.error("Failed to update admit card");
      });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (error) return <div className="max-w-6xl mx-auto p-6">Error: {error}</div>;
  if (!admitCard) return <div className="max-w-6xl mx-auto p-6">No admit card found</div>;

  return (
    <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Admit Cards
        </button>
        {isAuthenticated && user?.role === 'admin' && (
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FaEdit /> Edit Admit Card
          </button>
        )}
      </div>

      <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-white text-center">{admitCard.title}</h1>
        <p className="mt-2 text-white text-center">{admitCard.organization}</p>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Advertisement Number</h3>
          <p className="text-gray-700 dark:text-gray-300">{admitCard.advertisementNumber}</p>
        </div>
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Vacancies</h3>
          <p className="text-gray-700 dark:text-gray-300">{admitCard.vacancies}</p>
        </div>
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Featured</h3>
          <p className="text-gray-700 dark:text-gray-300">{admitCard.isFeatured ? 'Yes' : 'No'}</p>
        </div>
        <div className="section-container">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Official Website</h3>
          <a 
            href={admitCard.officialWebsite} 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {admitCard.officialWebsite}
          </a>
        </div>
      </div>

      {/* Important Dates */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
        <div className="space-y-3">
          {admitCard.importantDates?.map((date, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-medium text-gray-800 dark:text-gray-200">{date.event}</p>
              <p className="text-gray-700 dark:text-gray-300">{date.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exam Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Exam Details</h2>
        <div className="space-y-3">
          {admitCard.examDetails?.map((detail, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-medium text-gray-800 dark:text-gray-200">Exam Date: {detail.examDate}</p>
              <p className="text-gray-700 dark:text-gray-300">Shift Timings: {detail.shiftTimings}</p>
              <p className="text-gray-700 dark:text-gray-300">Reporting Time: {detail.reportingTime}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Sections */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Download Steps</h3>
            <ul className="list-disc pl-5 space-y-2">
              {admitCard.downloadSteps?.map((step, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Instructions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {admitCard.instructions?.map((instruction, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Important Links */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admitCard.importantLinks?.map((link, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <a
                href={link.link.startsWith("http") ? link.link : `https://${link.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
              >
                <FaLink /> {link.linkType}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {admitCard.keywords?.map((keyword, index) => (
                <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Search Description</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {admitCard.searchDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Download Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleVisitAdmitCard}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          disabled={!admitCard?.importantLinks?.some(link => link.linkType === 'downloadLink')}
        >
          <FaExternalLinkAlt /> Download Admit Card
        </button>
      </div>
      {isAuthenticated && user?.role === 'admin' && (
    <EditAdmitCardModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSubmit={handleEditSubmit}
      admitCardData={admitCard}
    />
     )}
    </div>
  );
};

export default AdmitCardDetails;