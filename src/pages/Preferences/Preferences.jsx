import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updatePreferences } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import './Preferences.css';

const Preferences = () => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
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
        
        if (!formData.examNotifications || !formData.isStudying || !formData.educationLevel) {
            toast.error('Please fill in all fields');
            return;
        }

        // Convert isStudying to boolean
        const preferences = {
            ...formData,
            isStudying: formData.isStudying === 'yes'
        };

        try {
            dispatch(updatePreferences(preferences));
            toast.success('Preferences updated successfully!');
            navigateTo('/'); // Navigate to home after successful update
        } catch (error) {
            console.error('Failed to update preferences:', error);
            toast.error('Failed to update preferences. Please try again.');
        }
    };

    return (
        <div className="preferences-page">
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
                            <option value="" disabled>Select an option</option>
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
                            <option value="" disabled>Select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="educationLevel">Select your education level</label>
                        <select
                            id="educationLevel"
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="high-school">High School</option>
                            <option value="undergraduate">Undergraduate</option>
                            <option value="postgraduate">Postgraduate</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="button-container">
                        <button type="submit" className="submit-button">Done</button>
                    </div>
                </form>

                <div className="quote">focus. prepare. succeed.</div>
            </div>
        </div>
    );
};

export default Preferences;
