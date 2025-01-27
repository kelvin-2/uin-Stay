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

// Create a wrapper component to use useAuth hook
const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser?.userType === 'landlord' ? <LandlordNavbar /> : <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Properties" element={<Properties />} />
        <Route path="/Support" element={<CreatorSupportMessage />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Help" element={<FAQSection />} />
        <Route path="/signin" element={<UniStayAuth />} />
        <Route path="/landlord-guide" element={<LandlordGuide />} />

        {/* Protected Routes */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyCard />
            </ProtectedRoute>
          }
        />

        {/* Landlord Protected Routes */}
        <Route
          path="/landlord-dashboard"
          element={
              <LandlordDashboard />
          }
        />
        
        {/* Add more landlord routes here */}
        <Route
          path="/landlord-properties"
          element={
              <LandlordDashboard />
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