import { useNavigate } from 'react-router-dom';
import { Trash2, Users, Calendar, Check, Award, Clock } from 'lucide-react';

interface ElectionCardProps {
  _id: string;
  title: string;
  description: string;
  totalVotes: number;
  status: 'active' | 'upcoming' | 'completed';
  createdAt: string;
  onDelete: (id: string) => void;
}

const ElectionCard = ({
  _id,
  title,
  description,
  totalVotes,
  status,
  createdAt,
  onDelete
}: ElectionCardProps) => {
  const navigate = useNavigate();

  const getStatusBadgeClass = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Check size={14} className="mr-1" />;
      case 'upcoming':
        return <Clock size={14} className="mr-1" />;
      case 'completed':
        return <Award size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    navigate(`/election/${_id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    onDelete(_id);
  };

  // Format the date to be more readable
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full overflow-hidden"
    >
      <div className="flex justify-between mb-2">
        <div className="flex-1 min-w-0 mr-3">
          <h3 
            onClick={handleClick} 
            className="font-semibold text-lg text-charcol cursor-pointer hover:underline hover:text-primaryblue line-clamp-2 break-words"
            title={title}
          >
            {title}
          </h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass()} flex-shrink-0 flex items-center h-fit mt-1`}>
          {getStatusIcon()}
          {status}
        </span>
      </div>
      
      <div className="border-l-4 border-gray-200 pl-3 my-3 overflow-hidden">
        <p 
          className="text-sm text-gray-600 line-clamp-2 overflow-ellipsis"
          title={description}
        >
          {description}
        </p>
      </div>
      
      <div className="flex flex-col space-y-2 mt-3 mb-4 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center text-xs text-gray-600">
          <Users size={14} className="mr-2 text-primaryblue flex-shrink-0" />
          <span className="truncate"><span className="font-medium">{totalVotes}</span> votes recorded</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Calendar size={14} className="mr-2 text-primaryblue flex-shrink-0" />
          <span className="truncate">Created on <span className="font-medium">{formattedDate}</span></span>
        </div>
      </div>
      
      <div className="mt-auto flex justify-between items-center">
        <span className="text-xs text-primaryblue hover:underline cursor-pointer" onClick={handleClick}>View details</span>
        <button 
          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer flex-shrink-0"
          onClick={handleDelete}
          aria-label="Delete election"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ElectionCard; 