import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, resetUpdate } from "../../store/slices/updateProfileSlice";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false,
    isDifferent: false
  });

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

  useEffect(() => {
    setValidations({
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      passwordsMatch: newPassword === confirmPassword && newPassword !== "",
      isDifferent: newPassword !== oldPassword && newPassword !== ""
    });
  }, [newPassword, confirmPassword, oldPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) {
      toast.error("Please meet all password requirements");
      return;
    }

    try {
      await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
    } catch (err) {
      // Error is handled in useEffect
    }
  };

  return (
    <div className="update-password-container">
      <div className="update-password-card">
        
        <form onSubmit={handleSubmit} className="update-password-form">
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-input-group">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="password-input"
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

          <div className="form-group">
            <label>New Password</label>
            <div className="password-input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="password-input"
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

          <div className="password-requirements">
            <h3>Password Requirements:</h3>
            <ul>
              <li className={validations.minLength ? 'valid' : 'invalid'}>
                {validations.minLength ? <FaCheck /> : <FaTimes />}
                At least 8 characters
              </li>
              <li className={validations.hasUpper ? 'valid' : 'invalid'}>
                {validations.hasUpper ? <FaCheck /> : <FaTimes />}
                At least one uppercase letter
              </li>
              <li className={validations.hasLower ? 'valid' : 'invalid'}>
                {validations.hasLower ? <FaCheck /> : <FaTimes />}
                At least one lowercase letter
              </li>
              <li className={validations.hasNumber ? 'valid' : 'invalid'}>
                {validations.hasNumber ? <FaCheck /> : <FaTimes />}
                At least one number
              </li>
              <li className={validations.hasSpecial ? 'valid' : 'invalid'}>
                {validations.hasSpecial ? <FaCheck /> : <FaTimes />}
                At least one special character
              </li>
              <li className={validations.passwordsMatch ? 'valid' : 'invalid'}>
                {validations.passwordsMatch ? <FaCheck /> : <FaTimes />}
                Passwords match
              </li>
              <li className={validations.isDifferent ? 'valid' : 'invalid'}>
                {validations.isDifferent ? <FaCheck /> : <FaTimes />}
                Different from current password
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="update-button"
            disabled={loading || !Object.values(validations).every(Boolean)}
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;