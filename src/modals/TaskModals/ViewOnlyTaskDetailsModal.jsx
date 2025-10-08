import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { X, Calendar, User, Users, Clock, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { getTaskForViewing } from '../../store/slices/taskSlice';

export const ViewOnlyTaskDetailsModal = ({ isOpen, onClose, taskId }) => {
  const dispatch = useDispatch();
  const { viewOnlyTask, loading } = useSelector(state => state.task);

  useEffect(() => {
    if (isOpen && taskId) {
      dispatch(getTaskForViewing(taskId));
    }
  }, [isOpen, taskId, dispatch]);

  if (!isOpen) return null;

  const task = viewOnlyTask;

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block w-full max-w-5xl align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : task ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                      <Eye size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">View-Only Mode</h3>
                      <p className="text-sm text-blue-100">Task Details</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Title and Status */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {task.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {formatStatus(task.status)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  )}

                  {/* Task Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created By */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User size={16} className="text-gray-600 dark:text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Created By</h4>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">{task.createdBy?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{task.createdBy?.email}</p>
                    </div>

                    {/* Assigned To */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users size={16} className="text-gray-600 dark:text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Assigned To</h4>
                      </div>
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <div className="space-y-1">
                          {task.assignedTo.map((user) => (
                            <div key={user._id}>
                              <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">Not assigned</p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</h4>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Due at {new Date(task.dueDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    </div>

                    {/* Progress */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp size={16} className="text-gray-600 dark:text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</h4>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.currentProgress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-lg">
                          {task.currentProgress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Related To */}
                  {task.relatedTo && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Related To</h4>
                      <p className="text-gray-900 dark:text-white">{task.relatedTo}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {task.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{task.notes}</p>
                    </div>
                  )}

                  {/* Comments Section */}
                  {task.comments && task.comments.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Comments ({task.comments.length})
                        </h3>
                      </div>
                      
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {task.comments.map((comment, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {comment.user?.name || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {comment.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity Logs */}
                  {task.activityLogs && task.activityLogs.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock size={20} className="text-gray-600 dark:text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Activity Log
                        </h3>
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {task.activityLogs.map((log, index) => (
                          <div key={index} className="flex items-start space-x-3 text-sm">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-gray-700 dark:text-gray-300">
                                {log.changes?.message || 'Activity recorded'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(log.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Eye size={16} />
                    <span>Read-only view • No actions available</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">Task not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ViewOnlyTaskDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  taskId: PropTypes.string,
};