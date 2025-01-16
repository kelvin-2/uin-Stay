import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Heart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Memoized function to check active links
  const isActive = useCallback((path) => location.pathname === path, [location]);

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="px-6 md:px 10">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            UniStay
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["/", "/properties", "/cities", "/about"].map((path, index) => (
              <Link
                key={index}
                to={path}
                className={`${isActive(path) ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
              >
                {path === '/' ? 'Home' : path.replace('/', '')}
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-gray-600 hover:text-blue-600">
              <Search className="h-5 w-5" />
            </Link>
            <Link to="/favorites" className="text-gray-600 hover:text-blue-600">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4">
            {["/", "/properties", "/cities", "/about"].map((path, index) => (
              <Link
                key={index}
                to={path}
                className={`${isActive(path) ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 py-2`}
                onClick={() => setIsOpen(false)}
              >
                {path === '/' ? 'Home' : path.replace('/', '')}
              </Link>
            ))}
            <div className="flex items-center space-x-4 pt-2">
              <Link to="/search" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                <Search className="h-5 w-5" />
              </Link>
              <Link to="/favorites" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                <Heart className="h-5 w-5" />
              </Link>
              <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
