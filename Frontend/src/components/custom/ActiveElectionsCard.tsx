import { BoltIcon } from '@heroicons/react/24/solid';

interface Election {
  _id: string;
  creator: string;
  title: string;
  description: string;
  totalVotes: number;
  status: 'active' | 'upcoming' | 'completed';
  createdAt: string;
  __v: number;
}

interface ActiveElectionsCardProps {
  elections?: Election[];
}

const ActiveElectionsCard = ({ elections = [] }: ActiveElectionsCardProps) => {
  // Calculate participation rate
  const getParticipationRate = (votesCast: number, voters: number) => {
    return voters > 0 ? Math.round((votesCast / voters) * 100) : 0;
  };

  // Filter active elections
  const activeElections = elections.filter(election => election.status === 'active');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[390px] flex flex-col">
      <h3 className="text-lg font-bold mb-3">Active Elections</h3>
      
      {activeElections.length === 0 ? (
        <div className="py-6 text-center text-gray-500 flex-grow flex items-center justify-center">
          <span className="text-sm">No active elections at the moment.</span>
        </div>
      ) : (
        <div className="space-y-4 overflow-auto flex-grow pr-1">
          {activeElections.map(election => (
            <div key={election._id}>
              <div className="flex items-start mb-1.5">
                <div className="bg-blue-100 p-1.5 rounded-full mr-2 flex-shrink-0">
                  <BoltIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{election.title}</h4>
                  <div className="text-xs font-medium text-blue-600">
                    {getParticipationRate(election.totalVotes, 0)}% Participation
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${getParticipationRate(election.totalVotes, 0)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveElectionsCard; 