import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const DashboardCard = ({ title, value, icon, className }: DashboardCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
    </div>
  );
};

export default DashboardCard; 