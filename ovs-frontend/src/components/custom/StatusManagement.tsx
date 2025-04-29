import { useState, useEffect, ReactNode } from 'react';

interface StatusManagementProps {
  currentStatus: 'active' | 'upcoming' | 'completed';
  onUpdateStatus: (status: 'active' | 'upcoming' | 'completed') => void;
  onPublishResults: () => void;
  electionId: string;
}

type StatusOption = {
  value: 'upcoming' | 'active' | 'completed';
  label: string;
  color: string;
  icon: ReactNode;
};

const StatusManagement = ({ 
  currentStatus, 
  onUpdateStatus, 
  onPublishResults,
  electionId
}: StatusManagementProps) => {
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'upcoming' | 'completed'>(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const statusOptions: StatusOption[] = [
    {
      value: 'upcoming',
      label: 'Upcoming',
      color: 'blue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      value: 'active',
      label: 'Active',
      color: 'green',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      value: 'completed',
      label: 'Completed',
      color: 'purple',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-charcol">Status Management</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Current Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statusOptions.map((option) => {
          // Dynamic class selection based on status
          const isSelected = selectedStatus === option.value;
          let buttonClasses = 'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ';
          let iconContainerClasses = 'w-12 h-12 rounded-full flex items-center justify-center mb-2 ';
          let textClasses = 'font-medium ';
          
          if (option.value === 'upcoming') {
            buttonClasses += isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50';
            iconContainerClasses += isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500';
            textClasses += isSelected ? 'text-blue-700' : 'text-gray-700';
          } else if (option.value === 'active') {
            buttonClasses += isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50';
            iconContainerClasses += isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-500';
            textClasses += isSelected ? 'text-green-700' : 'text-gray-700';
          } else if (option.value === 'completed') {
            buttonClasses += isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50';
            iconContainerClasses += isSelected ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-500';
            textClasses += isSelected ? 'text-purple-700' : 'text-gray-700';
          }

          return (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={buttonClasses}
            >
              <div className={iconContainerClasses}>
                {option.icon}
              </div>
              <span className={textClasses}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 w-full">
          <button
            onClick={() => onUpdateStatus(selectedStatus)}
            className="w-full px-4 py-3 bg-primaryblue text-white rounded-md hover:bg-blue-600 transition-colors font-medium flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Update Status
          </button>
        </div>
        
        <div className="flex-1 w-full">
          <button
            onClick={onPublishResults}
            disabled={currentStatus !== 'completed'}
            className={`w-full px-4 py-3 rounded-md transition-colors font-medium flex items-center justify-center ${
              currentStatus === 'completed'
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Publish Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusManagement; 