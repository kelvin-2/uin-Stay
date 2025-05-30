import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser'); // Clean up corrupted data
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Ensure userData is a complete user object
    const completeUserData = {
      uid: userData.uid || Date.now().toString(), // Generate ID if not provided
      fullName: userData.fullName || userData.full_name || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || userData.phone_number || '',
      role: userData.role || 'landlord',
      university: userData.university || '',
      createdAt: userData.createdAt || new Date().toISOString(),
      properties: userData.properties || 0,
      totalUnits: userData.totalUnits || 0,
      ...userData // Spread any additional properties
    };
    
    setCurrentUser(completeUserData);
    localStorage.setItem('currentUser', JSON.stringify(completeUserData));
  };

  const updateUserProfile = async (updatedData) => {
    if (!currentUser) throw new Error('No user logged in');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...currentUser,
      fullName: updatedData.fullName || currentUser.fullName,
      email: updatedData.email || currentUser.email,
      phoneNumber: updatedData.phoneNumber || currentUser.phoneNumber,
      
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};