import React from 'react'

const EventCardShimmer = () => {
  return (
    <div className='w-full border shadow-md md:w-[400px] rounded-md flex flex-col overflow-hidden animate-pulse'>
      {/* Image shimmer */}
      <div className='w-full md:h-[200px] bg-gray-300 rounded-md'></div>

      {/* Content shimmer */}
      <div className='flex flex-col md:flex-row p-4 gap-5'>
        {/* Date shimmer */}
        <div className='flex md:flex-col md:items-center gap-3 md:gap-0'>
          <div className='w-12 h-6 bg-gray-300 rounded'></div>
          <div className='w-16 h-6 bg-gray-300 rounded'></div>
        </div>

        {/* Text shimmer */}
        <div className='flex flex-col gap-2 flex-1'>
          <div className='w-3/4 h-6 bg-gray-300 rounded'></div>
          <div className='w-1/2 h-4 bg-gray-300 rounded'></div>
          <div className='w-1/3 h-4 bg-gray-300 rounded'></div>
          <div className='w-1/4 h-4 bg-gray-300 rounded'></div>
        </div>
      </div>
    </div>
  )
}

export default EventCardShimmer
