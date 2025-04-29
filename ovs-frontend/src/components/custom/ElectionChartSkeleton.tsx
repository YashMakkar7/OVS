import React from 'react';

const ElectionChartSkeleton = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md animate-pulse">
      <div className="flex justify-between items-center mb-5">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      
      <div className="space-y-8">
        {/* Active Elections Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"></div>
        </div>
        
        {/* Upcoming Elections Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"></div>
        </div>
        
        {/* Completed Elections Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 w-full mt-8 text-center">
        {/* Percentage Indicators Skeleton */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="p-1">
            <div className="flex justify-center mb-1">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionChartSkeleton; 