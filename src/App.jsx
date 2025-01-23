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
import { AuthProvider } from './context/AutContext';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Default Route: Home Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Properties Page */}
        <Route path="/Properties" element={<Properties />} />
        
        {/* Protected Route: Property Details Page */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyCard />
            </ProtectedRoute>
          }
        />
        
        {/* OurStory Page */}
        <Route path="/Support" element={<CreatorSupportMessage />} />

        {/* Contact Page */}
        <Route path="/ContactUs" element={<ContactUs />} />

        {/* FAQ/Help Page */}
        <Route path="/Help" element={<FAQSection />} />

        {/* Sign In Page */}
        <Route path="/signin" element={<UniStayAuth />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;