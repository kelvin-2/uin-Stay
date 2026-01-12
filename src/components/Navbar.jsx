import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AutContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const landlordDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    localStorage.clear();
    console.log("Local storage cleared on first render.");
  }, []);

  // Outside dropdown close effect
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    console.log("handleLogout called");
    logout();
    navigate('/', { replace: true });
    setProfileDropdownOpen(false);
    setIsOpen(false);
  };

  // Check if a path is active
  const isActive = (path) => location.pathname === path;

  // Nav links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/Properties", label: "Properties" },
    { path: "/ContactUs", label: "Contact Us" },
    { path: "/Help", label: "FAQs / Help" },
  ];

  // Render auth button (Sign In or User Profile)
  const renderAuthButton = () => {
    if (currentUser) {
      return (
        <div className="relative" ref={profileDropdownRef}>
          <button 
            className="flex items-center space-x-2 group"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              {currentUser.fullName ? (
                <span className="text-white font-semibold text-sm">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-gray-800 hover:text-blue-600 font-medium transition-colors">{currentUser.fullName}</span>
            <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 backdrop-blur-md bg-white/80 rounded-xl shadow-xl border border-white/40 py-2 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Sign Out button clicked");
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to="/signin"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold"
        onClick={() => setIsOpen(false)}
      >
        <User className="h-4 w-4" />
        <span>Sign In</span>
      </Link>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-lg bg-white/70 shadow-lg border-b border-white/30' 
          : 'backdrop-blur-md bg-white/60 shadow-md border-b border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                UniStay
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative group ${
                    isActive(link.path) ? 'text-blue-600 font-semibold' : 'text-gray-800 font-medium'
                  }`}
                >
                  <span className="hover:text-blue-600 transition-colors duration-200">
                    {link.label}
                  </span>
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100 ${
                    isActive(link.path) ? 'scale-x-100' : ''
                  }`} />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {renderAuthButton()}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-white/50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="flex flex-col space-y-4 pb-6 pt-2 backdrop-blur-sm bg-white/40 rounded-b-2xl px-4 -mx-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path) ? 'text-blue-600 font-semibold' : 'text-gray-800 font-medium'
                  } hover:text-blue-600 py-2 transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center space-x-4 pt-4 border-t border-white/40">
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