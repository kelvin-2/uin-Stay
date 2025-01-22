import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import UniStayAuth from '../pages/UniStayAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs for click outside handling
  const landlordDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (landlordDropdownRef.current && !landlordDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Rest of your existing useEffect hooks...

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = useCallback((path) => location.pathname === path, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/Properties", label: "Properties" },
    { path: "/ContactUs", label: "Contact Us" },
    { path: "/OurStory", label: "Our Story" },
    { path: "/Help", label: "FAQs / Help" },
  ];

  const renderAuthButton = () => {
    if (currentUser) {
      return (
        <div className="relative" ref={profileDropdownRef}>
          <button 
            className="flex items-center space-x-2"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {currentUser.fullName ? (
                <span className="text-blue-600 font-medium">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              ) : (
                <User className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <span className="text-gray-600 hover:text-blue-600">{currentUser.fullName}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => setIsAuthModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      >
        <User className="h-4 w-4" />
        <span>Sign In</span>
      </button>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                UniStay
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative group ${
                    isActive(link.path) ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <span className="hover:text-blue-600 transition-colors duration-200">
                    {link.label}
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100 ${
                    isActive(link.path) ? 'scale-x-100' : ''
                  }`} />
                </Link>
              ))}
              
              {/* Landlords Dropdown */}
              <div className="relative" ref={landlordDropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Landlords</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link 
                      to="/list-property" 
                      className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      List Your Property
                    </Link>
                    <Link 
                      to="/landlord-guide" 
                      className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Landlord Guide
                    </Link>
                    <Link 
                      to="/pricing" 
                      className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Pricing
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>
              {renderAuthButton()}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Rest of your mobile menu code... */}
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl m-4 relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-blue-600"
            >
              <X className="h-6 w-6" />
            </button>
            <UniStayAuth 
              onSuccess={handleAuthSuccess}
              onClose={() => setIsAuthModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;