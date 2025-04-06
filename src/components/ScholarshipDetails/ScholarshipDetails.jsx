import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaEdit
} from 'react-icons/fa';
import { fetchSingleScholarship, updateScholarship } from '../../store/slices/scholarshipSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';
import EditScholarshipModal from '../../modals/EditModals/EditScholarshipModal';

const ScholarshipDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const scholarship = useSelector((state) => state.scholarships.scholarship);
    const loading = useSelector((state) => state.scholarships.loading);
    const error = useSelector((state) => state.scholarships.error);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleScholarship(id));
        }
    }, [dispatch, id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const handleUpdateScholarship = async (updatedData) => {
        try {
            const result = await dispatch(updateScholarship({
                scholarshipId: id,
                updatedData
            })).unwrap();
            
            if (result) {
                toast.success('Scholarship updated successfully');
                setIsEditModalOpen(false);
                // Refresh scholarship data
                dispatch(fetchSingleScholarship(id));
            }
        } catch (error) {
            toast.error(error || 'Failed to update scholarship');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    if (error) return <div className="max-w-6xl mx-auto p-6">Error: {error}</div>;
    if (!scholarship) return <div className="max-w-6xl mx-auto p-6">No scholarship found</div>;

    return (
        <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-start mb-6">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    ← Back to Scholarships
                </button>
                {isAuthenticated && user?.role === 'admin' && (
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        onClick={handleEditClick}
                    >
                        <FaEdit /> Edit Scholarship
                    </button>
                )}
            </div>

            <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-white text-center">{scholarship.title}</h1>
                <p className="mt-2 text-white text-center">{scholarship.organization}</p>
            </div>

            {/* Scholarship Details */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Scholarship Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Qualification</h3>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.qualification || 'Not specified'}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Category</h3>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.category || 'Not specified'}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Amount</h3>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.amount || 'Not specified'}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Featured</h3>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.is_featured ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </section>

            {/* Description */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">About the Scholarship</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{scholarship.description}</p>
            </section>

            {/* Eligibility Criteria */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {scholarship.eligibility_criteria || 'No specific eligibility criteria listed'}
                </p>
            </section>

            {/* Keywords */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                    {scholarship.keywords && scholarship.keywords.length > 0 ? 
                        scholarship.keywords.map((keyword, index) => (
                            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                {keyword}
                            </span>
                        )) : 
                        <p className="text-gray-500 dark:text-gray-400">No keywords specified</p>
                    }
                </div>
            </section>

            {/* Important Dates */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
                <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 dark:text-gray-200">Start Date</p>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.start_date || 'Not specified'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 dark:text-gray-200">Last Date to Apply</p>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.last_date || 'Not specified'}</p>
                    </div>
                </div>
            </section>

            {/* How to Apply */}
            <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">How to Apply</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <a
                        href={scholarship.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Apply Now
                    </a>
                </div>
            </section>

            {/* SEO Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">SEO Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Search Description</h3>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.searchDescription || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">URL Slug</h3>
                        <p className="text-gray-700 dark:text-gray-300">{scholarship.slug || 'Not specified'}</p>
                    </div>
                </div>
            </section>

            {/* Edit Modal */}
            {isAuthenticated && user?.role === 'admin' && (
                <EditScholarshipModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleUpdateScholarship}
                    scholarship={scholarship}
                />
            )}
        </div>
    );
};

export default ScholarshipDetails;