import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import BookingDetailShimmer from './BookingDetailShimmer'
import BookingDetailCard from './BookingDetailCard'

const MyBookings = () => {
  const [Bookings,SetBoookings] = useState([])
  const [loading,SetLoading] = useState(false)
  // fetch bookings 
  useEffect(()=>{
     const fetchBookings = async()=>{
      try {
        SetLoading(true)
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/Booking/my-bookings`,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },withCredentials:true
        })
        if(response.data){
          SetBoookings(response?.data?.data)
        }
      } catch (error) {
        console.log("failed to get bookings",error)
      }finally{
        SetLoading(false)
      }
     }
     fetchBookings()
  },[])
  return (
    <div className='w-full'>
      <Navbar />
       <div className=' md:px-[6rem] px-3 py-[2rem] border flex flex-col gap-4 w-full'>
         <div className='flex p-3 md:p-7 flex-col  gap-3 '>
           <h4 className='text-[2rem] font-[700]'>My Bookings</h4>
           <p className='text-gray-500 font-[400]'>View and manage your all Event bookings</p>
         </div>
         {/* booking cards */}
         <div className=' p-3 md:p-7 flex flex-col gap-4'>
            {
              loading ? (
                  [...Array(4)].map((_,index)=>{
                    return (
                      <BookingDetailShimmer key={index} />
                    )
                  })
              ):Bookings?.length > 0 ? (
                Bookings?.map((booking,index)=>{
                  return (
                     <BookingDetailCard Booking={booking} key={booking?._id} index={index + 1}  />
                  )
                })
              ):(
                <p className='text-gray-500 text-center'>No Bookings found</p>
              )
            }
         </div>
      </div>
    </div> 
  )
}

export default MyBookings