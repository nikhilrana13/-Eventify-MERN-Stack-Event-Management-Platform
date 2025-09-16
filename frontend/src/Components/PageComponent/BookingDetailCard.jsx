import React from 'react'
import defaultEvent from "../../assets/fallbackevent.jpeg"
import { Calendar, Clock, LocationEdit, TicketCheckIcon } from 'lucide-react'
const BookingDetailCard = ({Booking,index}) => {
     const{amount,createdAt,paymentStatus,eventId} = Booking
    //  console.log(Booking)
    const {image = {defaultEvent},title = "NA",date = "NA",location = "NA",starttime = "NA",endtime="NA",status="NA"} = eventId || {}
    return (
        <div className='border p-4  rounded-md max-w-[1200px] flex md:flex-row flex-col justify-between'>
        {/* left side */}
        <div className='flex flex-col md:flex-row flex-wrap md:w-auto w-full gap-4'>
            <div className='flex flex-col md:w-[400px] gap-1'>
                <img src={image} className='h-56 w-full  object-cover rounded-md' alt="" />
                 <span className='text-[1rem] font-[600]'>{title}</span>
                 <span className='text-gray-500'> {new Date(date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}</span>
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                    <span className='px-3 py-2 rounded-md font-[600] bg-slate-100'>Booking #{index || 0}</span>
                    {
                        (paymentStatus === "Pending" || paymentStatus === "Failed" ) ?  <span className='px-3 py-1 rounded-md text-white font-medium bg-red-500'>{
                          paymentStatus || "NA"}</span> : <span className='px-3 py-1 rounded-md text-white font-medium bg-green-500'>{paymentStatus}</span>
                    }
                </div>
                <div className='flex gap-2 p-2'>
                  <Clock />
                  <div className='flex flex-col gap-1'>
                     <span className='text-gray-500'>Timing</span>
                     <span className='font-[700]'>{formatTime(starttime) || "NA"} To {formatTime(endtime)}</span>
                  </div>
                </div>
                  <div className='flex p-2 gap-2'>
                  <LocationEdit />
                  <div className='flex flex-col gap-1'>
                     <span className='text-gray-500'> location</span>
                     <span className='font-[700]'>{location}</span>
                  </div>
                </div>
                 <div className='flex p-2 gap-2'>
                  <TicketCheckIcon />
                  <div className='flex flex-col gap-1'>
                     <span className='text-gray-500'>Status</span>
                     <span className='font-[700]'>{status}</span>
                  </div>
                </div>
            </div>
        </div>
        {/* right side */}
        <div className='flex flex-col gap-1 md:text-right md:w-auto w-full'>
            <div className='flex flex-col'>
            <span className='text-gray-500   text-[1rem]'>Total price</span>
            <span className='text-blue-500 text-[1.4rem]'>₹{amount || 0}</span>
            </div>
            
            <span className='text-gray-500'>Booked on {new Date(createdAt).toLocaleDateString('en-GB')}</span>
        </div>

    </div>
  )
}

export default BookingDetailCard

// Helper function to convert 24-hour time to 12-hour format
const formatTime = (time24) => {
  if (!time24) return ""; // if null/undefined
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr || "0", 10); // if minute missing so 0
  if (isNaN(hour) || isNaN(minute)) return ""; // if invalid format
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};