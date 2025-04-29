
import DashboardCard from './DashboardCard';
import { CalendarIcon, UserIcon, CheckIcon, BoltIcon } from '@heroicons/react/24/solid';

interface DashboardData {
  totalElections: number;
  activeElections: number;
  totalVoters: number;
  votesCast: number;
  upcomingElections: number;
  completedElections?: number;
}

interface StatsCardsProps {
  data: DashboardData;
}

const StatsCards = ({ data }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        title="Total Elections Created" 
        value={data.totalElections}
        icon={<CalendarIcon className="h-6 w-6" />}
      />
      <DashboardCard 
        title="Active Elections" 
        value={data.activeElections}
        icon={<BoltIcon className="h-6 w-6" />}
        className="bg-blue-50"
      />
      <DashboardCard 
        title="Total Voters Registered" 
        value={data.totalVoters}
        icon={<UserIcon className="h-6 w-6" />}
      />
      <DashboardCard 
        title="Votes Cast So Far" 
        value={data.votesCast}
        icon={<CheckIcon className="h-6 w-6" />}
        className="bg-green-50"
      />
      <DashboardCard 
        title="Upcoming Elections" 
        value={data.upcomingElections}
        icon={<CalendarIcon className="h-6 w-6" />}
        className="bg-yellow-50"
      />
    </div>
  );
};

export default StatsCards; 