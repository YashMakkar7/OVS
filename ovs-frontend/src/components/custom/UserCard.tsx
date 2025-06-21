import { User } from "../../state_galary/UserStore";
import { Calendar, Mail, CreditCard, CheckCircle } from "lucide-react";

interface UserCardProps {
  user: User;
  onClick: () => void;
  isSelected: boolean;
  votingStats?: {
    totalElections: number;
    votedCount: number;
  };
}

const UserCard = ({ user, onClick, isSelected, votingStats }: UserCardProps) => {
  // Generate a unique, deterministic color based on the username
  const getProfileColor = (username: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-rose-100 text-rose-600',
      'bg-amber-100 text-amber-600',
      'bg-teal-100 text-teal-600',
      'bg-indigo-100 text-indigo-600',
      'bg-cyan-100 text-cyan-600'
    ];
    
    // Use a simple hash function to get a consistent index
    const hashCode = username.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    return colors[hashCode % colors.length];
  };

  // Get initials from username (up to 2 characters)
  const getInitials = (username: string) => {
    if (!username) return '?';
    
    const parts = username.split(/[\s-_]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  };

  const profileColorClass = getProfileColor(user.username);
  const initials = getInitials(user.username);

  // Calculate voting percentage if stats are available
  const votingPercentage = votingStats && votingStats.totalElections > 0
    ? Math.round((votingStats.votedCount / votingStats.totalElections) * 100)
    : 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-white overflow-hidden transition-all cursor-pointer hover:shadow-md rounded-xl ${
        isSelected ? 'border-2 border-primaryblue shadow-md' : 'border border-gray-200'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${profileColorClass}`}>
            {initials}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-charcol truncate">{user.username}</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-gray-600 truncate">
                <Mail size={14} className="mr-2 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard size={14} className="mr-2 shrink-0" />
                <span className="truncate">Adhar ID: {user.adharId}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={14} className="mr-2 shrink-0" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-gray-100">
        {votingStats ? (
          <div 
            className={`h-full ${
              votingPercentage > 75 ? 'bg-green-500' : 
              votingPercentage > 50 ? 'bg-blue-500' : 
              votingPercentage > 25 ? 'bg-amber-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${votingPercentage}%` }}
          />
        ) : (
          <div className={`h-full ${profileColorClass.split(' ')[0]}`} style={{ width: '30%' }}></div>
        )}
      </div>
      
      {votingStats && (
        <div className="flex justify-between items-center px-5 py-2 text-xs text-gray-600 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-gray-500" />
            <span>{votingStats.votedCount}/{votingStats.totalElections} voted</span>
          </div>
          <div className="font-medium">
            {votingPercentage}% participation
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard; 