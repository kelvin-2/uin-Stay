const UserInfoBlock = ({ fullName, email, properties, totalUnits }) => (
    <div className="px-4 py-3 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
      <p className="text-xs text-gray-500 truncate">{email}</p>
      <p className="text-xs text-blue-600 font-medium mt-1">
        {properties || 0} Properties • {totalUnits || 0} Units
      </p>
    </div>
  );
  
  export default UserInfoBlock;
  