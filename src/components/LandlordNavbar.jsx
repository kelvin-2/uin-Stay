import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Building, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AutContext';
import MobileMenu from './MobileMenu';

const LandlordNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const navLinks = [
    { path: "/landlord-properties", label: "My Properties" },
    { path: "/help", label: "FAQs / Help" },
    { path: "/ContactUs", label: "Contact Us" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getUserInitials = () => {
    if (!currentUser?.fullName) return '';
    return currentUser.fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getDisplayName = () => {
    if (!currentUser) return 'Loading...';
    return currentUser.fullName || currentUser.email || 'User';
  };

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

          {/* Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-6">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : currentUser ? (
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    {getUserInitials() || <User className="h-4 w-4 text-blue-600" />}
                  </div>
                  <span className="text-gray-700 hover:text-blue-600 font-medium max-w-32 truncate">
                    {getDisplayName()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser.fullName || 'Landlord'}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {currentUser.properties || 0} Properties • {currentUser.totalUnits || 0} Units
                      </p>
                    </div>
                    <Link
                      to="/landlord-profile"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Login
              </Link>
            )}
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
        <MobileMenu
          isOpen={isOpen}
          navLinks={navLinks}
          isActive={isActive}
          currentUser={currentUser}
          getUserInitials={getUserInitials}
          getDisplayName={getDisplayName}
          handleLogout={handleLogout}
          closeMenu={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
};

export default LandlordNavbar;
