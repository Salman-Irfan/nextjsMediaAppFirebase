import React from "react";

const SkeletonMedia = () => {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <div className="w-full h-64 sm:h-72 md:h-80 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonMedia;
