export const EventShimmer = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5">
      {/* Image shimmer */}
      <div className="w-full h-[300px] md:h-[500px] bg-gray-200 rounded-md" />

      {/* Title shimmer */}
      <div className="flex flex-col gap-3 px-5">
        <div className="h-8 w-1/2 bg-gray-200 rounded" />
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
      </div>

      {/* Date & time shimmer */}
      <div className="flex flex-col gap-3 px-5">
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* Tickets shimmer */}
      <div className="flex flex-col gap-3 px-5">
        <div className="h-8 w-32 bg-gray-200 rounded" />
        <div className="h-6 w-40 bg-gray-200 rounded" />
      </div>

      {/* Map shimmer */}
      <div className="w-full md:h-[400px] h-[250px] bg-gray-200 rounded-md" />

      {/* Hosted by shimmer */}
      <div className="flex gap-3 p-5">
        <div className="h-20 w-20 bg-gray-200 rounded-full" />
        <div className="h-6 w-32 bg-gray-200 rounded" />
      </div>

      {/* Description shimmer */}
      <div className="flex flex-col gap-3 px-5">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="h-6 w-full bg-gray-200 rounded" />
        <div className="h-6 w-5/6 bg-gray-200 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
