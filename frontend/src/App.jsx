import React from 'react'
import { Routes, Route } from "react-router-dom"
import HostDashboard from './Pages/HostDashboard'
import Homepage from './Pages/Homepage'
import SignUp from './Components/PageComponent/SignUp'
import Login from './Components/PageComponent/Login'
import { Toaster } from 'react-hot-toast'
import Dashboard from './Components/DashboardComponent/Dashboard'
import AddEvent from './Components/DashboardComponent/AddEvent'
import ManageBookings from './Components/DashboardComponent/ManageBookings'
import Updatehostprofile from './Components/DashboardComponent/Updatehostprofile'
import ManageEvents from './Components/DashboardComponent/MangeEvents'
import UpdateEventsDetails from './Components/DashboardComponent/UpdateEventsDetails'
import AllEvents from './Components/PageComponent/AllEvents'
import AboutUs from './Components/PageComponent/AboutUs'
import Contact from './Components/PageComponent/Contact'
import EachEventDetail from './Components/PageComponent/EachEventDetail'
import ScrollToTop from './Components/PageComponent/ScrollToTop'
import PaymentSuccess from './Components/PageComponent/PaymentSuccess'
import PaymentFailed from './Components/PageComponent/PaymentFailed'
import MyBookings from './Components/PageComponent/MyBookings'
import UpdateUserProfile from './Components/PageComponent/UpdateUserProfile'
import AttendeeProtectedRoute from './Components/protectedRoute/AttendeeProtectedRoute'
import HostProtectedRoute from './Components/protectedRoute/HostProtectedRoute'

const App = ({lenis}) => {
  return (
    <div className='app'>
      {/* routes */}
      <ScrollToTop lenis={lenis} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/log-in' element={<Login />} />
        <Route path='/events' element={<AllEvents lenis={lenis} />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='event-details/:id' element={<EachEventDetail />} />
        {/* user booking and profile route */}
          <Route path='/my-bookings' element={<AttendeeProtectedRoute><MyBookings /></AttendeeProtectedRoute>} />
         <Route path='/update-profile' element={<AttendeeProtectedRoute><UpdateUserProfile /></AttendeeProtectedRoute>} />
         {/* payment route */}
        <Route path='/payment-success' element={<AttendeeProtectedRoute><PaymentSuccess /></AttendeeProtectedRoute> } />
        <Route path='/payment-failed' element={<AttendeeProtectedRoute><PaymentFailed /></AttendeeProtectedRoute>} />
        {/* dashboard routes */}

        <Route element={<HostProtectedRoute />}>
         <Route path='/Host-dashboard' element={<HostDashboard />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-event' element={<AddEvent />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
          <Route path='manage-events' element={<ManageEvents />} />
          <Route path='update-event-details/:id' element={<UpdateEventsDetails />} />
          <Route path='update-host-profile' element={<Updatehostprofile />} />
        </Route>
        </Route>
       
      </Routes>
      <Toaster    position="top-center" 
      containerClassName="!z-[999999]"
        toastOptions={{
          className: "text-sm font-medium",
          style: { zIndex: 999999 }
        }}  />
    </div>
  )
}

export default App