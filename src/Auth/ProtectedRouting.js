import React from 'react'
import useAuthCheck from "../Auth/useAuthCheck";
import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute() {
    const token = localStorage.getItem("token");
  return ( token ? <Outlet/> : <Navigate to="/vendor-login"/>);
}
