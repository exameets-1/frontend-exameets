import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CancellationsAndRefunds = () => {
  const sections = [
    {
      title: "Donations are Voluntary",
      content: `• All donations made to Vitamin Job are entirely voluntary
• Users are not obligated to donate and can fully access the platform's features without making any contributions`
    },
    {
      title: "Non-Refundable Donations",
      content: `• Donations are considered final and non-refundable
• However, if you believe a refund request is necessary, you may contact us via the feedback form
• Refund inquiries will be reviewed on a case-by-case basis, and any decisions will be at the sole discretion of Vitamin Job`
    },
    {
      title: "Purpose of Donations",
      content: `• Donations are used exclusively for the development, maintenance, and enhancement of the website and its services
• A legal disclaimer ensures that funds are not used for any purposes beyond improving the platform`
    },
    {
      title: "Contact for Donation Inquiries",
      content: <span>
        • For any questions or concerns regarding donations, please reach out via the{' '}
        <Link to="/feedback" className="text-blue-600 hover:underline dark:text-blue-500">
          feedback form
        </Link>{' '}
        available on the website
        {"\n"}• We typically respond to inquiries within 24-48 hours
      </span>
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
              Cancellations & Refunds Policy
            </h1>
            
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              Effective Date: December 30, 2024
            </div>

            <div className="text-gray-600 dark:text-gray-300 mb-8">
              At Vitamin Job, we are committed to transparency and clarity regarding donations made to support our platform. Please read this policy carefully to understand the terms.
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

            <div className="mt-8 text-gray-600 dark:text-gray-300 text-center italic">
              Note: By making a donation, you agree to the terms outlined in this policy. Thank you for supporting Vitamin Job and contributing to its mission of empowering job seekers and learners.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds; 