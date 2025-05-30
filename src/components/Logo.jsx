import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';

const Logo = () => (
  <Link to="/landlord-dashboard" className="flex items-center space-x-2">
    <Building className="h-6 w-6 text-blue-600" />
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
      UniStay Landlord
    </span>
  </Link>
);

export default Logo;
