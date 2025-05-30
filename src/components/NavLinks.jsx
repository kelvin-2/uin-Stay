import { Link, useLocation } from 'react-router-dom';

const NavLinks = ({ links, onClick }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return links.map((link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`relative group ${isActive(link.path) ? 'text-blue-600' : 'text-gray-600'}`}
      onClick={onClick}
    >
      <span className="hover:text-blue-600 transition-colors duration-200">{link.label}</span>
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100 ${
        isActive(link.path) ? 'scale-x-100' : ''
      }`} />
    </Link>
  ));
};

export default NavLinks;
