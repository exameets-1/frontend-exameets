import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearAllUserErrors, login } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

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
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/forgotpassword/send-otp`, {
        email: forgotEmail
      });
      toast.success(data.message);
      setShowForgotModal(false);
      setShowOTPModal(true);
      setResendTimer(120); // 2 minutes
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/forgotpassword/verify-otp`, {
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
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/forgotpassword/reset-password`, {
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
    <div className="login-form bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="login-section bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <h2 className="text-gray-900 dark:text-white">Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="section">
            <label htmlFor="" className="text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="input-group bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <MdOutlineMailOutline className="icon text-gray-600 dark:text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
              />
            </div>
          </div>

          <div className="section">
            <label htmlFor="" className="text-gray-700 dark:text-gray-300">Password</label>
            <div className="input-group bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <RiLock2Fill className="icon text-gray-600 dark:text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
              />
              <div
                className="password-toggle bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="icon text-gray-600 dark:text-gray-400" /> : <FaEye className="icon text-gray-600 dark:text-gray-400" />}
              </div>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setShowForgotModal(true);
            }} className="text-blue-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-gray-300">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="submit-button bg-blue-600 dark:bg-gray-700 text-white hover:bg-blue-700 dark:hover:bg-gray-950"
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link text-gray-600 dark:text-gray-400">
          Don&lsquo;t have an account? <Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-gray-300">Sign up</Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <div className="modal-content bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <button className="close-button text-gray-600 dark:text-gray-400" onClick={() => setShowForgotModal(false)}>×</button>
            <h3 className="modal-header text-gray-900 dark:text-white">Forgot Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div className="section">
                <label className="text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
                />
              </div>
              <button type="submit" className="submit-button bg-blue-600 dark:bg-gray-700 text-white hover:bg-blue-700 dark:hover:bg-gray-950" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="modal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <div className="modal-content bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <button className="close-button text-gray-600 dark:text-gray-400" onClick={() => setShowOTPModal(false)}>×</button>
            <h3 className="modal-header text-gray-900 dark:text-white">Enter OTP</h3>
            <form onSubmit={handleVerifyOTP}>
              <div className="section">
                <label className="text-gray-700 dark:text-gray-300">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
                />
              </div>
              {resendTimer > 0 && (
                <div className="timer text-gray-600 dark:text-gray-400">
                  Resend OTP in {Math.floor(resendTimer / 60)}:
                  {(resendTimer % 60).toString().padStart(2, '0')}
                </div>
              )}
              <button type="submit" className="submit-button bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <div className="modal-content bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <button className="close-button text-gray-600 dark:text-gray-400" onClick={() => setShowResetModal(false)}>×</button>
            <h3 className="modal-header text-gray-900 dark:text-white">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <div className="section">
                <label className="text-gray-700 dark:text-gray-300">New Password</label>
                <div className="input-group bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
                    />
                  <div
                    className="password-toggle bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div className="section">
                <label className="text-gray-700 dark:text-gray-300">Confirm Password</label>
                <div className="input-group bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
                  />
                </div>
              </div>
              <button type="submit" className="submit-button bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800" disabled={loading}>
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