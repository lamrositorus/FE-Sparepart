import React, { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provider for storing ID and token
export const AuthProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);

  const saveAuthData = (newId, newToken) => {
    setId(newId);
    setToken(newToken);
    localStorage.setItem('token', newToken); // Save token to local storage
  };

  const clearAuthData = () => {
    console.log('Clearing auth data...');
    setId(null);
    setToken('');
    localStorage.removeItem('token'); // Remove token from local storage
    console.log('Auth data cleared.');
  };

  return (
    <AuthContext.Provider value={{ id, token, saveAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
