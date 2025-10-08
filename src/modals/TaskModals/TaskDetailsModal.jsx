import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, Calendar, User, Building2, FileText, 
  MessageSquare, Clock, CheckCircle, Trash2, Send, AlertCircle
} from 'lucide-react';
import { 
  getSingleTask, 
  updateProgress, 
  submitForReview, 
  approveTask,
  requestChanges,
  addComment,
  deleteTask,
  clearCurrentTask
} from '../../store/slices/taskSlice';

export const TaskDetailsModal = ({ isOpen, onClose, taskId, onTaskUpdate }) => {
  const dispatch = useDispatch();
  const { currentTask, loading } = useSelector(state => state.task);
  const { user } = useSelector(state => state.user);

  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showRequestChanges, setShowRequestChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'activity'
  const [submittingAction, setSubmittingAction] = useState(null);

  // Fetch task details when modal opens
  useEffect(() => {
    if (isOpen && taskId) {
      dispatch(getSingleTask(taskId));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [isOpen, taskId, dispatch]);

  // Update progress state when task loads
  useEffect(() => {
    if (currentTask) {
      setProgress(currentTask.currentProgress || 0);
    }
  }, [currentTask]);

  const isCreator = currentTask?.createdBy?._id === user?._id;
  const isAssignee = currentTask?.assignedTo?.some(u => u._id === user?._id);

  const handleProgressUpdate = async () => {
    if (progress === currentTask.currentProgress) return;
    
    setSubmittingAction('progress');
    const result = await dispatch(updateProgress({ taskId, currentProgress: progress }));
    if (updateProgress.fulfilled.match(result)) {
      onTaskUpdate?.();
    }
    setSubmittingAction(null);
  };

  const handleSubmitForReview = async () => {
    setSubmittingAction('review');
    const result = await dispatch(submitForReview(taskId));
    if (submitForReview.fulfilled.match(result)) {
      onTaskUpdate?.();
    }
    setSubmittingAction(null);
  };

  const handleApprove = async () => {
    setSubmittingAction('approve');
    const result = await dispatch(approveTask(taskId));
    if (approveTask.fulfilled.match(result)) {
      onTaskUpdate?.();
    }
    setSubmittingAction(null);
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) return;
    
    setSubmittingAction('requestChanges');
    const result = await dispatch(requestChanges({ taskId, feedback: feedback.trim() }));
    if (requestChanges.fulfilled.match(result)) {
      setFeedback('');
      setShowRequestChanges(false);
      onTaskUpdate?.();
    }
    setSubmittingAction(null);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const result = await dispatch(addComment({ taskId, comment: comment.trim() }));
    if (addComment.fulfilled.match(result)) {
      setComment('');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setSubmittingAction('delete');
    const result = await dispatch(deleteTask(taskId));
    if (deleteTask.fulfilled.match(result)) {
      onTaskUpdate?.();
      handleClose();
    }
    setSubmittingAction(null);
  };

  const handleClose = () => {
    setProgress(0);
    setComment('');
    setFeedback('');
    setShowRequestChanges(false);
    setActiveTab('details');
    setSubmittingAction(null);
    onClose();
  };

  if (!isOpen) return null;

  if (loading && !currentTask) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!currentTask) return null;

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
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      review: 'In Review',
      completed: 'Completed'
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentTask.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(currentTask.status)}`}>
                  {getStatusLabel(currentTask.status)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(currentTask.priority)}`}>
                  {currentTask.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Description */}
              {currentTask.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FileText size={16} className="inline mr-2" />
                    Description
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {currentTask.description}
                  </p>
                </div>
              )}

              {/* Task Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 size={16} className="inline mr-2" />
                    Department
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">
                    {currentTask.relatedTo?.replace(/-/g, ' ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Due Date
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(currentTask.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User size={16} className="inline mr-2" />
                    Created By
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {currentTask.createdBy?.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User size={16} className="inline mr-2" />
                    Assigned To
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {currentTask.assignedTo?.map(u => u.name).join(', ') || 'Unassigned'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {currentTask.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {currentTask.notes}
                  </p>
                </div>
              )}

              {/* Progress Update */}
              {(isCreator || isAssignee) && currentTask.status !== 'completed' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Update Progress
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white w-16 text-right">
                      {progress}%
                    </span>
                    <button
                      onClick={handleProgressUpdate}
                      disabled={progress === currentTask.currentProgress || submittingAction === 'progress'}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                    >
                      {submittingAction === 'progress' ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Request Changes Form */}
              {showRequestChanges && (
                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2 flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    Request Changes
                  </h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Explain what changes are needed..."
                    rows={3}
                    className="w-full px-3 py-2 border border-orange-300 dark:border-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white resize-none mb-3"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowRequestChanges(false);
                        setFeedback('');
                      }}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRequestChanges}
                      disabled={!feedback.trim() || submittingAction === 'requestChanges'}
                      className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                    >
                      {submittingAction === 'requestChanges' ? 'Requesting...' : 'Request Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Submit for Review - Only assignees can submit (and only if they're not the creator) */}
                {isAssignee && !isCreator && currentTask.status !== 'completed' && currentTask.status !== 'review' && (
                  <button
                    onClick={handleSubmitForReview}
                    disabled={submittingAction === 'review'}
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white rounded-lg transition-colors"
                  >
                    <Send size={16} className="mr-2" />
                    {submittingAction === 'review' ? 'Submitting...' : 'Submit for Review'}
                  </button>
                )}

                {/* Creator Actions */}
                {isCreator && currentTask.status !== 'completed' && (
                  <>
                    {/* If task has no assignees OR only assigned to creator, show direct complete button */}
                    {(!currentTask.assignedTo || currentTask.assignedTo.length === 0 || 
                      (currentTask.assignedTo.length === 1 && currentTask.assignedTo[0]._id === user._id)) && (
                      <button
                        onClick={handleApprove}
                        disabled={submittingAction === 'approve'}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        {submittingAction === 'approve' ? 'Completing...' : 'Mark as Complete'}
                      </button>
                    )}

                    {/* If task has assignees (other than creator) and status is 'review', show approve/request changes */}
                    {currentTask.assignedTo && currentTask.assignedTo.length > 0 && 
                     !currentTask.assignedTo.every(assignee => assignee._id === user._id) && 
                     currentTask.status === 'review' && (
                      <>
                        <button
                          onClick={handleApprove}
                          disabled={submittingAction === 'approve'}
                          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-colors"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          {submittingAction === 'approve' ? 'Approving...' : 'Approve & Complete'}
                        </button>
                        
                        <button
                          onClick={() => setShowRequestChanges(!showRequestChanges)}
                          className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                        >
                          <AlertCircle size={16} className="mr-2" />
                          Request Changes
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Informational message for creator when waiting for assignees */}
                {isCreator && currentTask.assignedTo && currentTask.assignedTo.length > 0 && 
                 !currentTask.assignedTo.every(assignee => assignee._id === user._id) && 
                 currentTask.status !== 'review' && currentTask.status !== 'completed' && (
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
                    <Clock size={16} className="mr-2" />
                    {currentTask.status === 'not_started' 
                      ? 'Waiting for assignee to start work'
                      : 'Waiting for assignee to submit for review'
                    }
                  </div>
                )}

                {/* Delete Task - Only creator can delete */}
                {isCreator && (
                  <button
                    onClick={handleDelete}
                    disabled={submittingAction === 'delete'}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg transition-colors ml-auto"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {submittingAction === 'delete' ? 'Deleting...' : 'Delete Task'}
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <MessageSquare size={18} className="inline mr-2" />
                  Comments ({currentTask.comments?.length || 0})
                </h3>

                {/* Add Comment Form */}
                {(isCreator || isAssignee) && (
                  <form onSubmit={handleAddComment} className="mb-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!comment.trim() || loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                )}

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {currentTask.comments && currentTask.comments.length > 0 ? (
                    currentTask.comments.map((c) => (
                      <div key={c._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {c.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(c.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-900 dark:text-gray-100 text-sm whitespace-pre-wrap">
                          {c.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                      No comments yet
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Activity Tab */
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <Clock size={18} className="inline mr-2" />
                Activity Log
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {currentTask.activityLogs && currentTask.activityLogs.length > 0 ? (
                  currentTask.activityLogs.map((log, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {log.changes?.message || log.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    No activity yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  taskId: PropTypes.string,
  onTaskUpdate: PropTypes.func,
};