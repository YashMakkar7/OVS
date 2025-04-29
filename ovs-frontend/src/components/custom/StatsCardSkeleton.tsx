import React from 'react';

const StatsCardSkeleton = () => {
  // Create an array of 5 items for 5 cards
  const skeletonCards = Array(5).fill(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {skeletonCards.map((_, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-lg shadow-md animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="w-full">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCardSkeleton; 