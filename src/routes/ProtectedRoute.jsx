import { useAuth } from '../context/AutContext'; // Adjust the path as necessary
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Access the currentUser from the context

  // If the user is not logged in, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // If the user is logged in, render the children (PropertyCard in your case)
  return children;
};

export default ProtectedRoute;