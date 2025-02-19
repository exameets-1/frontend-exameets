import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, clearAllUserErrors } from "../../store/slices/userSlice.js";
import { toast } from "react-toastify";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/config";
import PreferencesModal from "../../components/PreferencesModal/PreferencesModal.jsx";
import useScrollToTop from "../../hooks/useScrollToTop";
import "./Register.css";

const Register = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false,
    hasLower: false,
    matches: false,
  });

  const validatePassword = (password, confirmPass) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      matches: password === confirmPass && password !== "",
    });
  };

  useEffect(() => {
    validatePassword(password, confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    if (error && error !== "User not authenticated") {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      setShowPreferences(true);
    }
  }, [dispatch, error, isAuthenticated]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let interval;
    if (emailResendTimer > 0) {
      interval = setInterval(() => {
        setEmailResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          siteKey: import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY,
          enterprise: true,
        }
      );
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setSendingPhoneOtp(true);
      // Check if phone number exists
      const checkResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/check-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      const checkData = await checkResponse.json();
      
      if (checkData.exists) {
        toast.error("Phone number is already registered");
        return;
      }

      generateRecaptcha();
      const formattedPhone = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      setVerificationId(confirmationResult);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
      setResendTimer(60);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setSendingEmailOtp(true);
      // Check if email exists
      const checkResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkResponse.json();
      
      if (checkData.exists) {
        toast.error("Email is already registered");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setEmailOtpSent(true);
        toast.success("Email OTP sent successfully!");
        setEmailResendTimer(60);
      } else {
        toast.error(data.message || "Failed to send email OTP");
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      toast.error("Failed to send email OTP");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword || !dob || !gender) {
      if (!gender) {
        toast.error("Please select your gender");
      }
      if (!dob) {
        toast.error("Please enter your date of birth");
      }
      if (!name) {
        toast.error("Please enter your name");
      }
      if (!email) {
        toast.error("Please enter your email");
      }
      if (!phone) {
        toast.error("Please enter your phone number");
      }
      if (!password || !confirmPassword) {
        toast.error("Please enter both passwords");
      }
      return;
    }

    // First verify email OTP
    if (!emailVerified) {
      try {
        const emailResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/email/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: emailOtp }),
        });
        const emailData = await emailResponse.json();
        if (!emailData.success) {
          toast.error("Invalid email OTP");
          return;
        }
        setEmailVerified(true);
      } catch (error) {
        toast.error("Failed to verify email OTP");
        return;
      }
    }

    // Then verify phone OTP
    if (!otpVerified) {
      try {
        await verificationId.confirm(otp);
        setOtpVerified(true);
      } catch (error) {
        toast.error("Invalid phone OTP");
        return;
      }
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
      toast.error("Please ensure password meets all requirements");
      return;
    }

    try {
      const formData = {
        name,
        email,
        phone,
        dob: new Date(dob).toISOString(),
        gender,
        password,
      };

      const result = await dispatch(register(formData));
      if (register.fulfilled.match(result)) {
        toast.success("Registration successful!");
      } else if (register.rejected.match(result)) {
        toast.error(result.payload || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  const handleOtpChange = (e, setOtpFunction) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setOtpFunction(value);
    }
  };

  return (
    <div className="form">
      <section className="sign-up-section">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>

          <div className="section">
            <label>Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="section">
            <label>Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div className="section">
            <label>Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="section">
            <label>Phone Number</label>
            <div className="phone-section">
              <select id="country-code">
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                id="phone"
                placeholder="Enter 10-digit Mobile Number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setPhone(value);
                  }
                }}
                maxLength="10"
                required
                disabled={otpVerified}
              />
            </div>
          </div>

          <div className="section">
            <label>Email ID</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={emailVerified}
            />
          </div>

          <div className="otp-section">
            <input
              type="text"
              placeholder="Enter Mobile OTP"
              value={otp}
              onChange={(e) => handleOtpChange(e, setOtp)}
              maxLength="6"
              required={otpSent}
            />
            {!otpVerified && (
              <>
                {!otpSent ? (
                  <button 
                    type="button" 
                    onClick={handleSendOTP}
                    disabled={sendingPhoneOtp}
                  >
                    {sendingPhoneOtp ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    {resendTimer > 0 ? (
                      <span>Resend in {resendTimer}s</span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleSendOTP}
                        disabled={sendingPhoneOtp}
                      >
                        {sendingPhoneOtp ? "Sending..." : "Resend"}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            {otpVerified && (
              <span className="verification-success">Verified</span>
            )}
          </div>

          <div className="otp-section">
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={emailOtp}
              onChange={(e) => handleOtpChange(e, setEmailOtp)}
              maxLength="6"
              required={emailOtpSent}
            />
            {!emailVerified && (
              <>
                {!emailOtpSent ? (
                  <button 
                    type="button" 
                    onClick={handleSendEmailOTP}
                    disabled={sendingEmailOtp}
                  >
                    {sendingEmailOtp ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    {emailResendTimer > 0 ? (
                      <span>Resend in {emailResendTimer}s</span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleSendEmailOTP}
                        disabled={sendingEmailOtp}
                      >
                        {sendingEmailOtp ? "Sending..." : "Resend"}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            {emailVerified && (
              <span className="verification-success">Verified</span>
            )}
          </div>

          <div className="password-section">
            <label>Create Password</label>
          </div>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="password-validation">
            <p className={passwordValidation.minLength ? "valid" : ""}>
              ✓ At least 8 characters
            </p>
            <p className={passwordValidation.hasUpper ? "valid" : ""}>
              ✓ At least one uppercase letter
            </p>
            <p className={passwordValidation.hasLower ? "valid" : ""}>
              ✓ At least one lowercase letter
            </p>
            <p className={passwordValidation.hasNumber ? "valid" : ""}>
              ✓ At least one number
            </p>
            <p className={passwordValidation.hasSpecial ? "valid" : ""}>
              ✓ At least one special character
            </p>
            <p className={passwordValidation.matches ? "valid" : ""}>
              ✓ Passwords match
            </p>
          </div>
          
          <button type="submit" className="next-btn" disabled={loading}>
            {loading ? "Registering..." : "Next"}
          </button>
        </form>
        <div className="register-link">
          Already having an account? <Link to="/login">Sign in</Link>
        </div>
      </section>

      {showPreferences && (
        <PreferencesModal
          onClose={() => {
            setShowPreferences(false);
            navigateTo("/");
          }}
        />
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Register;