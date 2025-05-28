import React from 'react';
import { BookOpen, Building } from 'lucide-react';

const UserTypeSelector = ({ userType, setUserType, clearFeedback }) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        onClick={() => {
          setUserType('student');
          clearFeedback();
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          userType === 'student'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'border border-gray-300 hover:bg-blue-50'
        }`}
      >
        <BookOpen className="h-4 w-4" />
        Student
      </button>
      <button
        onClick={() => {
          setUserType('landlord');
          clearFeedback();
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          userType === 'landlord'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'border border-gray-300 hover:bg-blue-50'
        }`}
      >
        <Building className="h-4 w-4" />
        Landlord
      </button>
    </div>
  );
};

export default UserTypeSelector;
