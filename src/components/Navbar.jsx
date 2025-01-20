import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized function to check active links
  const isActive = useCallback((path) => location.pathname === path, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/Properties", label: "Properties" },
    { path: "/Contact-Us", label: "Contact Us" },
    { path: "/OurStory", label: "Our Story" },
    { path: "/Help", label: "FAQs / Help" },
  ];

  return (
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
            <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <span>Landlords</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200">
                  <Link to="/list-property" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                    List Your Property
                  </Link>
                  <Link to="/landlord-guide" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                    Landlord Guide
                  </Link>
                  <Link to="/pricing" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
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
            <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors duration-200"
            aria-label="Toggle navigation menu"
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
              <Link 
                to="/signin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
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