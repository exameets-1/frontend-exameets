import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAdmitCard } from "../../store/slices/admitCardSlice";
import Spinner from "../Spinner";
import "./AdmitCardDetails.css";

const AdmitCardDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { admitCard, loading, error } = useSelector((state) => state.admitCards);

    useEffect(() => {
        dispatch(fetchSingleAdmitCard(id));
    }, [dispatch, id]);

    if (loading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;
    if (!admitCard) return <div className="error-message">Admit card not found</div>;

    return (
        <div className="admit-card-details">
            <div className="admit-card-container">
                <h1>{admitCard.title}</h1>
                
                <div className="organization-info">
                    <h2>{admitCard.organization}</h2>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <h3>Exam Date</h3>
                        <p>{admitCard.exam_date}</p>
                    </div>

                    <div className="detail-item">
                        <h3>Registration Period</h3>
                        <p>
                            <span>Start: {admitCard.registration_start_date}</span>
                            <br />
                            <span>End: {admitCard.registration_end_date}</span>
                        </p>
                    </div>

                    <div className="detail-item">
                        <h3>Eligibility Criteria</h3>
                        <p>{admitCard.eligibility_criteria}</p>
                    </div>
                </div>

                <div className="description-section">
                    <h3>Description</h3>
                    <p>{admitCard.description}</p>
                </div>

                <div className="action-buttons">
                    <a 
                        href={admitCard.download_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-button"
                    >
                        Download Admit Card
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdmitCardDetails;