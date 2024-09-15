import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
   
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== allowedRole) {

    return <Navigate to="/" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
