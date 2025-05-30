import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Properties from './components/Properties';
import CreatorSupportMessage from './pages/CreatorSupportMessge';
import ContactUs from './pages/ContactUs';
import FAQSection from './pages/FAQSection';
import UniStayAuth from './pages/UniStayAuth';
import PropertyCard from './components/PropertyCard';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AutContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LandlordGuide from './pages/LandlordGuide';
import LandlordDashboard from './pages/LandlordDashboard';
import LandlordNavbar from './components/LandlordNavbar';
import ManageProperties from './pages/MyProperties'
import PropertyDetail from './components/PropertyDetailsCard';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import ResetPassword from './components/ResetPassword';
import LandlordProfile from './pages/LandlordProfile';

// Create a wrapper component to use useAuth hook
const AppContent = () => {
  const { currentUser } = useAuth();
  
  // Initialize Google Analytics
  useEffect(() => {
    ReactGA.initialize('G-XDP6NK28JN');
    ReactGA.set({
      custom_map: {
        custom_dimension_1: 'property_id',
        custom_dimension_2: 'property_location'
      }
    });
  }, []);

  console.log("Current User:", currentUser);

  return (
    <>
      {currentUser?.role === 'landlord' ? <LandlordNavbar /> : <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Properties" element={<Properties />} />
        <Route path="/Support" element={<CreatorSupportMessage />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Help" element={<FAQSection />} />
        <Route path="/signin" element={<UniStayAuth />} />
        <Route path="/landlord-guide" element={<LandlordGuide />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetail/>
            </ProtectedRoute>
          }
        />

        {/* Landlord Protected Routes */}
        <Route
          path="/landlord-dashboard"
          element={
            <ProtectedRoute>
              <ManageProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord-properties"
          element={
            <ProtectedRoute>
              <ManageProperties/>
            </ProtectedRoute>
          }
        />

        {/* FIX: Move landlord-profile inside ProtectedRoute */}
        <Route
          path="/landlord-profile"
          element={
            <ProtectedRoute>
              <LandlordProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;