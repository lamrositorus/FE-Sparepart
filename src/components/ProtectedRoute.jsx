import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Sesuaikan dengan path yang benar

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); // Ambil token dari konteks

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/user/login" />;
  }

  // Jika terautentikasi, render children
  return children;
};

export default ProtectedRoute;
