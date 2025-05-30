import { Link } from 'react-router-dom';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';
import UserInfoBlock from './UserInfoBlock';

const DesktopProfileMenu = ({
  currentUser,
  profileDropdownOpen,
  toggleDropdown,
  logoutHandler,
  dropdownRef,
  initials,
  displayName
}) => (
  <div className="relative" ref={dropdownRef}>
    <button
      className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2"
      onClick={toggleDropdown}
    >
      <UserAvatar initials={initials} />
      <span className="text-gray-700 hover:text-blue-600 font-medium max-w-32 truncate">{displayName}</span>
      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
    </button>

    {profileDropdownOpen && (
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        <UserInfoBlock
          fullName={currentUser.fullName}
          email={currentUser.email}
          properties={currentUser.properties}
          totalUnits={currentUser.totalUnits}
        />
        <Link
          to="/landlord-profile"
          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          onClick={toggleDropdown}
        >
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </Link>
        <button
          onClick={logoutHandler}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    )}
  </div>
);

export default DesktopProfileMenu;
