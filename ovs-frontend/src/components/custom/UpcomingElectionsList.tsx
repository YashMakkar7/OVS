import { CalendarIcon, UserIcon } from '@heroicons/react/24/solid';
import useElectionStore from '../../state_galary/ElectionStore';
import { useNavigate } from 'react-router-dom';
const UpcomingElectionsList = () => {
  const { getElections } = useElectionStore();
  const elections = getElections();
  const navigate = useNavigate();
  
  // Filter upcoming elections
  const upcomingElections = elections.filter(election => election.status === 'upcoming');

  return (
    <div className="bg-white rounded-lg shadow-md p-3 h-[250px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-700">Upcoming Elections</h3>
        <button className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => navigate('/election')}>View all</button>
      </div>
      {upcomingElections.length === 0 ? (
        <div className="py-4 text-center text-gray-400 flex-grow flex items-center justify-center text-sm">
          No upcoming elections
        </div>
      ) : (
        <div className="space-y-3 overflow-auto flex-grow pr-1">
          {upcomingElections.map(election => (
            <div key={election._id} className="flex items-center p-3 rounded-lg transition-colors border border-gray-100">
              <div className="bg-yellow-50 p-2 rounded-full mr-3">
                <CalendarIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <span className="text-base font-medium text-gray-700 block">{election.title}</span>
                <div className="flex items-center mt-1 space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <UserIcon className="h-3 w-3 mr-1" />
                    <span>{election.totalVotes} votes</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Created at {new Date(election.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingElectionsList; 