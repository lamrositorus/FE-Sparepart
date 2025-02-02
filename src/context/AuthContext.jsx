import React, { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provider for storing ID and token
export const AuthProvider = ({ children }) => {
  const [id, setId] = useState(() => localStorage.getItem('id') || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const saveAuthData = (newId, newToken) => {
    console.log('Saving auth data:', newId, newToken);
    setId(newId);
    setToken(newToken);
    localStorage.setItem('token', newToken); // Save token to local storage
    localStorage.setItem('id', newId); // Save ID to local storage
  };

  const clearAuthData = () => {
    setId(null);
    setToken(null);
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('id'); // Remove ID from local storage
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ id, token, saveAuthData, clearAuthData, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
