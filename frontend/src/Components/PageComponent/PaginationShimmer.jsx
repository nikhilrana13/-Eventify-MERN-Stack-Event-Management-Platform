import React from "react";

const PaginationShimmer = () => {
  return (
      <div className="p-5 mt-5 flex justify-center">
      <div className="flex items-center gap-2 animate-pulse">
        {/* Previous button shape */}
        <div className="h-9 w-[70px] rounded-md bg-gray-200"></div>
        {/* Page text (current/total) */}
        <div className="h-9 w-[100px] rounded-md bg-gray-200"></div>
        {/* Ellipsis shape */}
        <div className="h-9 w-8 rounded-md bg-gray-200"></div>
        {/* Next button shape */}
        <div className="h-9 w-[80px] rounded-md bg-gray-200"></div>
      </div>
    </div>



)}

export default PaginationShimmer;
