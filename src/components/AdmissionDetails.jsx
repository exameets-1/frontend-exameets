import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaArrowLeft,
    FaGraduationCap,
    FaMapMarker,
    FaCalendar,
    FaClock,
    FaUniversity,
    FaMoneyBill 
} from 'react-icons/fa';
import { fetchSingleAdmission, resetAdmissionDetails } from '../store/slices/admissionSlice';
import { useTheme } from '../App';
import './AdmissionDetails.css';

const AdmissionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { darkMode } = useTheme();

    const admission = useSelector((state) => state.admissions.admission);
    const loading = useSelector((state) => state.admissions.loading);
    const error = useSelector((state) => state.admissions.error);

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleAdmission(id));
        }
        return () => {
            dispatch(resetAdmissionDetails());
        };
    }, [dispatch, id]);

    const handleBack = () => {
        navigate('/admissions');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    if (!admission) {
        return null;
    }

    return (
        <div className="admission-details">
            <div className="back-navigation">
                <div className="back-link" onClick={handleBack}>
                    <FaArrowLeft />
                    <span>Back to Admissions</span>
                </div>
            </div>
            
            <div className="container">
                <div className="content-wrapper">
                    {/* Header Section */}
                    <div className="header-section">
                        <h1 className={`title ${darkMode ? 'text-white' : 'text-gray-900'}`}>{admission.title}</h1>
                        <h2 className={`institution ${darkMode ? 'text-white' : 'text-gray-900'}`}>{admission.institution}</h2>
                    </div>

                    {/* Key Details Section */}
                    <div className="details-grid">
                        <div className="detail-item">
                            <FaGraduationCap className="icon" />
                            <span>{admission.eligibility || 'Eligibility criteria not specified'}</span>
                        </div>
                        <div className="detail-item">
                            <FaMapMarker className="icon" />
                            <span>
                                {admission?.location ? 
                                    `${admission.location.city}, ${admission.location.state}, ${admission.location.country}`
                                    : 'Location not specified'
                                }
                            </span>
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            <span>Start: {admission.startDate ? new Date(admission.startDate).toLocaleDateString() : 'Not specified'}</span>
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            <span>Last Date: {admission.applicationDeadline ? new Date(admission.applicationDeadline).toLocaleDateString() : 'Not specified'}</span>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="info-grid">
                        <div className="info-item">
                            <FaClock className="icon" />
                            <span>Duration: {admission.duration}</span>
                        </div>
                        <div className="info-item">
                            <FaUniversity className="icon" />
                            <span>Course Type: {admission.category}</span>
                        </div>
                        <div className="info-item">
                            <FaMoneyBill className="icon" />
                            <span>Fees: {admission.tuitionFee.domestic}</span>
                        </div>
                        <div className="info-item">
                            <FaCalendar className="icon" />
                            <span>Posted: {admission.createdAt ? new Date(admission.createdAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="description-section">
                        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About the Course</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{admission.description}</p>
                        
                        <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Requirements</h4>
                        <ul className="requirements-list">
                            {admission.requirements ? 
                                admission.requirements.map((req, index) => (
                                    <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{req}</li>
                                ))
                                :
                                ['No specific requirements listed'].map((req, index) => (
                                    <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{req}</li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <a 
                            href={admission.applicationLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`apply-button ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
                        >
                            Apply Now
                        </a>
                        <button onClick={handleBack} className={`more-admissions ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            View More Admissions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionDetails;
