import { useState, useEffect } from 'react';
import './ContactUs.css';
import emailjs from '@emailjs/browser';
import useScrollToTop from '../../hooks/useScrollToTop';

const ContactUs = () => {
    useScrollToTop();

    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        suggestion: '',
        screenshot: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);

        try {
            const uploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`;
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let screenshotUrl = '';
            if (formData.screenshot) {
                try {
                    screenshotUrl = await uploadToCloudinary(formData.screenshot);
                } catch (error) {
                    setMessage('Failed to upload image. Please try again or submit without an image.');
                    setLoading(false);
                    return;
                }
            }

            const templateParams = {
                name: formData.name,
                email: formData.email || 'Not provided',
                suggestion: formData.suggestion,
                screenshot: screenshotUrl || ''
            };


            const response = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams
            );


            if (response.status === 200) {
                setMessage('Thank you for your feedback!');
                setFormData({
                    name: '',
                    email: '',
                    suggestion: '',
                    screenshot: null
                });
                // Clear the file input
                const fileInput = document.getElementById('screenshot');
                if (fileInput) fileInput.value = '';
            }
        } catch (error) {
            setMessage('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            {/* Introduction Section */}
            <section className="contact-section">
                <h2 className="section-title">We're here to help!</h2>
                <p className="section-description">
                    If you have any questions, feedback, or inquiries, feel free to reach out to us. 
                    We'd love to hear from you.
                </p>
                
                <h3 className="subsection-title">Contact us at:</h3>
                <p className="contact-info">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:exameets@gmail.com">exameets@gmail.com</a>
                </p>
                <p className="contact-info">
                    <strong>Phone:</strong>{' '}
                    <a href="tel:+916302089490">+91 6302089490</a>
                </p>
                
                <hr className="divider" />
                
                <h3 className="subsection-title">Office Address:</h3>
                <p className="address">
                    Exameets HQ      (Mon - Fri, 9 AM - 6 PM)<br />
                    Kadapa,<br />
                    Andhra Pradesh,<br />
                    India - 516003.
                </p>
            </section>
      
            {/* Suggestions Section */}
            <section className="contact-section">
                <h2 className="section-title">Your Feedback Matters!</h2>
                <p className="section-description">
                    At Exameets, we continuously strive to improve and offer the best experience 
                    for students, job seekers, and exam aspirants. We value your feedback and 
                    suggestions.
                </p>
                
                {/* Feedback Form */}
                <form onSubmit={handleSubmit} className="feedback-form">
                    {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="name">Name: <span className="required">*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="(Optional)"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="suggestion">Your Suggestion: <span className="required">*</span></label>
                        <textarea
                            id="suggestion"
                            name="suggestion"
                            placeholder="Tell us what you think!"
                            rows="4"
                            value={formData.suggestion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="screenshot">Upload Screenshot (optional):</label>
                        <input
                            type="file"
                            id="screenshot"
                            name="screenshot"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Submit Feedback'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default ContactUs;