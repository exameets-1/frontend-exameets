import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Smartphone, Monitor, Users, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { CreateTaskModal } from '../../modals/TaskModals/CreateTaskModal';
import { TaskDetailsModal } from '../../modals/TaskModals/TaskDetailsModal';
import { 
  getNotStartedTasks,
  getInProgressTasks,
  getCompletedTasks,
  getTasksAssignedToMe,
  getTasksAssignedToOthers,
  clearError, 
  clearMessage 
} from '../../store/slices/taskSlice';
import { toast } from 'react-toastify';

export default function Tasks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const { 
    notStartedTasks,
    inProgressTasks,
    completedTasks,
    assignedToMeTasks,
    assignedToOthersTasks,
    loading, 
    error, 
    message,
  } = useSelector(state => state.task);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Admin users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAdminsDropdown, setShowAdminsDropdown] = useState(false);

  // Fetch admins function
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/admins`,
        { withCredentials: true }
      );
      setUsers(data.admins || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      toast.error('Failed to fetch admin users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all column data and admins on mount
  useEffect(() => {
    if (!isMobile) {
      const fetchData = async () => {
        setInitialLoading(true);
        try {
          await Promise.all([
            dispatch(getNotStartedTasks()),
            dispatch(getInProgressTasks()),
            dispatch(getCompletedTasks()),
            dispatch(getTasksAssignedToMe()),
            dispatch(getTasksAssignedToOthers())
          ]);
          // Fetch admins for the dropdown
          await fetchUsers();
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchData();
    }
  }, [dispatch, isMobile]);

  // Handle success/error messages
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [message, error, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mobile Restriction Screen
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="relative mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Smartphone size={32} className="text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Desktop Only
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            The Tasks page is optimized for desktop use with multiple columns and complex interactions. 
            Please access this page from a desktop or laptop computer for the best experience.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Monitor size={16} className="mr-2" />
              Features requiring desktop:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                5-column kanban board layout
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Multi-panel task details
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Complex task creation forms
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              💡 <strong>Tip:</strong> Switch to desktop mode in your browser or use a computer
            </p>
            <p>
              Minimum screen width required: <strong>768px</strong>
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="mt-6 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    refreshAllColumns();
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsOpen(true);
  };

  const handleCloseTaskDetails = () => {
    setIsTaskDetailsOpen(false);
    setSelectedTaskId(null);
  };

  const handleTaskUpdate = () => {
    refreshAllColumns();
  };

  const refreshAllColumns = () => {
    dispatch(getNotStartedTasks());
    dispatch(getInProgressTasks());
    dispatch(getCompletedTasks());
    dispatch(getTasksAssignedToMe());
    dispatch(getTasksAssignedToOthers());
  };

  const handleViewUserTasks = (userId) => {
    navigate(`/tasks/view/${userId}`);
    setShowAdminsDropdown(false);
  };

  // Task Card Component
  const TaskCard = ({ task, showStatus = false }) => {
    const getPriorityColor = (priority) => {
      const colors = {
        low: 'text-green-600 dark:text-green-400',
        medium: 'text-yellow-600 dark:text-yellow-400',
        high: 'text-red-600 dark:text-red-400'
      };
      return colors[priority] || 'text-gray-600';
    };

    const getStatusColor = (status) => {
      const colors = {
        not_started: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        in_progress: 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200',
        review: 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200',
        completed: 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatStatus = (status) => {
      return status.replace('_', ' ').toUpperCase();
    };

    return (
      <div
        onClick={() => handleTaskClick(task._id)}
        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 flex-shrink-0"
      >
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs mb-2">
          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {showStatus && (
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {formatStatus(task.status)}
            </span>
          </div>
        )}

        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
            Assigned: {task.assignedTo.map(u => u.name).join(', ')}
          </div>
        )}
        
        {task.currentProgress > 0 && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{task.currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${task.currentProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  TaskCard.propTypes = {
    task: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      currentProgress: PropTypes.number,
      status: PropTypes.string.isRequired,
      assignedTo: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })),
    }).isRequired,
    showStatus: PropTypes.bool,
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Every Task is managed from here
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* View Other Admins Tasks Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowAdminsDropdown(!showAdminsDropdown)}
                disabled={loadingUsers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Users size={20} className="mr-2" />
                View Other Admins Tasks
                <ChevronDown 
                  size={16} 
                  className={`ml-2 transition-transform ${showAdminsDropdown ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {showAdminsDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {loadingUsers ? (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Loading admins...
                      </div>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => handleViewUserTasks(user._id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No admin users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Create Task Button */}
            <button
              onClick={handleCreateTask}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} className="mr-2" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Fixed Height with Scrollable Columns */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-hidden min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
          {/* Column 1: Not Started */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Not Started
                </h2>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {notStartedTasks?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {notStartedTasks && notStartedTasks.length > 0 ? (
                <div className="space-y-3">
                  {notStartedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={false} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No tasks</p>
                    <p className="text-xs mt-1">Tasks will appear here when available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  In Progress
                </h2>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {inProgressTasks?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {inProgressTasks && inProgressTasks.length > 0 ? (
                <div className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={false} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No tasks</p>
                    <p className="text-xs mt-1">Tasks will appear here when available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Completed
                </h2>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {completedTasks?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {completedTasks && completedTasks.length > 0 ? (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={false} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No tasks</p>
                    <p className="text-xs mt-1">Tasks will appear here when available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Assigned to Me */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assigned to Me
                </h2>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {assignedToMeTasks?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {assignedToMeTasks && assignedToMeTasks.length > 0 ? (
                <div className="space-y-3">
                  {assignedToMeTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={false} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No tasks</p>
                    <p className="text-xs mt-1">Tasks will appear here when available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 5: Assigned to Others */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assigned to Others
                </h2>
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {assignedToOthersTasks?.length || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {assignedToOthersTasks && assignedToOthersTasks.length > 0 ? (
                <div className="space-y-3">
                  {assignedToOthersTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={true} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No tasks</p>
                    <p className="text-xs mt-1">Tasks will appear here when available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
      />
      
      <TaskDetailsModal
        isOpen={isTaskDetailsOpen}
        onClose={handleCloseTaskDetails}
        taskId={selectedTaskId}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}