import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set ready when we have a definitive authentication state
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  // Show loading state while checking authentication
  if (loading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user || Object.keys(user).length === 0) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;