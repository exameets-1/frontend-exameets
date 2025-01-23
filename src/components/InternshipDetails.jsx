// InternshipDetails.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaArrowLeft, 
    FaGraduationCap, 
    FaMapMarker, 
    FaCalendar, 
    FaClock, 
    FaBriefcase, 
    FaMoneyBill 
} from 'react-icons/fa';
import { fetchSingleInternship } from '../store/slices/internshipSlice';
import './InternshipDetails.css';

const InternshipDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const internship = useSelector((state) => state.internships.internship);
    const loading = useSelector((state) => state.internships.loading);
    const error = useSelector((state) => state.internships.error);

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleInternship(id));
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
        <div className="internship-details">
            <div className="back-navigation">
                <div className="back-link" onClick={handleBack}>
                    <FaArrowLeft />
                    <span>Back to Internships</span>
                </div>
            </div>
            
            <div className="container">
                <div className="content-wrapper">
                    {/* Header Section */}
                    <div className="header-section">
                        <h1 className="title">{internship?.internship_type}</h1>
                        <h2 className="company">{internship?.organization}</h2>
                    </div>

                    {/* Key Details Section */}
                    <div className="details-grid">
                        <div className="detail-item">
                            <FaGraduationCap className="icon" />
                            <span>{internship?.eligibility_criteria || 'Strong command of English language'}</span>
                        </div>
                        <div className="detail-item">
                            <FaMapMarker className="icon" />
                            <span>{internship?.location || 'Delhi, India'}</span>
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            <span>Start: {internship?.start_date ? new Date(internship.start_date).toLocaleDateString() : '3/1/2025'}</span>
                        </div>
                        <div className="detail-item">
                            <FaCalendar className="icon" />
                            <span>Last Date: {internship?.last_date ? new Date(internship.last_date).toLocaleDateString() : '2/20/2025'}</span>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="info-grid">
                        <div className="info-item">
                            <FaClock className="icon" />
                            <span>Duration: {internship?.duration || '2 months'}</span>
                        </div>
                        <div className="info-item">
                            <FaBriefcase className="icon" />
                            <span>Type: {internship?.type || 'On-site'}</span>
                        </div>
                        <div className="info-item">
                            <FaMoneyBill className="icon" />
                            <span>Stipend: {internship?.stipend || '3000 INR/month'}</span>
                        </div>
                        <div className="info-item">
                            <FaCalendar className="icon" />
                            <span>Posted: {internship?.createdAt ? new Date(internship.createdAt).toLocaleDateString() : '2 days ago'}</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="description-section">
                        <h3>About the Internship</h3>
                        <p>{internship?.description || 'Learn and contribute to writing SEO-friendly articles for various platforms.'}</p>
                        
                        <h4>Required Skills</h4>
                        <ul className="skills-list">
                            {internship?.skills_required ? 
                                internship.skills_required.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))
                                :
                                ['Content Writing', 'SEO', 'English Proficiency', 'Research'].map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <a 
                            href={internship?.application_link || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="apply-button"
                        >
                            Apply Now
                        </a>
                        <button onClick={handleBack} className="more-internships">
                            View More Internships
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetails;