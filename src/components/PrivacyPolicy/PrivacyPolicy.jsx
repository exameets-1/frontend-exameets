import React from 'react';
import './PrivacyPolicy.css';
import useScrollToTop from '../../hooks/useScrollToTop';

const PrivacyPolicy = () => {
    useScrollToTop();
    return (
        <div className="body">
            <div className="privacy-policy-container">
                <h1 className="privacy-policy-title">Privacy Policy</h1>
                <p className="effective-date">Effective Date: 12 October 2024</p>
                <p className="last-updated">Last Updated: 01 December 2024</p>

                <p className="intro-text">
                    Exameets is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, 
                    and safeguard your personal information when you visit our website, {' '}
                    <a href="https://www.exameets.in" target="_blank" rel="noopener noreferrer">www.exameets.in</a>. 
                    By accessing or using our Website, you agree to the terms outlined in this Privacy Policy. 
                    If you do not agree, please refrain from using our Website.
                </p>

                <h2>1. Information We Collect</h2>
                <p>We may collect two types of information from you:</p>
                <ul>
                    <li><strong>a. Personal Information</strong> - Information you provide directly, such as:</li>
                    <ul>
                        <li>Name and DOB</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Address</li>
                        <li>Examination Details</li>
                    </ul>
                    <li><strong>b. Non-Personal Information</strong> - Information collected automatically, such as:</li>
                    <ul>
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Pages you visit on our Website</li>
                        <li>Date and time of your visit</li>
                    </ul>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul>
                    <li>To provide and maintain our Website.</li>
                    <li>To personalize your user experience.</li>
                    <li>To communicate with you, including sending updates and promotional materials.</li>
                    <li>To process payments or transactions.</li>
                    <li>To improve our Website and services through analytics.</li>
                    <li>To ensure security and prevent fraudulent activity.</li>
                </ul>

                <h2>3. Cookies and Tracking Technologies</h2>
                <p>We use cookies, web beacons, and other tracking technologies to enhance your browsing experience. 
                You can manage your cookie preferences through your browser settings.</p>

                <h2>4. Sharing Your Information</h2>
                <p>We do not sell or rent your personal information to third parties. However, we may share your information with:</p>
                <ul>
                    <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our Website.</li>
                    <li><strong>Legal Compliance:</strong> Authorities when required to comply with legal obligations.</li>
                    <li><strong>Business Transfers:</strong> In case of mergers, acquisitions, or sale of assets.</li>
                </ul>

                <h2>5. Data Security</h2>
                <p>We implement security measures to protect your personal information. However, no online system is 
                entirely secure, and we cannot guarantee complete protection.</p>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access and review your personal information.</li>
                    <li>Request corrections or updates to your data.</li>
                    <li>Opt-out of receiving promotional communications.</li>
                    <li>Delete your personal information (subject to applicable laws).</li>
                </ul>
                <p>To exercise these rights, please contact us at {' '}
                    <a href="mailto:exameets@gmail.com">exameets@gmail.com</a>
                </p>

                <h2>7. Third-Party Links</h2>
                <p>Our Website may contain links to third-party websites. We are not responsible for their privacy 
                practices. We encourage you to read their privacy policies.</p>

                <h2>8. Children's Privacy</h2>
                <p>Our Website is not directed at children under the age of 13, and we do not knowingly collect 
                information from children.</p>

                <h2>9. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with 
                the updated "Effective Date."</p>

                <h2>10. Contact Us</h2>
                <p>If you have questions about this Privacy Policy or our practices, please contact us at:</p>
                <p>
                    <strong>Exameets</strong><br />
                    Email: <a href="mailto:exameets@gmail.com">exameets@gmail.com</a><br />
                    Address: Andhra Pradesh & Karnataka, India
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;