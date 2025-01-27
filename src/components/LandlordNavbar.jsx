import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Building, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AutContext';

const LandlordNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Outside click handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setProfileDropdownOpen(false);
  };

  // Landlord-specific navigation links
  const navLinks = [
    { path: "/landlord-dashboard", label: "Dashboard" },
    { path: "/landlord-properties", label: "My Properties" },
    { path: "/support", label: "Support" },
    { path: "/help", label: "FAQs / Help" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/landlord-dashboard" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UniStay Landlord
            </span>
          </Link>

          {/* Desktop Navigation */}
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
          </div>

          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative" ref={profileDropdownRef}>
              <button 
                className="flex items-center space-x-2"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {currentUser?.fullName ? (
                    <span className="text-blue-600 font-medium">
                      {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  ) : (
                    <User className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <span className="text-gray-600 hover:text-blue-600">{currentUser?.fullName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/landlord-profile"
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
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
            
            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/landlord-profile"
                className="block py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-gray-600 hover:text-blue-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandlordNavbar;