import { Ticket } from 'lucide-react'
import React from 'react'
import defaultevent from "../../assets/fallbackevent.jpeg"

const EventCard = ({event}) => {
  if(!event) return null
  const {image,title,date,location,starttime,endtime,tickets} = event


  // find min ticket price
  const getMinTicketPrice = (tickets)=>{
     return Math.min(...tickets.map(t=> t.price))
  }

  const {month,day} = getSingleDateFormat(date)
  return (
    <div className='w-full border shadow-md md:w-[400px] h-full  rounded-md flex flex-col  '>
         <div>
            <img src={image || defaultevent} alt="Image" loading='lazy' className='w-full md:h-[200px] object-center rounded-md' />
         </div>
         <div className='flex flex-col md:flex-row  p-4  gap-5'>
            <span className='flex md:flex-col md:items-center text-[1.3rem] md:text-[1rem] gap-2 md:gap-0 font-[500] text-[#4539B4]'>{month || "NA"} <span className='text-black font-[500]'>{day || "NA"}</span></span> 
            <div className='flex flex-col gap-2'>
                <h3 className='font-[500] text-[1rem]'>{title || "NA"}</h3>
                <p className='text-gray-500 max-w-[300px]  font-[500]'>{location || "NA"}</p>
                <span className='text-gray-500 font-[400]'>{formatTime(starttime) || "NA"} - {formatTime(endtime) || "NA"}</span>
                <span className='flex items-center gap-2 text-gray-500 font-[500]'> Start from <Ticket />  INR {getMinTicketPrice(tickets) || 0}</span>
            </div>
         </div>
    </div>
  )
}

export default EventCard


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

const getSingleDateFormat = (dateStr) => {
  if (!dateStr) return { month: "", day: "" };
  const date = new Date(dateStr);
  const month = date.toLocaleString("en-US", { month: "short" }); // "Nov"
  const day = date.getDate(); // 25
  return { month, day };
};


