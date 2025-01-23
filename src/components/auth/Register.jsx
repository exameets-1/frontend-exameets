import {useEffect, useState} from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';
import { register, clearAllUserErrors} from '../../store/slices/userSlice';
import {toast} from 'react-toastify';
import {FaPencilAlt, FaEye, FaEyeSlash} from 'react-icons/fa';
import {FaPhoneFlip} from 'react-icons/fa6';
import {MdOutlineEmail} from 'react-icons/md';
import {RiLock2Fill} from 'react-icons/ri';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasNumber: false,
        hasUpper: false,
        hasLower: false,
        hasSpecial: false,
        matches: false,
    });

    const validatePassword = (password, confirmPass) => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            matches: password === confirmPass && password !== ""
        });
    };

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const validatePhone = (phone) => {
        return phone.match(/^\d{10}$/); // Adjust based on your phone format requirements
    };

    const {loading, isAuthenticated, error} = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    useEffect(() => {
        validatePassword(password, confirmPassword);
    }, [password, confirmPassword]);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            // Validation checks
            if(!name || !email || !password || !phone ) {
                toast.error('Please fill all fields');
                return;
            }

            if(!validateEmail(email)) {
                toast.error('Please enter a valid email address');
                return;
            }

            if(!validatePhone(phone)) {
                toast.error('Please enter a valid 10-digit phone number');
                return;
            }

            if(!Object.values(passwordValidation).every(Boolean)) {
                toast.error('Please ensure password meets all requirements');
                return;
            }

            if(!isAgeVerified || !isTermsAccepted) {
                toast.error('Please accept age verification and terms of service');
                return;
            }

            // Create registration data object
            const registrationData = {
                name,
                email,
                password,
                phone
            };

            console.log('Dispatching registration with data:', registrationData);
            
            // Dispatch the registration action with the object directly
            dispatch(register(registrationData));
            
            console.log('Registration dispatch completed');
        } catch (error) {
            console.error('Error in handleRegister:', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    useEffect(() => {
        if(error) {
            console.error("Registration error:", error);
            toast.error(error);
            dispatch(clearAllUserErrors());
        }
        if(isAuthenticated) {
            console.log("Registration successful");
            toast.success('Registration successful!');
            navigateTo('/');
        }
    }, [error, isAuthenticated, navigateTo, dispatch]);

    const PasswordRequirements = () => {
        return (
            <div className='password-requirements'>
                <p style={{ color: passwordValidation.minLength ? 'green' : 'red' }}>
                    {passwordValidation.minLength ? '✓' : '○'} At least 8 characters long
                </p>
                <p style={{ color: passwordValidation.hasNumber ? 'green' : 'red' }}>
                    {passwordValidation.hasNumber ? '✓' : '○'} Contains at least one number
                </p>
                <p style={{ color: passwordValidation.hasUpper ? 'green' : 'red' }}>
                    {passwordValidation.hasUpper ? '✓' : '○'} Contains at least one uppercase letter
                </p>
                <p style={{ color: passwordValidation.hasLower ? 'green' : 'red' }}>
                    {passwordValidation.hasLower ? '✓' : '○'} Contains at least one lowercase letter
                </p>
                <p style={{ color: passwordValidation.hasSpecial ? 'green' : 'red' }}>
                    {passwordValidation.hasSpecial ? '✓' : '○'} Contains at least one special character
                </p>
                <p style={{ color: passwordValidation.matches ? 'green' : 'red' }}>
                    {passwordValidation.matches ? '✓' : '○'} Passwords match
                </p>
            </div>
        );
    };

    return (
        <div className='register-container'>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <FaPencilAlt className="input-icon" />
                    <input 
                        type='text' 
                        placeholder='Name' 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <MdOutlineEmail className="input-icon" />
                    <input 
                        type='email' 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <RiLock2Fill className="input-icon" />
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button 
                        type='button' 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="input-group">
                    <RiLock2Fill className="input-icon" />
                    <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        placeholder='Confirm Password' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                    <button 
                        type='button' 
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="input-group">
                    <FaPhoneFlip className="input-icon" />
                    <input 
                        type='tel' 
                        placeholder='Phone (10 digits)' 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </div>

                <PasswordRequirements />

                <div className='checkbox-container'>
                    <input 
                        type='checkbox' 
                        id='age' 
                        checked={isAgeVerified} 
                        onChange={() => setIsAgeVerified(!isAgeVerified)} 
                        required 
                    />
                    <label htmlFor='age'>I am at least 16 years old</label>
                </div>

                <div className='checkbox-container'>
                    <input 
                        type='checkbox' 
                        id='terms' 
                        checked={isTermsAccepted} 
                        onChange={() => setIsTermsAccepted(!isTermsAccepted)} 
                        required 
                    />
                    <label htmlFor='terms'>
                        I have read and agree to the <Link to='/terms'>terms of service</Link>
                    </label>
                </div>

                <button 
                    type='submit' 
                    className="submit-button"
                    disabled={
                        loading || 
                        !Object.values(passwordValidation).every(Boolean) || 
                        !isAgeVerified || 
                        !isTermsAccepted
                    }
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;


