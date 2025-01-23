import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, resetUpdate } from "../store/slices/updateProfileSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./DashboardComponents.css";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, isPasswordUpdated } = useSelector((state) => state.updateProfile);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (isPasswordUpdated) {
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(resetUpdate());
    }
  }, [error, isPasswordUpdated, dispatch]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push("One uppercase letter");
    if (!hasLowerCase) errors.push("One lowercase letter");
    if (!hasNumber) errors.push("One number");
    if (!hasSpecialChar) errors.push("One special character");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      toast.error(
        <div>
          Password must contain:
          <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
            {passwordErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    try {
      await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
    } catch (err) {
      // Error is handled in useEffect
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-section">
        <div className="profile-field">
          <label htmlFor="oldPassword">Current Password *</label>
          <div className="password-field">
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="profile-field">
          <label htmlFor="newPassword">New Password *</label>
          <div className="password-field">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <small className="field-note">
            Password must be at least 8 characters long and contain uppercase, lowercase,
            number, and special character
          </small>
        </div>

        <div className="profile-field">
          <label htmlFor="confirmPassword">Confirm New Password *</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;