import React from 'react'
import { LocationEdit, SearchIcon } from 'lucide-react'
import { Button } from '../ui/button'

const EventPageHeroSection = React.memo(({SetSearchInput,setLocation,searchInput,Location}) => {


  return (
        <div className='p-5 flex flex-col gap-5'>
        {/* content */}
         <p className=' text-[2.3rem] md:text-[2.7rem]    text-white  md:leading-[5rem] font-[500]'>
           Explore a world of events.find what excites you!
         </p>
         <div className=' w-full  '>
            <div className="flex flex-col md:flex-row md:justify-center md:items-center  w-full md:max-w-2xl mx-auto rounded-md md:rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden">
        {/* Search Input */}
      <div className=" flex items-center  px-3 py-5 ">
       <SearchIcon className="text-gray-500 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search Events, Categories..."
          aria-label="Search Events and Categories"
          value={searchInput}
          onChange={(e)=>SetSearchInput(e.target.value)}
          className="w-full  outline-none  text-gray-700 placeholder-gray-400"
        />
      </div>
      {/* Divider */}
      <div className="h-6 hidden md:block w-px  bg-gray-300"></div>
      <hr className='md:hidden border block' />
      {/* Location */}
      <div className="flex items-center   px-3 py-5  cursor-pointer">
        <LocationEdit className="text-gray-500 text-xl mr-2" />
        <input type='text' onChange={(e)=>setLocation(e.target.value)} aria-label="e.g mumbai" placeholder='e.g mumbai' className="w-full outline-none   text-gray-700 placeholder-gray-400" />
      </div>
       <hr className='md:hidden border block' />
          </div>
         </div>
    </div>
  )
})

export default EventPageHeroSection