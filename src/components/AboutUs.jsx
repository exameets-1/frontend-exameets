import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="container">
            <div className="title">Welcome to Exameets</div>

            <div className="content">
                <p>
                    Welcome to Exameets - a platform dedicated to meeting the crucial needs of{' '}
                    <span className="highlight">students, job seekers, and career-driven individuals</span>.
                    Whether you're preparing for an exam or gearing up for an interview, Exameets provides
                    the necessary resources and connections to make each step easier.
                </p>

                <h2 className="section-title">Our Mission</h2>
                <p>
                    Exameets is designed to simplify the journey for students and professionals by creating
                    a comprehensive, end-to-end support system. We understand the multiple challenges faced,
                    from <span className="highlight">travel and preparation to accessing resources</span>.
                </p>
                <p>
                    We began as a website, but Exameets will soon launch an app, featuring a richer user
                    experience. As we scale, our services will cover:
                </p>
                <ul>
                    <li>Job updates and study materials</li>
                    <li>Travel essentials</li>
                    <li>E-commerce for exam-specific items</li>
                </ul>
                <p>
                    Our future plans include setting up an institute and university to meet the needs of
                    modern learners through hands-on, quality education.
                </p>

                <h2 className="section-title">Our Vision</h2>
                <p>
                    We envision Exameets as a{' '}
                    <span className="highlight">one-stop solution for success</span>, where students and
                    aspiring job seekers can find everything they need. Our goal is to create a future
                    where access to opportunities and resources is inclusive and seamless for all.
                </p>
                <p>
                    Exameets prioritizes exclusive support for women, empowering them to reach their
                    educational and professional goals with confidence and independence.
                </p>

                <h2 className="section-title">Why Choose Exameets?</h2>
                <ul>
                    <li>
                        <strong>Comprehensive Support & Independence:</strong> Make your academic and
                        professional journey secure and reliable, with a focus on empowering young women.
                    </li>
                    <li>
                        <strong>Vision for the Future:</strong> Exameets is committed to providing quality
                        education and excellent services to foster long-term success.
                    </li>
                </ul>
                <p>Join the revolution at Exameets, where all your academic and career needs are united in one place.</p>

                <div className="cta">
                    <button>Join Us Today</button>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;