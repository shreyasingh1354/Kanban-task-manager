import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is not authenticated
  if (!token || !user) {
    // Redirect to login page with the return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if token is expired
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    if (tokenData.exp * 1000 < Date.now()) {
      // Token is expired, clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } catch (error) {
    // If token is invalid, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated and token is valid, render the protected component
  return children;
};

export default PrivateRoute;