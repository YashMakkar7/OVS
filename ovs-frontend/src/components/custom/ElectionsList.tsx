import { useState, useEffect } from 'react';
import axios from 'axios';
import ElectionCard from './ElectionCard';
import useElectionStore from '../../state_galary/ElectionStore';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import useDeleteConfirmationStore from '../../state_galary/DeleteConfirmationStore';

type FilterStatus = 'all' | 'active' | 'upcoming' | 'completed';

const ElectionsList = () => {
  const { setElections, elections } = useElectionStore();
  const { openDialog } = useDeleteConfirmationStore();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [filteredElections, setFilteredElections] = useState(elections);
  const [isDeleting, setIsDeleting] = useState(false);

  // This effect updates filtered elections when either the filter changes OR the actual elections data changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredElections(elections);
    } else {
      setFilteredElections(elections.filter(election => election.status === filter));
    }
  }, [filter, elections]);

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  const handleDeleteElection = (id: string) => {
    const election = elections.find(e => e._id === id);
    if (election) {
      openDialog(id, election.title);
    }
  };

  const confirmDelete = async (id: string) => {
    setIsDeleting(true);
    
    // Get current elections for optimistic update
    const currentElections = [...elections];
    
    // Optimistic update - remove from store immediately
    setElections(currentElections.filter(election => election._id !== id));
    
    try {
      // Then make the API call
      await axios.delete(`http://localhost:3000/election/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Election deleted successfully');
      
      // Already updated the UI optimistically, so no need to update again on success
    } catch (error) {
      console.error('Error deleting election:', error);
      
      // If the API call fails, revert to the original list
      setElections(currentElections);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 text-sm rounded-lg ${
            filter === 'all' 
              ? 'bg-primaryblue text-white' 
              : 'bg-coolgray text-charcol hover:bg-shadowgray'
          }`}
          disabled={isDeleting}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('active')}
          className={`px-4 py-2 text-sm rounded-lg ${
            filter === 'active' 
              ? 'bg-primaryblue text-white' 
              : 'bg-coolgray text-charcol hover:bg-shadowgray'
          }`}
          disabled={isDeleting}
        >
          Active
        </button>
        <button
          onClick={() => handleFilterChange('upcoming')}
          className={`px-4 py-2 text-sm rounded-lg ${
            filter === 'upcoming' 
              ? 'bg-primaryblue text-white' 
              : 'bg-coolgray text-charcol hover:bg-shadowgray'
          }`}
          disabled={isDeleting}
        >
          Upcoming
        </button>
        <button
          onClick={() => handleFilterChange('completed')}
          className={`px-4 py-2 text-sm rounded-lg ${
            filter === 'completed' 
              ? 'bg-primaryblue text-white' 
              : 'bg-coolgray text-charcol hover:bg-shadowgray'
          }`}
          disabled={isDeleting}
        >
          Completed
        </button>
      </div>

      {filteredElections.length === 0 ? (
        <div className="text-center py-10 bg-coolgray rounded-lg">
          <p className="text-charcol">No elections found with the selected filter.</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isDeleting ? 'opacity-70 pointer-events-none' : ''}`}>
          {filteredElections.map((election) => (
            <ElectionCard
              key={election._id}
              _id={election._id}
              title={election.title}
              description={election.description}
              totalVotes={election.totalVotes}
              status={election.status}
              createdAt={election.createdAt}
              onDelete={handleDeleteElection}
            />
          ))}
        </div>
      )}
      
      <DeleteConfirmationDialog onConfirm={confirmDelete} />
    </div>
  );
};

export default ElectionsList; 