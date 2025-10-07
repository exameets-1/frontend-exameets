import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  Calendar, 
  User, 
  Flag, 
  Building2, 
  Clock, 
  MessageSquare,
  Activity,
  Edit3,
  Trash2,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Send
} from 'lucide-react';
import {
  getSingleTask,
  updateTaskStatus,
  updateProgress,
  deleteTask,
  addComment,
  getComments,
  getActivityLogs,
  clearError,
  clearMessage
} from '../../store/slices/taskSlice';
import { toast } from 'react-toastify';

const TaskDetails = ({ isOpen, onClose, taskId, onTaskUpdate }) => {
  const dispatch = useDispatch();
  const { currentTask, comments, activityLogs, loading } = useSelector(state => state.task);
  
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'comments' | 'activity'
  const [newComment, setNewComment] = useState('');
  const [newProgress, setNewProgress] = useState(0);
  const [isEditingProgress, setIsEditingProgress] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      dispatch(getSingleTask(taskId));
      dispatch(getComments(taskId));
      dispatch(getActivityLogs(taskId));
    }
  }, [dispatch, isOpen, taskId]);

  useEffect(() => {
    if (currentTask) {
      setNewProgress(currentTask.currentProgress || 0);
    }
  }, [currentTask]);

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800 border-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffInHours = Math.abs(now - taskDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const isOverdue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId: currentTask._id, status: newStatus }));
      toast.success('Status updated successfully');
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleProgressUpdate = async () => {
    try {
      await dispatch(updateProgress({ taskId: currentTask._id, currentProgress: newProgress }));
      toast.success('Progress updated successfully');
      setIsEditingProgress(false);
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await dispatch(addComment({ taskId: currentTask._id, comment: newComment }));
      setNewComment('');
      dispatch(getComments(currentTask._id)); // Refresh comments
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await dispatch(deleteTask(currentTask._id));
        toast.success('Task deleted successfully');
        if (onTaskUpdate) onTaskUpdate();
        onClose();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (!isOpen || !currentTask) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {currentTask.title}
            </h2>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentTask.status)}`}>
                {currentTask.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(currentTask.priority)}`}>
                {currentTask.priority.toUpperCase()} PRIORITY
              </span>
              {isOverdue(currentTask.dueDate, currentTask.status) && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  OVERDUE
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 mr-8 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2 px-1 mr-8 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              Comments ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2 px-1 mr-8 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              {currentTask.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentTask.description}
                  </p>
                </div>
              )}

              {/* Task Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Building2 size={16} className="inline mr-2" />
                      Department
                    </label>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {currentTask.relatedTo?.replace('-', ' ')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar size={16} className="inline mr-2" />
                      Due Date
                    </label>
                    <p className={`${isOverdue(currentTask.dueDate, currentTask.status) ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                      {formatDate(currentTask.dueDate)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Clock size={16} className="inline mr-2" />
                      Created
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(currentTask.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <User size={16} className="inline mr-2" />
                      Assigned To
                    </label>
                    {currentTask.assignedTo && currentTask.assignedTo.length > 0 ? (
                      <div className="space-y-1">
                        {currentTask.assignedTo.map((user) => (
                          <p key={user._id} className="text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Not assigned</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Progress
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${currentTask.currentProgress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentTask.currentProgress}%
                      </span>
                      {!isEditingProgress ? (
                        <button
                          onClick={() => setIsEditingProgress(true)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit3 size={14} />
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newProgress}
                            onChange={(e) => setNewProgress(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                          <button
                            onClick={handleProgressUpdate}
                            className="text-green-600 hover:text-green-700 p-1"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingProgress(false);
                              setNewProgress(currentTask.currentProgress);
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {currentTask.completionDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <CheckCircle size={16} className="inline mr-2" />
                        Completed
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(currentTask.completionDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {currentTask.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {currentTask.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || loading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors text-sm"
                  >
                    <Send size={16} className="mr-2" />
                    Add Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No comments yet</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.user?.name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {comment.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activityLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Activity size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No activity logs</p>
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div key={log._id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <Activity size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {log.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatRelativeTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {currentTask.status !== 'completed' && (
              <>
                {currentTask.status === 'not_started' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  >
                    <PlayCircle size={16} className="mr-1" />
                    Start Task
                  </button>
                )}
                {currentTask.status === 'in_progress' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('review')}
                      className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors"
                    >
                      <Send size={16} className="mr-1" />
                      Submit for Review
                    </button>
                    <button
                      onClick={() => handleStatusChange('not_started')}
                      className="inline-flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                    >
                      <PauseCircle size={16} className="mr-1" />
                      Pause
                    </button>
                  </>
                )}
                {currentTask.status === 'review' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Mark Complete
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDeleteTask}
              className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  taskId: PropTypes.string,
  onTaskUpdate: PropTypes.func
};

export default TaskDetails;