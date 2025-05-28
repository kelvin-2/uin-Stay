import React from 'react';

const AuthTabs = ({ activeTab, setActiveTab, clearFeedback }) => {
  return (
    <div className="flex rounded-lg bg-blue-50 p-1">
      <button
        onClick={() => {
          setActiveTab('login');
          clearFeedback();
        }}
        className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
          activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-blue-600'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => {
          setActiveTab('signup');
          clearFeedback();
        }}
        className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
          activeTab === 'signup' ? 'bg-blue-600 text-white' : 'text-blue-600'
        }`}
      >
        Sign up
      </button>
    </div>
  );
};

export default AuthTabs;
