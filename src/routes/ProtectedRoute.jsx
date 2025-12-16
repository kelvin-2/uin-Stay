import { useAuth } from '../context/AutContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  
  if (!currentUser || !token) {
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;