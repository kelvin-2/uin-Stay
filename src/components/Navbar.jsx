import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  // State for mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  // State for scroll effect
  const [scrolled, setScrolled] = useState(false);

  // State for landlords dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // State for profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // State to track the current logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // Get the current location and navigate function from react-router-dom
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for handling clicks outside dropdowns
  const landlordDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close landlords dropdown if clicked outside
      if (landlordDropdownRef.current && !landlordDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Close profile dropdown if clicked outside
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser)); // Set the current user if logged in
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Clear invalid user data
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setCurrentUser(null); // Clear current user state
    setProfileDropdownOpen(false); // Close profile dropdown
    navigate('/'); // Redirect to home page
  };

  // Memoized function to check active links
  const isActive = useCallback((path) => location.pathname === path, [location]);

  // Navigation links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/Properties", label: "Properties" },
    { path: "/ContactUs", label: "Contact Us" },
    { path: "/OurStory", label: "Our Story" },
    { path: "/Help", label: "FAQs / Help" },
  ];

  // Render the authentication button or user profile
  const renderAuthButton = () => {
    if (currentUser) {
      return (
        <div className="relative" ref={profileDropdownRef}>
          <button 
            className="flex items-center space-x-2"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            {/* User profile icon or initials */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {currentUser.fullName ? (
                <span className="text-blue-600 font-medium">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              ) : (
                <User className="h-4 w-4 text-blue-600" />
              )}
            </div>
            {/* User's full name */}
            <span className="text-gray-600 hover:text-blue-600">{currentUser.fullName}</span>
            {/* Dropdown arrow */}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* Profile dropdown menu */}
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

    // If no user is logged in, show the "Sign In" button
    return (
      <Link
        to="/signin" // Redirect to the sign-in page
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      >
        <User className="h-4 w-4" />
        <span>Sign In</span>
      </Link>
    );
  };

  return (
    <>
      {/* Navbar */}
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
                  {/* Active link indicator */}
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
                
                {/* Landlords dropdown menu */}
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
              {/* Render authentication button or user profile */}
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

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="flex flex-col space-y-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path) ? 'text-blue-600' : 'text-gray-600'
                  } hover:text-blue-600 py-2 transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Landlords Section */}
              <div className="border-t border-gray-100 pt-4">
                <div className="text-gray-600 font-medium mb-2">Landlords</div>
                <div className="flex flex-col space-y-2 pl-4">
                  <Link to="/list-property" className="text-gray-600 hover:text-blue-600">List Your Property</Link>
                  <Link to="/landlord-guide" className="text-gray-600 hover:text-blue-600">Landlord Guide</Link>
                  <Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
                {/* Render authentication button or user profile */}
                {renderAuthButton()}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;