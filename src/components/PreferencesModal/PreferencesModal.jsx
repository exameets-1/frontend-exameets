import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferences } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import './PreferencesModal.css';

const PreferencesModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        examNotifications: '',
        isStudying: '',
        educationLevel: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert isStudying to boolean
        const preferences = {
            ...formData,
            isStudying: formData.isStudying === 'yes',
            preferencesSet: true // Add this to indicate preferences are set
        };

        try {
            const result = await dispatch(updatePreferences(preferences)).unwrap();
            toast.success('Preferences updated successfully!');
            onClose(); // Close modal after successful update
        } catch (error) {
            console.error('Failed to update preferences:', error);
            toast.error(error || 'Failed to update preferences');
        }
    };

    return (
        <div className="preferences-modal-overlay">
            <div className="preferences-modal">
                <div className="content-container">
                    <h1>Get Notifications & Prepare</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="examNotifications">Select Exams/Jobs for Notifications</label>
                            <select 
                                id="examNotifications"
                                name="examNotifications"
                                value={formData.examNotifications}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select your preference</option>
                                <option value="govt-jobs">Government Jobs</option>
                                <option value="tech-jobs">Tech Jobs</option>
                                <option value="internships">Internships</option>
                                <option value="admissions">Admissions</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="isStudying">Are you currently studying?</label>
                            <select
                                id="isStudying"
                                name="isStudying"
                                value={formData.isStudying}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="educationLevel">Education Level</label>
                            <select
                                id="educationLevel"
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select your education level</option>
                                <option value="high-school">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="postgraduate">Postgraduate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-btn">Done</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;
