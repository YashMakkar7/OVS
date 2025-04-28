import React from 'react';
import DashboardCard from './DashboardCard';
import { CalendarIcon, UserIcon, CheckIcon, BoltIcon } from '@heroicons/react/24/outline';

// Mock data - Replace with actual API calls later
const statsData = {
  totalElections: 24,
  activeElections: 5,
  totalVoters: 1250,
  votesCast: 458,
  upcomingElections: 3
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        title="Total Elections Created" 
        value={statsData.totalElections}
        icon={<CalendarIcon className="h-6 w-6" />}
      />
      <DashboardCard 
        title="Active Elections" 
        value={statsData.activeElections}
        icon={<BoltIcon className="h-6 w-6" />}
        className="bg-blue-50"
      />
      <DashboardCard 
        title="Total Voters Registered" 
        value={statsData.totalVoters}
        icon={<UserIcon className="h-6 w-6" />}
      />
      <DashboardCard 
        title="Votes Cast So Far" 
        value={statsData.votesCast}
        icon={<CheckIcon className="h-6 w-6" />}
        className="bg-green-50"
      />
      <DashboardCard 
        title="Upcoming Elections" 
        value={statsData.upcomingElections}
        icon={<CalendarIcon className="h-6 w-6" />}
        className="bg-yellow-50"
      />
    </div>
  );
};

export default StatsCards; 