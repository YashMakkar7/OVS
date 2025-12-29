import { useEffect, useState, useRef } from 'react';

interface ElectionData {
  active: number;
  upcoming: number;
  completed: number;
}

interface ElectionChartProps {
  title: string;
  data?: ElectionData;
  className?: string;
}

const ElectionChart = ({ title, data = { active: 0, upcoming: 0, completed: 0 }, className }: ElectionChartProps) => {
  // Animation state for progress bars
  const [activeWidth, setActiveWidth] = useState(0);
  const [upcomingWidth, setUpcomingWidth] = useState(0);
  const [completedWidth, setCompletedWidth] = useState(0);
  const isFirstRender = useRef(true);
  const prevData = useRef<ElectionData>(data);
  
  // Calculate total for percentage calculations
  const total = data.active + data.upcoming + data.completed;
  
  // Calculate percentages for display
  const getPercentage = (value: number) => {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  };
  
  // Set initial widths immediately if we have data on first render
  useEffect(() => {
    if (isFirstRender.current && total > 0) {
      // Set initial values without animation for first meaningful render
      setActiveWidth(getPercentage(data.active));
      setUpcomingWidth(getPercentage(data.upcoming));
      setCompletedWidth(getPercentage(data.completed));
      isFirstRender.current = false;
      prevData.current = data;
    }
  }, [total]);
  
  // Only animate when data actually changes from previous values
  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      return;
    }
    
    // Check if data changed significantly to avoid unnecessary animations
    const hasSignificantChange = 
      prevData.current.active !== data.active || 
      prevData.current.upcoming !== data.upcoming || 
      prevData.current.completed !== data.completed;
      
    if (hasSignificantChange) {
      // Smoothly animate to new values
      const timer = setTimeout(() => {
        setActiveWidth(getPercentage(data.active));
        setUpcomingWidth(getPercentage(data.upcoming));
        setCompletedWidth(getPercentage(data.completed));
      }, 50);
      
      prevData.current = data;
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Prepare static content early to avoid layout shifts
  return (
    <div className={`bg-white p-5 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="text-sm text-gray-500">Total: {total} elections</div>
      </div>
      
      <div className="space-y-8">
        {/* Active Elections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-md font-medium text-gray-700">Active Elections</span>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">{data.active}</span>
              <span className="text-sm text-gray-500">({getPercentage(data.active)}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${activeWidth}%` }}
            ></div>
          </div>
        </div>
        
        {/* Upcoming Elections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-md font-medium text-gray-700">Upcoming Elections</span>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">{data.upcoming}</span>
              <span className="text-sm text-gray-500">({getPercentage(data.upcoming)}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${upcomingWidth}%` }}
            ></div>
          </div>
        </div>
        
        {/* Completed Elections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-md font-medium text-gray-700">Completed Elections</span>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">{data.completed}</span>
              <span className="text-sm text-gray-500">({getPercentage(data.completed)}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${completedWidth}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 w-full mt-8 text-center">
        <div className="p-1">
          <div className="flex justify-center mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <div className="text-lg font-bold">{getPercentage(data.active)}%</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div className="p-1">
          <div className="flex justify-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
          <div className="text-lg font-bold">{getPercentage(data.upcoming)}%</div>
          <div className="text-xs text-gray-500">Upcoming</div>
        </div>
        <div className="p-1">
          <div className="flex justify-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-lg font-bold">{getPercentage(data.completed)}%</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
      </div>
    </div>
  );
};

export default ElectionChart; 