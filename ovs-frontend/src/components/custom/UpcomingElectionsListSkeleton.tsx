import React from 'react';

const UpcomingElectionsListSkeleton = () => {
  // Create array for 3 skeleton items
  const skeletonItems = Array(3).fill(0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-4">
        {skeletonItems.map((_, index) => (
          <div key={index} className="border-b pb-3 last:border-0">
            <div className="flex items-start">
              <div className="bg-gray-200 p-2 rounded-full mr-3 h-9 w-9"></div>
              <div className="w-full">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingElectionsListSkeleton; 