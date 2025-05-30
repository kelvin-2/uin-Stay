import { User } from 'lucide-react';

const UserAvatar = ({ initials }) => (
  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
    {initials ? (
      <span className="text-blue-600 font-semibold text-sm">{initials}</span>
    ) : (
      <User className="h-4 w-4 text-blue-600" />
    )}
  </div>
);

export default UserAvatar;
