import React from 'react';
import './Community.css';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useScrollToTop from '../../hooks/useScrollToTop';

const Community = () => {
    useScrollToTop();
    return (
        <div className="c-body">
            <div className="container">
                <h1>Follow Us</h1>
                <p className="intro-text">Stay connected and up-to-date with the latest news and updates on Exameets by following us on:</p>

                <div className="right-side-media">
                    <a href="#"><FaWhatsapp className="social-icon" /></a>
                    <a href="#"><FaFacebook className="social-icon" /></a>
                    <a href="#"><FaInstagram className="social-icon" /></a>
                    <a href="#"><FaTwitter className="social-icon" /></a>
                    <a href="#"><FaLinkedin className="social-icon" /></a>
                </div>

                <hr className="divider" />

                <h2>Stay Updated!</h2>
                <p className="highlight-text">
                    <strong>Join Our Channels</strong><br />
                    Don't Miss Out on Important Notifications!
                </p>
                <p className="description-text">
                    At Exameets, we understand how crucial it is to stay informed about exam dates, 
                    job alerts, and other important announcements. Join our WhatsApp and Telegram 
                    channels to receive instant updates and ensure you never miss an opportunity!
                </p>

                <div className="section">
                    <h3>Join Us on WhatsApp</h3>
                    <p className="channel-description">
                        Stay connected with our WhatsApp channel for quick updates and notifications.
                    </p>
                    <a className="cta-button" href="https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41" target="_blank" rel="noopener noreferrer">
                        Click here to join our WhatsApp channel
                    </a>
                </div>

                <div className="section">
                    <h3>Join Us on Telegram</h3>
                    <p className="channel-description">
                        For in-depth discussions, resources, and alerts, join our Telegram channel.
                    </p>
                    <a className="cta-button" href="#" target="_blank" rel="noopener noreferrer">
                        Click here to join our Telegram channel
                    </a>
                </div>

                <hr className="divider" />

                <h3>How to Join</h3>
                <ol className="instructions-list">
                    <li><strong>Click the link:</strong> Use the buttons above to navigate to the respective channel.</li>
                    <li><strong>Follow the instructions:</strong> If prompted, follow the instructions on your app to complete the join process.</li>
                    <li><strong>Stay Engaged:</strong> Make sure to turn on notifications so you never miss an important update!</li>
                </ol>

                <hr className="divider" />

                <h2>Help Us Spread the Word!</h2>
                <p className="spread-word-text">
                    Know someone who could benefit from these updates? Share this page and encourage 
                    them to join our community!
                </p>
                <p className="motto"><strong>"Stay Informed. Stay Ahead."</strong></p>
            </div>
        </div>
    );
};

export default Community;
