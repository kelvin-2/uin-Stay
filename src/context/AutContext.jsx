import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.role) {
          setCurrentUser(parsedUser); // Ensure it's an object
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  

  const login = (user) => {
    const userData = { role: user }; // Ensure it's an object
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };
  

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);