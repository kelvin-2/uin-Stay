import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';

const MobileMenu = ({
  isOpen,
  navLinks,
  isActive,
  currentUser,
  getUserInitials,
  getDisplayName,
  handleLogout,
  closeMenu
}) => {
  return (
    <div className={`md:hidden transition-all duration-300 ease-in-out ${
      isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
    }`}>
      <div className="flex flex-col space-y-4 pb-6 pt-2">
        {currentUser && (
          <div className="px-4 py-3 bg-blue-50 rounded-lg mx-4 mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                {getUserInitials() || <User className="h-5 w-5 text-blue-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-blue-600">
                  {currentUser.properties || 0} Properties
                </p>
              </div>
            </div>
          </div>
        )}

        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 ${
              isActive(link.path) ? 'text-blue-600 font-medium' : 'text-gray-600'
            } hover:text-blue-600 py-2 transition-colors duration-200`}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}

        {currentUser && (
          <div className="pt-4 border-t border-gray-100 mx-4">
            <Link
              to="/landlord-profile"
              className="flex items-center space-x-3 py-2 text-gray-600 hover:text-blue-600 transition"
              onClick={closeMenu}
            >
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
            <button
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              className="w-full flex items-center space-x-3 py-2 text-gray-600 hover:text-red-600 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
