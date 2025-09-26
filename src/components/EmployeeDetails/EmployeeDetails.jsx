import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaLinkedin, FaGithub, FaEdit, FaTrash, FaEnvelope, FaPhone, FaBuilding, FaIdBadge } from "react-icons/fa";
import { fetchSingleEmployee, deleteEmployee, clearEmployeeErrors } from "../../store/slices/employeeSlice";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import EditEmployeeModal from "../../modals/EditModals/EditEmployeeModal";

const EmployeeDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employee, loading, error } = useSelector((state) => state.employee);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleEmployee(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEmployeeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleBack = () => {
    navigate("/employees");
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      dispatch(deleteEmployee(id))
        .then(() => {
          toast.success("Employee deleted successfully");
          navigate("/employees");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete employee");
        });
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    // Refresh employee data
    dispatch(fetchSingleEmployee(id));
    toast.success("Employee updated successfully");
  };

  useEffect(() => {
    return () => {
      const savedScrollPosition = localStorage.getItem("employeeScrollPosition");
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          localStorage.removeItem("employeeScrollPosition");
        }, 0);
      }
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        An error occurred: {error}
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        No employee details found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button and Actions */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-bold">Back to Employees</span>
          </button>

          {/* Action Buttons for Admin/Manager */}
          {isAuthenticated && (user?.role === "admin" || user?.role === "manager") && (
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Main Employee Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          {/* Employee Header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left mb-8">
            <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
              <img
                src={employee.photoUrl}
                alt={employee.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-md"
                onError={(e) => {
                  e.target.src = '/api/placeholder/160/160';
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-center lg:justify-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-4">
                  {employee.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}>
                  {employee.active ? "Active" : "Inactive"}
                </span>
              </div>
              
              <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">{employee.role}</h2>

              {/* Employee Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaIdBadge className="mr-2 text-blue-500" />
                  <span className="font-mono font-bold">{employee.empId}</span>
                </div>

                {employee.department && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaBuilding className="mr-2 text-green-500" />
                    <span>{employee.department}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaEnvelope className="mr-2 text-red-500" />
                  <a 
                    href={`mailto:${employee.email}`} 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {employee.email}
                  </a>
                </div>

                {employee.phone && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaPhone className="mr-2 text-purple-500" />
                    <a 
                      href={`tel:${employee.phone}`} 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {employee.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {(employee.linkedin || employee.github) && (
                <div className="flex justify-center lg:justify-start space-x-6 mt-6">
                  {employee.linkedin && (
                    <a 
                      href={employee.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex flex-col items-center"
                    >
                      <FaLinkedin className="text-2xl mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">LinkedIn</span>
                    </a>
                  )}
                  
                  {employee.github && (
                    <a 
                      href={employee.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors flex flex-col items-center"
                    >
                      <FaGithub className="text-2xl mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">GitHub</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Employee Timeline */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Employee Information</h3>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p><strong>Employee ID:</strong> {employee.empId}</p>
                  <p><strong>Position:</strong> {employee.role}</p>
                  {employee.department && <p><strong>Department:</strong> {employee.department}</p>}
                  <p><strong>Status:</strong> {employee.active ? "Active" : "Inactive"}</p>
                  <p><strong>Joined:</strong> {new Date(employee.createdAt).toLocaleDateString()}</p>
                  {employee.updatedAt !== employee.createdAt && (
                    <p><strong>Last Updated:</strong> {new Date(employee.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a 
                      href={`mailto:${employee.email}`} 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {employee.email}
                    </a>
                  </p>
                  {employee.phone && (
                    <p>
                      <strong>Phone:</strong>{" "}
                      <a 
                        href={`tel:${employee.phone}`} 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {employee.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {(employee.linkedin || employee.github) && (
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Profiles</h3>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                    {employee.linkedin && (
                      <p>
                        <strong>LinkedIn:</strong>{" "}
                        <a 
                          href={employee.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                    {employee.github && (
                      <p>
                        <strong>GitHub:</strong>{" "}
                        <a 
                          href={employee.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          employee={employee}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;