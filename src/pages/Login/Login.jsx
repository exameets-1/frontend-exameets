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
    <div className="flex justify-center items-center p-5 bg-white dark:bg-gray-800 min-h-screen">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-semibold text-[#005587] dark:text-white mb-8">Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="email" className="block font-medium text-[#005587] dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdOutlineMailOutline className="text-[#005587] dark:text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#005587] focus:ring-1 focus:ring-[#005587] transition-colors"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block font-medium text-[#005587] dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <RiLock2Fill className="text-[#005587] dark:text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#005587] focus:ring-1 focus:ring-[#005587] transition-colors"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <FaEyeSlash className="text-[#005587] dark:text-gray-400" /> : 
                  <FaEye className="text-[#005587] dark:text-gray-400" />
                }
              </div>
            </div>
          </div>

          <div className="text-right -mt-2 mb-5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotModal(true);
              }}
              className="text-sm text-[#005587] dark:text-gray-400 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              authLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#005587] hover:bg-[#004670] dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            }`}
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-5 text-gray-600 dark:text-gray-400">
          Don&lsquo;t have an account?{" "}
          <Link to="/register" className="text-[#005587] dark:text-gray-400 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 max-w-md">
            <button 
              className="absolute right-5 top-5 text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" 
              onClick={() => setShowForgotModal(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-[#005587] dark:text-white text-center mb-6">Forgot Password</h3>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-5">
                <label className="block font-medium text-[#005587] dark:text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#005587] focus:ring-1 focus:ring-[#005587]"
                />
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#005587] hover:bg-[#004670] dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 max-w-md">
            <button 
              className="absolute right-5 top-5 text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" 
              onClick={() => setShowOTPModal(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-[#005587] dark:text-white text-center mb-6">Enter OTP</h3>
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-5">
                <label className="block font-medium text-[#005587] dark:text-gray-300 mb-2">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#005587] focus:ring-1 focus:ring-[#005587]"
                />
              </div>
              {resendTimer > 0 && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Resend OTP in {Math.floor(resendTimer / 60)}:
                  {(resendTimer % 60).toString().padStart(2, '0')}
                </div>
              )}
              <button 
                type="submit" 
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#005587] hover:bg-[#004670] dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 max-w-md">
            <button 
              className="absolute right-5 top-5 text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" 
              onClick={() => setShowResetModal(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-[#005587] dark:text-white text-center mb-6">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <div className="mb-5">
                <label className="block font-medium text-[#005587] dark:text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#005587] focus:ring-1 focus:ring-[#005587]"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <FaEyeSlash className="text-[#005587] dark:text-gray-400" /> : 
                      <FaEye className="text-[#005587] dark:text-gray-400" />
                    }
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label className="block font-medium text-[#005587] dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#005587] focus:ring-1 focus:ring-[#005587]"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#005587] hover:bg-[#004670] dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
                disabled={loading}
              >
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