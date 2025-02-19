import  { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteAccount } from '../../store/slices/userSlice';
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmDelete) {
      toast.error('Please confirm account deletion by checking the checkbox');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      await dispatch(deleteAccount(password)).unwrap();
      toast.success('Your account has been deleted successfully');
      // Add a small delay before navigation to show the success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error(error || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="delete-user-container">
      <div className="delete-user-warning">
        <h3>Warning: This action cannot be undone</h3>
        <p>
          Deleting your account will permanently remove all your data, including your profile information,
          exam records, and any other associated data. You won&lsquo;t be able to register again with the same mobile number you used. This action is irreversible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="delete-user-form">
        <div className="delete-user-field">
          <label htmlFor="password">Enter Your Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="delete-user-checkbox">
          <input
            type="checkbox"
            id="confirm-delete"
            checked={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.checked)}
          />
          <label htmlFor="confirm-delete">
            I understand that this action cannot be undone and I want to permanently delete my account
          </label>
        </div>

        <div className="delete-user-actions">
          <button
            type="submit"
            className="delete-user-danger-btn"
            disabled={loading || !confirmDelete || !password}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="delete-user-cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccount;