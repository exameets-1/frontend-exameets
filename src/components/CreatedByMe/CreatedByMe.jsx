import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { getCreatedByMe } from '../../store/slices/taskSlice';

const CreatedByMe = ({ onTaskClick }) => {
  const dispatch = useDispatch();
  const { createdTasks, loading } = useSelector(state => state.task);

  useEffect(() => {
    dispatch(getCreatedByMe());
  }, [dispatch]);

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
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Created by Me
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Created by Me
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {createdTasks.length} tasks
        </span>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {createdTasks.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tasks created
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven&rsquo;t created any tasks yet.
            </p>
          </div>
        ) : (
          createdTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => onTaskClick && onTaskClick(task)}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1 mr-2">
                  {task.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Priority and Due Date */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
                <div className={`flex items-center ${isOverdue(task.dueDate, task.status) ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Calendar size={12} className="mr-1" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue(task.dueDate, task.status) && (
                    <span className="ml-1 text-red-600 font-medium">OVERDUE</span>
                  )}
                </div>
              </div>

              {/* Assigned Users */}
              {task.assignedTo && task.assignedTo.length > 0 && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <Users size={12} className="mr-1" />
                  <span>
                    Assigned to {task.assignedTo.length} user{task.assignedTo.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Progress Bar */}
              {task.currentProgress > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{task.currentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${task.currentProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status Icon */}
              <div className="flex justify-end mt-2">
                {task.status === 'completed' && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
                {task.status === 'in_progress' && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

CreatedByMe.propTypes = {
  onTaskClick: PropTypes.func
};

export default CreatedByMe;