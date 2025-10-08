import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ArrowLeft, Eye, User, Smartphone, Monitor } from 'lucide-react';
import { ViewOnlyTaskDetailsModal } from '../../modals/TaskModals/ViewOnlyTaskDetailsModal';
import { getUserTasks, clearViewingData, clearError } from '../../store/slices/taskSlice';
import { toast } from 'react-toastify';

export default function ViewUserTasks() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    viewingUser,
    viewingTasks,
    viewingTasksCount,
    error,
  } = useSelector(state => state.task);

  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch user's tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!isMobile && userId) {
        setInitialLoading(true);
        try {
          await dispatch(getUserTasks(userId)).unwrap();
        } catch (err) {
          toast.error(err || 'Failed to load user tasks');
        } finally {
          setInitialLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup when component unmounts
    return () => {
      dispatch(clearViewingData());
    };
  }, [dispatch, userId, isMobile]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Mobile Restriction Screen
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="relative mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Smartphone size={32} className="text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Desktop Only
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            The Tasks view page requires a desktop or laptop for optimal viewing experience.
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
            </ul>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsOpen(true);
  };

  const handleCloseTaskDetails = () => {
    setIsTaskDetailsOpen(false);
    setSelectedTaskId(null);
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
        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
            {task.title}
          </h3>
          <Eye size={14} className="text-gray-400 ml-2 flex-shrink-0" />
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs mb-2">
          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority && task.priority.toUpperCase()}
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

  // PropTypes for TaskCard component
  TaskCard.propTypes = {
    task: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      assignedTo: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        _id: PropTypes.string
      })),
      currentProgress: PropTypes.number
    }).isRequired,
    showStatus: PropTypes.bool
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User size={20} className="text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {viewingUser?.name || 'User'}&apos;s Tasks
                </h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Eye size={14} className="mr-1" />
                View-only mode • {viewingUser?.email}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Tasks: {viewingTasksCount?.total || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-hidden min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
          {/* Column 1: Not Started */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Not Started</h2>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {viewingTasksCount?.notStarted || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {viewingTasks?.notStarted && viewingTasks.notStarted.length > 0 ? (
                <div className="space-y-3">
                  {viewingTasks.notStarted.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">In Progress</h2>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {viewingTasksCount?.inProgress || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {viewingTasks?.inProgress && viewingTasks.inProgress.length > 0 ? (
                <div className="space-y-3">
                  {viewingTasks.inProgress.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h2>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {viewingTasksCount?.completed || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {viewingTasks?.completed && viewingTasks.completed.length > 0 ? (
                <div className="space-y-3">
                  {viewingTasks.completed.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Assigned to User */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned to Them</h2>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {viewingTasksCount?.assignedToUser || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {viewingTasks?.assignedToUser && viewingTasks.assignedToUser.length > 0 ? (
                <div className="space-y-3">
                  {viewingTasks.assignedToUser.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 5: Assigned to Others */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">They Assigned to Others</h2>
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {viewingTasksCount?.assignedToOthers || 0}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {viewingTasks?.assignedToOthers && viewingTasks.assignedToOthers.length > 0 ? (
                <div className="space-y-3">
                  {viewingTasks.assignedToOthers.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={true} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View-Only Task Details Modal */}
      <ViewOnlyTaskDetailsModal
        isOpen={isTaskDetailsOpen}
        onClose={handleCloseTaskDetails}
        taskId={selectedTaskId}
      />
    </div>
  );
}