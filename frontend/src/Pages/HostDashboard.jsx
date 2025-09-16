import React from 'react'
import { NavLink,Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PlusIcon ,Car,HomeIcon, ArrowRight, TicketCheckIcon, CarFrontIcon,LayoutDashboard,UserCheckIcon, LogInIcon} from 'lucide-react'
import Navbar from '@/Components/PageComponent/Navbar'
import axios from 'axios'
import { SetUser } from '@/Redux/AuthSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

const HostDashboard = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout =async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/sign-out`, { withCredentials: true });
            // console.log("response",response);
            if (response.data) {
                toast.success(response?.data?.message);
                localStorage.removeItem("token");
                dispatch(SetUser(null));
                navigate("/");
            }
        } catch (error) {
            console.log("error in logout", error);
            toast.error(error?.response?.data?.message);
        }
    }
  return (
       <div className='w-full '>
          <Navbar />
      <div className='flex shadow-md  md:p-8 p-3 rounded-md bg-[#F9FBFF] dark:bg-black flex-col items-center gap-3 justify-center'>
          <h3 className='text-[#012047] dark:text-white font-[700] text-[1.5rem] md:text-[2rem]'>Host Dashboard</h3>
      </div>
      <div className='flex flex-col w-full md:px-[5rem] gap-2 md:flex-row '>
        {/* left side content */}
        <div className='flex flex-col shadow-md rounded-md min-h-screen  p-4 gap-5  w-full md:w-[30%]'>
           {/* profile */}
            {/* <OwnerProfileCard  />  */}
           {/* links */}
           <div className='flex flex-col gap-4'>
            <NavLink to="/Host-dashboard/dashboard" className={({ isActive})=> isActive ? `bg-[#0E82FD]  text-white px-2 py-2 rounded-md flex items-center gap-2`:`px-2 py-2 hover:text-[#0E82FD] rounded-md `}>
                  <div className='flex items-center gap-4 '>
                    <LayoutDashboard />
                    <span className='inline'>Dashboard</span>
                 </div>
            </NavLink>
              <NavLink to="/Host-dashboard/add-event" className={({ isActive})=> isActive ? `bg-[#0E82FD]  text-white px-2 py-2 rounded-md flex items-center gap-2`:`px-2 py-2  hover:text-[#0E82FD] rounded-md `}>
                  <div className='flex items-center gap-4 '>
                    <PlusIcon />
                    <span className='inline'>Add Events</span>
                 </div>
            </NavLink>
             <NavLink to="/Host-dashboard/manage-bookings" className={({ isActive})=> isActive ? `bg-[#0E82FD]  text-white px-2 py-2 rounded-md flex items-center gap-2`:`px-2 py-2 hover:text-[#0E82FD] rounded-md `}>
                  <div className='flex items-center gap-4 '>
                    <TicketCheckIcon />
                    <span className='inline'>Manage Bookings</span>
                 </div>
            </NavLink>
              <NavLink to="/Host-dashboard/manage-events" className={({ isActive})=> isActive ? `bg-[#0E82FD]  text-white px-2 py-2 rounded-md flex items-center gap-2`:`px-2 py-2 hover:text-[#0E82FD] rounded-md `}>
                  <div className='flex items-center gap-4 '>
                    🎫
                    <span className='inline'>Manage Events</span>
                 </div>
            </NavLink>
               <NavLink to="/Host-dashboard/update-host-profile" className={({ isActive})=> isActive ? `bg-[#0E82FD]  text-white px-2 py-2 rounded-md flex items-center gap-2`:`px-2 py-2 hover:text-[#0E82FD] rounded-md `}>
                  <div className='flex items-center gap-4 '>
                    <UserCheckIcon />
                    <span className='inline'>Update Profile</span>
                 </div>
            </NavLink>
             <div  className="px-2 cursor-pointer py-2 hover:text-[#0E82FD] rounded-md ">
                  <div onClick={handleLogout} className='flex items-center gap-4 '>
                    <LogInIcon />
                    <span className='inline'>Logout</span>
                 </div>
            </div>

             
           </div>

        </div>
        {/* right side content */}
        {
          location.pathname === '/Host-dashboard' ? (
          <div className='flex w-full md:w-[70%]  items-center justify-center gap-2'>
              <h3 className='text-[#012047] gap-4 flex items-center dark:text-white text-center font-[700] text-[1.5rem] md:text-[2rem]'>Welcome to  Eventify <TicketCheckIcon /> !</h3>
          </div>

          ):(
            <div className='flex w-full flex-col  md:w-[70%] '>
              <Outlet />
            </div>
          )
        }
      </div>

    </div>
  )
}

export default HostDashboard