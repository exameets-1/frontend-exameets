import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { fetchSingleAdmission, updateAdmission } from "../../store/slices/admissionSlice";
import Spinner from "../Spinner/Spinner";
import EditAdmissionModal from '../../modals/EditModals/EditAdmissionModal';
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const AdmissionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);

    const admission = useSelector((state) => state.admissions.admission);
    const loading = useSelector((state) => state.admissions.loading);
    const error = useSelector((state) => state.admissions.error);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (id) dispatch(fetchSingleAdmission(id));
    }, [dispatch, id]);

    const handleBack = () => navigate(-1);
    const handleEdit = () => setShowEditModal(true);

    const handleUpdateAdmission = async (updatedData) => {
        try {
            await dispatch(updateAdmission({ admissionId: id, updatedData }));
            setShowEditModal(false);
            toast.success('Admission updated successfully');
            dispatch(fetchSingleAdmission(id));
        } catch (error) {
            toast.error('Failed to update admission');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    if (error) return <div className="max-w-6xl mx-auto p-6">Error: {error}</div>;
    if (!admission) return <div className="max-w-6xl mx-auto p-6">No admission found</div>;

    return (
        <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-start mb-6">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    ← Back to Admissions
                </button>
                {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') && (
                    <button 
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        <FaEdit /> Edit Admission
                    </button>
                )}
            </div>

            <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-white text-center">{admission.title}</h1>
                <p className="mt-2 text-white text-center">{admission.institute}</p>
            </div>

            {/* Main Details */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Location</h2>
                        <p className="text-gray-700 dark:text-gray-300">{admission.location}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Category</h2>
                        <p className="text-gray-700 dark:text-gray-300">{admission.category || "N/A"}</p>
                    </div>
                </div>
            </section>

                        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {admission.eligibility_criteria || "N/A"}
                </p>
            </section>

            {/* Description */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {admission.description || "N/A"}
                </p>
            </section>

            {/* Course & Fees */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Course</h2>
                        <p className="text-gray-700 dark:text-gray-300">{admission.course || "N/A"}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Fees</h2>
                        <p className="text-gray-700 dark:text-gray-300">{admission.fees || "N/A"}</p>
                    </div>
                </div>
            </section>

            {/* Eligibility */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {admission.eligibility_criteria || "N/A"}
                </p>
            </section>

            {/* Important Dates */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
                <ul className="space-y-3">
                    {[
                        ['Start Date', admission.start_date],
                        ['Last Date', admission.last_date],
                    ].map(([label, date], index) => (
                        <li
                            key={index}
                            className={`flex justify-between items-center ${index < 1 ? 'border-b pb-2 border-gray-200 dark:border-gray-700' : ''}`}
                        >
                            <span className="font-medium">{label}:</span>
                            <span>{formatDate(date)}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Keywords */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                    {admission.keywords?.length > 0 ? (
                        admission.keywords.map((keyword, index) => (
                            <span 
                                key={index}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                            >
                                {keyword}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No keywords specified</p>
                    )}
                </div>
            </section>

            {/* SEO Fields */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">SEO Fields</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">URL Slug</h3>
                        <p className="text-gray-700 dark:text-gray-300">{admission.slug || 'Not specified'}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Search Description</h3>
                        <p className="text-gray-700 dark:text-gray-300">{admission.searchDescription || 'Not provided'}</p>
                    </div>
                </div>
            </section>

            {/* Featured Badge */}
            {admission.is_featured && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Featured Admission
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <EditAdmissionModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    admission={admission}
                    admissionId={id}
                    onUpdate={handleUpdateAdmission}
                />
            )}
        </div>
    );    
};

export default AdmissionDetails;