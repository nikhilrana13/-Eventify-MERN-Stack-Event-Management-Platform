import React from "react";

const EventCard2Shimmer = () => {
  return (
    <div className="flex flex-col md:w-[450px] w-full gap-2 md:h-[150px] mx-auto md:flex-row animate-pulse">
      {/* Image shimmer */}
      <div className="md:w-[200px] md:h-[150px] flex-shrink-0 bg-gray-300 rounded-md"></div>

      {/* Text shimmer */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default EventCard2Shimmer;
