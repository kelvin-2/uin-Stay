import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Heart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Helper function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">UniStay</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={`${isActive('/properties') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              Properties
            </Link>
            <Link 
              to="/cities" 
              className={`${isActive('/cities') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              Cities
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              About Us
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-gray-600 hover:text-blue-600">
              <Search className="h-5 w-5" />
            </Link>
            <Link to="/favorites" className="text-gray-600 hover:text-blue-600">
              <Heart className="h-5 w-5" />
            </Link>
            <Link 
              to="/signin" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 py-2`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/properties" 
                className={`${isActive('/properties') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 py-2`}
                onClick={() => setIsOpen(false)}
              >
                Properties
              </Link>
              <Link 
                to="/cities" 
                className={`${isActive('/cities') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 py-2`}
                onClick={() => setIsOpen(false)}
              >
                Cities
              </Link>
              <Link 
                to="/about" 
                className={`${isActive('/about') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 py-2`}
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <Link to="/search" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  <Search className="h-5 w-5" />
                </Link>
                <Link to="/favorites" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  <Heart className="h-5 w-5" />
                </Link>
                <Link 
                  to="/signin" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;