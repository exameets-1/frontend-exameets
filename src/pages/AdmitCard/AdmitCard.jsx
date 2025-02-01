import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdmitCards, deleteAdmitCard, createAdmitCard } from '../../store/slices/admitCardSlice';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddAdmitCardModal from '../../components/AddAdmitCardModal/AddAdmitCardModal';
import Spinner from '../../components/Spinner';
import './AdmitCard.css';

const AdmitCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { admitCards, loading, error } = useSelector((state) => state.admitCards);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchAdmitCards());
    }, [dispatch]);

    const handleDeleteAdmitCard = async (admitCardId) => {
        if (window.confirm('Are you sure you want to delete this admit card?')) {
            const response = await dispatch(deleteAdmitCard(admitCardId));
            if (response.success) {
                toast.success('Admit Card deleted successfully');
            } else {
                toast.error(response.error || 'Error deleting admit card');
            }
        }
    };

    const handleAddAdmitCard = async (admitCardData) => {
        const result = await dispatch(createAdmitCard(admitCardData));
        if (!result.error) {
            toast.success('Admit Card added successfully!');
            setIsModalOpen(false);
        } else {
            toast.error(result.error || 'Error adding admit card');
        }
    };

    const handleViewDetails = (admitCardId) => {
        navigate(`/admitcard/get/${admitCardId}`);
    };

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="admit-cards-container">
            {isAuthenticated && user?.role === 'admin' && (
                <button 
                    className="add-admit-card-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Admit Card
                </button>
            )}
            <div className="admit-cards-grid">
                {admitCards?.map((admitCard) => (
                    <div key={admitCard._id} className="admit-card">
                        <div className="admit-card-header">
                            <h3>{admitCard.title}</h3>
                            {isAuthenticated && user?.role === 'admin' && (
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteAdmitCard(admitCard._id)}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <div className="admit-card-body">
                            <p className="organization">{admitCard.organization}</p>
                            <div className="dates">
                                <p>Exam Date: {new Date(admitCard.exam_date).toLocaleDateString()}</p>
                                <p>Registration: {new Date(admitCard.registration_start_date).toLocaleDateString()} - {new Date(admitCard.registration_end_date).toLocaleDateString()}</p>
                            </div>
                            <p className="description">{admitCard.description}</p>
                            <div className="admit-card-actions">
                                <button 
                                    onClick={() => handleViewDetails(admitCard._id)}
                                    className="view-details-button"
                                >
                                    View Details
                                </button>
                                <a 
                                    href={admitCard.download_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="download-link"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <AddAdmitCardModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddAdmitCard}
            />
        </div>
    );
};

export default AdmitCard;