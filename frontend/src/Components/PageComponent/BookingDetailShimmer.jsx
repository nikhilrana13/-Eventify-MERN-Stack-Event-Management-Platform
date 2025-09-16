import React from 'react'

const BookingDetailShimmer = () => {
  return (
    <div className="border p-4 rounded-md max-w-[1200px] flex md:flex-row flex-col justify-between animate-pulse">
      {/* left side */}
      <div className="flex flex-col md:flex-row flex-wrap md:w-auto w-full gap-4">
        <div className="flex flex-col md:w-[400px] gap-2">
          <div className="h-56 w-full bg-gray-300 rounded-md"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="flex gap-2 p-2">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex p-2 gap-2">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-28 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
           <div className="flex p-2 gap-2">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-28 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
            <div className="flex p-2 gap-2">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-28 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      {/* right side */}
      <div className="flex flex-col gap-3 md:text-right md:w-auto w-full">
        <div className="flex flex-col">
          <div className="h-3 w-20 bg-gray-200 rounded self-end"></div>
          <div className="h-5 w-24 bg-gray-300 rounded self-end"></div>
        </div>
        <div className="h-3 w-32 bg-gray-200 rounded self-end"></div>
      </div>
    </div>
  )
}

export default BookingDetailShimmer