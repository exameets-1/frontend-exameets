import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { editComment, deleteComment } from '../store/slices/postSlice';

const CommentItem = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = () => {
    if (editedContent.trim() !== comment.content) {
      dispatch(editComment(postId, comment._id, editedContent));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(postId, comment._id));
    }
  };

  return (
    <div className="flex space-x-4">
      <img 
        src={comment.user?.avatar || "/default-avatar.png"}
        alt="commenter"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold dark:text-white">
            {comment.user?.name}
          </h4>
          {user?._id === comment.user?._id && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment.content);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mt-2 w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            rows="2"
          />
        ) : (
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
        )}
        <span className="text-sm text-gray-500 mt-2 block">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }).isRequired
  }).isRequired,
  postId: PropTypes.string.isRequired
};

export default CommentItem; 