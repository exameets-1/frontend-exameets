import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaWhatsapp, FaFacebook, FaLinkedin, FaLink } from 'react-icons/fa';

const ShareModal = ({ isOpen = false, onClose, postId, title }) => {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/posts/${postId}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareUrl) + " " + encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Share Post</h3>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <FaWhatsapp className="text-2xl mb-1" />
            <span className="text-sm">Whatsapp</span>
          </a>
          
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <FaFacebook className="text-2xl mb-1" />
            <span className="text-sm">Facebook</span>
          </a>
          
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-600 hover:text-blue-700"
          >
            <FaLinkedin className="text-2xl mb-1" />
            <span className="text-sm">LinkedIn</span>
          </a>
          
          <button
            onClick={copyToClipboard}
            className="flex flex-col items-center text-gray-600 hover:text-green-500"
          >
            <FaLink className="text-2xl mb-1" />
            <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ShareModal;