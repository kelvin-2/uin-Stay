import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State to hold the current user info, initialized with user data from localStorage
  const [currentUser, setCurrentUser] = useState(null);

  // On mount, try to get user data from localStorage and update state
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Login function to save user data to localStorage and update state
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  // Logout function to remove user data from localStorage and reset state
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // The AuthContext.Provider value contains currentUser, login, and logout methods
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication data from context
export const useAuth = () => useContext(AuthContext);
