
const ActiveElectionsCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse h-[380px]">
      <div className="mb-3">
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex items-start mb-1.5">
              <div className="bg-gray-200 rounded-full mr-2 flex-shrink-0 h-8 w-8"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                <div className="h-3.5 bg-gray-200 rounded w-1/3 mb-1.5"></div>
                <div className="h-3.5 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveElectionsCardSkeleton; 