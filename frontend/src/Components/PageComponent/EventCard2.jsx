import { Ticket } from 'lucide-react'
import React from 'react'
import defaultevent from "../../assets/fallbackevent.jpeg"

const EventCard2 = ({eventdetail}) => {
    if(!eventdetail) return null
   const {image,title,date,location,starttime,endtime,tickets} = eventdetail

      // find min ticket price
  const getMinTicketPrice = (tickets = [])=>{
    if(tickets.length === 0) return "NA"
     return Math.min(...tickets.map(t=> t.price))
  }

  const {month,day} = getSingleDateFormat(date)
  return (
    <div className='flex flex-col  md:w-[450px] w-full gap-2 md:h-[150px] mx-auto   md:flex-row '>
       <div className='md:w-[200px] md:h-[150px] flex-shrink-0'>
          <img src={image || defaultevent} alt="image" loading='lazy' className='w-full h-full rounded-md object-cover' />
       </div>
       <div className='flex flex-col gap-2'>
         <p className='text-black  max-w-[250px] overflow-hidden font-[500]'>
           {title || "NA"}
         </p>
         <span className='text-gray-500 font-[500]'>
            {day || "NA"} {month || "NA"} | {location || "NA"}
         </span>
         <span className='text-gray-500 font-[400]' >
            {formatTime(starttime) || "NA"} - {formatTime(endtime) ||"NA"}
         </span>
         <span className='text-green-500 flex items-center font-[400]' >
           <Ticket className='w-10' />  INR {getMinTicketPrice(tickets) || 0}
         </span>
       </div>
    </div>
  )
}

export default EventCard2

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