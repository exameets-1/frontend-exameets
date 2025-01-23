import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const sections = [
    {
      title: "Introduction",
      content: "Welcome to www.vitaminjob.com. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully. If you do not agree, please refrain from using the platform."
    },
    {
      title: "Services Provided",
      content: `www.vitaminjob.com is a job portal offering:
1. Links to job applications.
2. Links to external courses from various platforms.
3. Downloadable roadmaps to assist users in preparing for specific topics in the tech field.

Users can apply for jobs and view courses without creating an account. However, registration and login are required to:
- Download roadmaps.
- Bookmark jobs for later.
- Star roadmaps for future reference.`
    },
    {
      title: "Eligibility",
      content: "To use our services, you must be at least 16 years old. By registering on www.vitaminjob.com, you confirm that you meet this age requirement."
    },
    {
      title: "Intellectual Property",
      content: "All content on www.vitaminjob.com, including roadmaps, text, graphics, and logos, is owned by www.vitaminjob.com. Users may download and use roadmaps for personal, educational, or non-commercial purposes. Sharing or modifying the content is allowed, but using it commercially or making major changes without prior consent is prohibited."
    },
    {
      title: "External Links",
      content: "Our platform contains links to external websites for job applications, courses, and other resources. These links are provided for convenience, and we are not responsible for the content, accuracy, or practices of third-party sites. If you encounter any issues with external links, please contact us via email, and we will take necessary actions promptly."
    },
    {
      title: "User Responsibilities",
      content: `By using www.vitaminjob.com, you agree to:
1. Provide accurate and up-to-date information when registering.
2. Use the platform only for lawful purposes.
3. Avoid engaging in fraudulent, malicious, or harmful activities.

You must not disrupt the platform's functionality or compromise the experience of other users.`
    },
    {
      title: "Privacy",
      content: <span>
        By using www.vitaminjob.com, you agree to the collection and use of your personal information as described in our <Link to="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-500">
                  Privacy Policy
                </Link>. Please read our Privacy Policy to understand how we protect and manage your data.
      </span>
    },
    {
      title: "Disclaimer and Limitation of Liability",
      content: "While www.vitaminjob.com strives to provide accurate and helpful information, we are not responsible for any damages, losses, or issues that may arise from using external job links, courses, or roadmaps provided on our platform. Users are encouraged to verify any information independently and use these resources at their own risk."
    },
    {
      title: "Roadmap Content",
      content: "Some roadmaps available on www.vitaminjob.com may have been sourced from external platforms. If you are the rightful owner of any content and believe it has been used without proper authorization, please contact us via email. Upon verification, the content will be removed promptly."
    },
    {
      title: "Governing Law and Jurisdiction",
      content: "These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of this platform will be subject to the exclusive jurisdiction of the courts in India. While the platform primarily targets users in India, it is accessible globally, and users from other regions must comply with their local laws."
    },
    {
      title: "Amendments to Terms",
      content: "www.vitaminjob.com reserves the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the updated Terms will take effect immediately upon posting. Users are encouraged to review the Terms periodically to stay informed of any changes."
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
              Terms and Conditions
            </h1>
            
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              Effective Date: December 30, 2024
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-gray-600 dark:text-gray-300 text-center">
              Thank you for using www.vitaminjob.com. If you have any questions or concerns, feel free to contact us at our official email address.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;