import { ArrowDown, LocationEdit, SearchIcon } from 'lucide-react'
import React from 'react'

const HeroSection = ({userCity}) => {
  return (
    <div className='p-5 flex flex-col gap-5'>
        {/* content */}
         <p className=' text-[2.3rem] md:text-[2.7rem]   text-white  md:leading-[5rem] font-[500]'>
          Dont't miss out! <br />
          Explore the <span className='text-yellow-500'>vibrant events</span> happenning locally and globally.
         </p>
         <div className='py-5 w-full  md:px-6'>
            <div className="flex items-center justify-center px-3 py-5 w-full md:max-w-2xl mx-auto rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden">
        {/* Search Input */}
      <div className=" hidden md:block items-center  px-4">
         <h1 className=' text-[0.8rem] md:text-[1.1rem]'>From Music to Tech explore events near you</h1>
      </div>
      {/* Divider */}
      <div className="h-6  w-px md:block hidden bg-gray-300"></div>
      {/* Location */}
      <div className="flex items-center gap-3 px-2 md:px-8 cursor-pointer">
        <LocationEdit className="text-gray-500 text-xl mr-1" />
        <span className="text-gray-700">{userCity.slice(0,20)}</span>
      </div>
          </div>
         </div>
    </div>
  )
}

export default HeroSection


 