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
import { fetchSingleScholarship } from '../store/slices/scholarshipSlice';
import './ScholarshipDetails.css';

const ScholarshipDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const scholarship = useSelector((state) => state.scholarships.scholarship);
    const loading = useSelector((state) => state.scholarships.loading);
    const error = useSelector((state) => state.scholarships.error);

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleScholarship(id));
        }
    }, [dispatch, id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="scholarship-details">
            <div className="back-navigation">
                <div className="back-link" onClick={handleBack}>
                    <FaArrowLeft />
                    <span>Back to Scholarships</span>
                </div>
            </div>
            
            <div className="container">
                <div className="content-wrapper">
                    {/* Header Section */}
                    <div className="header-section">
                        <h1 className="title">{scholarship?.title}</h1>
                        <h2 className="organization">{scholarship?.organization}</h2>
                    </div>

                    {/* Key Details Section */}
                    <div className="details-grid">
                        <div className="detail-item">
                            <FaGraduationCap className="icon" />
                            <span>{scholarship?.educationLevel || 'Eligibility criteria not specified'}</span>
                        </div>
                        <div className="detail-item">
                            <FaMapMarker className="icon" />
                            <span>{scholarship?.country}</span>
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            <span>Deadline: {scholarship?.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Not specified'}</span>
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            <span>Posted: {scholarship?.createdAt ? new Date(scholarship.createdAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="info-grid">
                        <div className="info-item">
                            <FaClock className="icon" />
                            <span>Duration: {scholarship?.duration}</span>
                        </div>
                        <div className="info-item">
                            <FaUniversity className="icon" />
                            <span>Type: {scholarship?.category}</span>
                        </div>
                        <div className="info-item">
                            <FaMoneyBill className="icon" />
                            <span>Amount: {scholarship?.amount}</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="description-section">
                        <h3>About the Scholarship</h3>
                        <p>{scholarship?.description}</p>
                        
                        <h4>Requirements</h4>
                        <ul className="requirements-list">
                            {scholarship?.requirements ? 
                                scholarship.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))
                                :
                                ['No specific requirements listed'].map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <a 
                            href={scholarship?.applicationLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="apply-button"
                        >
                            Apply Now
                        </a>
                        <button onClick={handleBack} className="more-scholarships">
                            View More Scholarships
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipDetails;
