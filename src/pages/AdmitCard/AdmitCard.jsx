import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmitCards, deleteAdmitCard, createAdmitCard } from '../../store/slices/admitCardSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import Spinner from '../../components/Spinner/Spinner';
import AddAdmitCardModal from '../../modals/AddModals/AddAdmitCardModal'
import useDebouncedSearch from '../../hooks/useDebouncedSearch'; // Import the custom hook

const AdmitCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    searchKeyword, 
    setSearchKeyword, 
    debouncedSearchKeyword, 
    searchInputRef 
  } = useDebouncedSearch("", 500); // Use the custom hook

  const { admitCards, loading, error, totalPages } = useSelector((state) => state.admitCards);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Reset to the first page when searchKeyword or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchKeyword]);

  // Fetch admit cards whenever debouncedSearchKeyword, filters, or currentPage changes
  useEffect(() => {
    dispatch(fetchAdmitCards({
      searchKeyword: debouncedSearchKeyword,
      page: currentPage,
    })).then(() => {
      // Refocus the search bar after the search operation completes
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    });
  }, [dispatch, debouncedSearchKeyword, currentPage, searchInputRef]);

  const handleDeleteAdmitCard = async (admitCardId) => {
    if (window.confirm('Are you sure you want to delete this admit card?')) {
      const { payload } = await dispatch(deleteAdmitCard(admitCardId));
      if (!payload.error) {
        toast.success('Admit card deleted successfully');
      } else {
        toast.error(payload.error);
      }
    }
  };

  const handleAddAdmitCard = async (admitCardData) => {
    const { payload } = await dispatch(createAdmitCard(admitCardData));
    if (!payload.error) {
      toast.success('Admit card added successfully!');
      setIsModalOpen(false);
    } else {
      toast.error(payload.error);
    }
  };

  const handleViewDetails = (admitCardId) => {
    navigate(`/admitcards/get/${admitCardId}`);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {isAuthenticated && user?.role === 'admin' && (
          <button 
            className="mb-6 bg-[#015990] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Add Admit Card
          </button>
        )}

        <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
              Admit Cards
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search admit cards..."
                value={searchKeyword}
                onChange={handleSearch}
                ref={searchInputRef}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {admitCards?.length === 0 ? (
    <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
      No admit cards found matching your criteria. Try adjusting your filters or search term.
    </div>
  ) : (
    admitCards?.map((admitCard) => (
      <div 
        key={admitCard._id} 
        className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
      >
        {isAuthenticated && user?.role === 'admin' && (
          <button 
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
            onClick={() => handleDeleteAdmitCard(admitCard._id)}
          >
            <FaTrash className="w-5 h-5" />
          </button>
        )}
        {/* Title Section */}
        <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
          {admitCard.title}
        </h3>
        {/* Organization with Border */}
        <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
          {admitCard.organization}
        </div>
        {/* Content Section */}
        <div className="grid gap-2 mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Vacancies: {admitCard.vacancies}
          </div>
        </div>
        {/* Footer Section */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
          <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
            Admit Card
          </span>
          <button
            className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
            onClick={() => handleViewDetails(admitCard._id)}
          >
            View Details →
          </button>
        </div>
      </div>
    ))
  )}
</div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-8">
            <button
              className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className="text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>

            <button
              className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AddAdmitCardModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAdmitCard}
      />
    </div>
);
};

export default AdmitCards;