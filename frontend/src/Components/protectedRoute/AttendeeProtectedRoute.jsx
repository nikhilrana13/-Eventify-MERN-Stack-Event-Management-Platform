import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';

const AttendeeProtectedRoute = ({children}) => {
    const user = useSelector((state)=>state.Auth.user)

    if(!user || user.role !== "Attendee"){
        return <Navigate to="/" replace />
    }
    return children
}

export default AttendeeProtectedRoute