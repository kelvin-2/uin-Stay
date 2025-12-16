import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both 'currentUser' and 'user' keys for backwards compatibility
    const storedUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser({
          ...parsedUser,
          role: parsedUser.role || userRole // Use role from user object or fallback to userRole
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Handle both role string and full user object
    let completeUserData;
    
    if (typeof userData === 'string') {
      // If just role is passed, get user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        completeUserData = {
          uid: parsedUser.uid || parsedUser.id || Date.now().toString(),
          fullName: parsedUser.full_name || parsedUser.fullName || '',
          email: parsedUser.email || '',
          phoneNumber: parsedUser.phone_number || parsedUser.phoneNumber || '',
          role: userData, // Use the role passed in
          university: parsedUser.university || '',
          createdAt: parsedUser.created_at || parsedUser.createdAt || new Date().toISOString(),
          properties: parsedUser.properties || 0,
          totalUnits: parsedUser.totalUnits || 0,
          ...parsedUser
        };
      } else {
        throw new Error('No user data found in localStorage');
      }
    } else {
      // Full user object passed
      completeUserData = {
        uid: userData.uid || userData.id || Date.now().toString(),
        fullName: userData.fullName || userData.full_name || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || userData.phone_number || '',
        role: userData.role || 'student',
        university: userData.university || '',
        createdAt: userData.createdAt || userData.created_at || new Date().toISOString(),
        properties: userData.properties || 0,
        totalUnits: userData.totalUnits || 0,
        ...userData
      };
    }
    
    setCurrentUser(completeUserData);
    // Store in both keys for consistency
    localStorage.setItem('currentUser', JSON.stringify(completeUserData));
    localStorage.setItem('user', JSON.stringify(completeUserData));
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
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  const logout = () => {
    setCurrentUser(null);
    // Clear all auth-related items
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
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
      {!loading && children}
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