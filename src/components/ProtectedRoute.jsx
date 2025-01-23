import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('Please login to access this page');
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // If authenticated, render the protected component
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
