import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const HostProtectedRoute = () => {
    const user = useSelector((state)=>state.Auth.user)
  return user && user?.role === "Host" ? <Outlet /> : <Navigate to="/" />
}

export default HostProtectedRoute