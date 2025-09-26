import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployee } from '../../store/slices/employeeSlice';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const EditEmployeeModal = ({ isOpen, onClose, onSuccess, employee }) => {
    const initialFormData = {
        empId: '',
        name: '',
        photoUrl: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        active: true
    };

    const [formData, setFormData] = useState(initialFormData);
    const [uploading, setUploading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const { isAuthenticated} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // Populate form with employee data when modal opens
    useEffect(() => {
        if (employee && isOpen) {
            setFormData({
                empId: employee.empId || '',
                name: employee.name || '',
                photoUrl: employee.photoUrl || '',
                role: employee.role || '',
                department: employee.department || '',
                email: employee.email || '',
                phone: employee.phone || '',
                linkedin: employee.linkedin || '',
                github: employee.github || '',
                active: employee.active !== undefined ? employee.active : true
            });
            setHasChanges(false);
        }
    }, [employee, isOpen]);

    // Check if form has changes from original
    useEffect(() => {
        if (employee) {
            const hasChanged = 
                formData.empId !== (employee.empId || '') ||
                formData.name !== (employee.name || '') ||
                formData.photoUrl !== (employee.photoUrl || '') ||
                formData.role !== (employee.role || '') ||
                formData.department !== (employee.department || '') ||
                formData.email !== (employee.email || '') ||
                formData.phone !== (employee.phone || '') ||
                formData.linkedin !== (employee.linkedin || '') ||
                formData.github !== (employee.github || '') ||
                formData.active !== employee.active;
            setHasChanges(hasChanged);
        }
    }, [formData, employee]);

    // Check if all required fields are filled
    const isFormValid = () => {
        return (
            formData.empId.trim() !== '' &&
            formData.name.trim() !== '' &&
            formData.photoUrl.trim() !== '' &&
            formData.role.trim() !== '' &&
            formData.email.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
    };

    // Prevent form submission on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (files) {
            handleImageUpload(name, files[0]);
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = async (fieldName, file) => {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        uploadFormData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);

        try {
            const uploadUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`;
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                [fieldName]: data.secure_url
            }));
        } catch (error) {
            toast.error('Failed to upload image. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to update employee');
            return;
        }

        if (!isFormValid()) {
            toast.error('Please fill all required fields with valid data.');
            return;
        }

        if (!hasChanges) {
            toast.info('No changes detected');
            return;
        }

        try {
            // Transform data to match backend expectations
            const formattedData = {
                ...formData,
                empId: formData.empId.toUpperCase(), // Ensure consistent format
                email: formData.email.toLowerCase(), // Normalize email
            };

            await dispatch(updateEmployee(employee._id, formattedData));
            onSuccess();
        } catch (error) {
            toast.error(error.message || 'Failed to update employee');
        }
    };

    const handleClose = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Edit Employee - {employee?.name}
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Employee ID */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Employee ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="empId"
                                value={formData.empId}
                                onChange={handleChange}
                                required
                                placeholder="e.g., EMP001"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792] font-mono"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter employee's full name"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="employee@company.com"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* Role/Position */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Role/Position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Software Developer"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g., Engineering, HR, Marketing"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., +1234567890"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* Photo Upload */}
                        <div className="md:col-span-2 lg:col-span-3 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Profile Photo <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    name="photoUrl"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                                />
                                {formData.photoUrl && (
                                    <div className="flex items-center space-x-2">
                                        <img 
                                            src={formData.photoUrl} 
                                            alt="Current photo" 
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Current Photo</span>
                                    </div>
                                )}
                            </div>
                            {uploading && <p className="text-sm text-blue-500">Uploading photo...</p>}
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                LinkedIn Profile
                            </label>
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* GitHub */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                GitHub Profile
                            </label>
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005792]"
                            />
                        </div>

                        {/* Active Status */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#005792] bg-gray-100 border-gray-300 rounded focus:ring-[#005792] dark:focus:ring-[#005792] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Active Employee
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Change Indicator */}
                    {hasChanges && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                            <p className="text-amber-800 dark:text-amber-200 text-sm">
                                You have unsaved changes. Click &quot;Update Employee&ldquo; to save them.
                            </p>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                disabled={!isFormValid() || uploading || !hasChanges}
                                className={`px-6 py-2 rounded-lg transition-colors ${
                                    isFormValid() && !uploading && hasChanges
                                        ? 'bg-[#005792] text-white hover:bg-[#004579]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {uploading ? 'Uploading...' : 'Update Employee'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    employee: PropTypes.object.isRequired,
};

export default EditEmployeeModal;