import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearAllUserErrors, login } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { error, isAuthenticated, loading: authLoading } = useSelector((state) => state.user);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const loginData = {
      email,
      password
    };
    dispatch(login(loginData));
  };

  useEffect(() => {
    if (error && error !== "User not authenticated") {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const pendingTeamId = localStorage.getItem('pendingTeamVerification');
      if (pendingTeamId) {
        localStorage.removeItem('pendingTeamVerification');
        navigate(`/team/get/${pendingTeamId}`);
      } else if (location.state?.from) {
        navigate(location.state.from, {
          state: { applyAfterLogin: location.state.applyAfterLogin }
        });
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/password/send-otp`, {
        email: forgotEmail
      });
      toast.success(data.message);
      setShowForgotModal(false);
      setShowOTPModal(true);
      setResendTimer(120); // 2 minutes
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/password/verify-otp`, {
        email: forgotEmail,
        otp
      });
      toast.success(data.message);
      setShowOTPModal(false);
      setShowResetModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/password/reset-password`, {
        email: forgotEmail,
        otp,
        newPassword
      });
      toast.success(data.message);
      setShowResetModal(false);
      // Reset all states
      setForgotEmail("");
      setOTP("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="login-form">
      <div className="login-section">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="section">
            <label htmlFor="">Email Address</label>
            <div className="input-group">
              <MdOutlineMailOutline className="icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="section">
            <label htmlFor="">Password</label>
            <div className="input-group">
              <RiLock2Fill className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setShowForgotModal(true);
            }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowForgotModal(false)}>×</button>
            <h3 className="modal-header">Forgot Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div className="section">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowOTPModal(false)}>×</button>
            <h3 className="modal-header">Enter OTP</h3>
            <form onSubmit={handleVerifyOTP}>
              <div className="section">
                <label>OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </div>
              {resendTimer > 0 && (
                <div className="timer">
                  Resend OTP in {Math.floor(resendTimer / 60)}:
                  {(resendTimer % 60).toString().padStart(2, '0')}
                </div>
              )}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowResetModal(false)}>×</button>
            <h3 className="modal-header">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <div className="section">
                <label>New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <div
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div className="section">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;