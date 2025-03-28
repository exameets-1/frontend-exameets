import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'; // Import PropTypes

const AddATeamMemberModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        name: '',
        image: '',
        position: '',
        description: '',
        strengths: '',
        duration: '',
        linkedin: '',
        github: '',
        certificates: []
    };

    const [formData, setFormData] = useState(initialFormData);
    const [currentCertificate, setCurrentCertificate] = useState('');
    const [uploading, setUploading] = useState(false); // State for upload status
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            handleImageUpload(name, files[0]); // Handle image upload
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = async (fieldName, file) => {
        setUploading(true);
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
            setFormData(prev => ({
                ...prev,
                [fieldName]: data.secure_url // Save the Cloudinary URL in the form data
            }));
        } catch {
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleArrayAdd = async () => {
        if (!currentCertificate) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', currentCertificate);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`;
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to upload certificate');
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                certificates: [...prev.certificates, data.secure_url]
            }));
            setCurrentCertificate(null); // Reset to null instead of empty string
        } catch {
            alert('Failed to upload certificate. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleArrayRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            certificates: prev.certificates.filter((_, i) => i !== index)
        }));
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            handleLogin();
            return;
        }

        const formattedData = {
            ...formData,
            postedBy: user._id
        };

        onSubmit(formattedData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Team Member</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name and Position */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter member's full name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                placeholder="Enter member's position"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
                        </div>

                        {/* Duration with Company */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Duration with Company</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="eg: 2 years"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* LinkedIn and GitHub */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                required
                                placeholder="Enter LinkedIn URL"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                required
                                placeholder="Enter GitHub URL"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description and Strengths */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter member's description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Key Strengths</label>
                            <textarea
                                name="strengths"
                                value={formData.strengths}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Enter member's strengths/skills"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                        </div>

                        {/* Certificates */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium">Certifications</label>
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCurrentCertificate(e.target.files[0])}
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    type="button"
                                    className={`bg-blue-500 text-white p-2 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                    onClick={handleArrayAdd}
                                    disabled={uploading}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.certificates.map((cert, index) => (
                                    <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                        <a href={cert} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            Certificate {index + 1}
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleArrayRemove(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {uploading && (
                                <p className="mt-2 text-sm text-blue-500">Uploading certificate...</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            {isAuthenticated && user?.role === 'manager' ? (
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Team Member
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Login to Add
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddATeamMemberModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Validate isOpen as a required boolean
    onClose: PropTypes.func.isRequired, // Validate onClose as a required function
    onSubmit: PropTypes.func.isRequired, // Validate onSubmit as a required function
};

export default AddATeamMemberModal;