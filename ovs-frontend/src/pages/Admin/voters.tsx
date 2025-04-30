import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/custom/Sidebar";
import UserCard from "../../components/custom/UserCard";
import useUserStore from "../../state_galary/UserStore";
import { Search, AlertCircle, X, Users } from "lucide-react";
import axios from "axios";

interface VotingStats {
  [userId: string]: {
    totalElections: number;
    votedCount: number;
  }
}

export default function Voters() {
  const navigate = useNavigate();
  const { 
    users, 
    filteredUsers, 
    isLoading, 
    searchTerm, 
    fetchUsers, 
    searchUsers,
    setSelectedUser
  } = useUserStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [votingStats, setVotingStats] = useState<VotingStats>({});
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers();
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchUsers();
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(refreshInterval);
  }, [fetchUsers]);

  // Fetch voting stats for all users
  useEffect(() => {
    const fetchVotingStatsForUsers = async () => {
      if (users.length === 0) return;
      
      setStatsLoading(true);
      
      try {
        // First, get all elections to know the total count
        const electionResponse = await axios.get('http://localhost:3000/election/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        let totalElectionsCount = 0;
        if (electionResponse.data && electionResponse.data.elections) {
          totalElectionsCount = electionResponse.data.elections.length;
        }
        
        // Create a temporary object to store stats
        const stats: VotingStats = {};
        
        // For each user, fetch their voting history
        for (const user of users) {
          try {
            const response = await axios.get(`http://localhost:3000/vote/history/${user._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
            
            if (response.data && response.data.votingHistory) {
              const history = response.data.votingHistory;
              // Use the actual history length or the total elections count, whichever is larger
              const totalElections = Math.max(history.length, totalElectionsCount);
              const votedCount = history.filter((item: any) => item.hasVoted).length;
              
              stats[user._id] = {
                totalElections,
                votedCount
              };
            } else {
              // If no voting history is available, still use the total elections count
              stats[user._id] = {
                totalElections: totalElectionsCount,
                votedCount: 0
              };
            }
          } catch (error) {
            console.error(`Error fetching stats for user ${user._id}:`, error);
            // In case of error, provide default values
            stats[user._id] = {
              totalElections: totalElectionsCount,
              votedCount: 0
            };
          }
        }
        
        // Update state with all collected stats
        setVotingStats(stats);
      } catch (error) {
        console.error("Error fetching voting stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchVotingStatsForUsers();
  }, [users]);

  // Debounce search term to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(debouncedSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, searchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setDebouncedSearchTerm('');
    searchUsers('');
  };

  const handleUserClick = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
      navigate(`/voter/${userId}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-charcol">Registered Voters</h1>
              <p className="text-gray-500 mt-1">View and manage voter profiles</p>
            </div>
            
            {/* Users stats card */}
            <div className="bg-white px-5 py-4 rounded-xl shadow-sm flex items-center gap-3 min-w-52">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users size={20} className="text-primaryblue" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Voters</p>
                <p className="text-xl font-semibold text-charcol">{users.length}</p>
              </div>
            </div>
          </div>
          
          {/* Search bar with floating design */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search voters by name, email, or ID..."
              className="pl-12 pr-12 py-4 w-full border border-gray-200 rounded-xl focus:ring-primaryblue focus:border-primaryblue shadow-sm"
              value={debouncedSearchTerm}
              onChange={handleSearch}
              autoFocus
            />
            {debouncedSearchTerm && (
              <button 
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* User list with animated transitions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              // Skeleton loaders
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100">
                    <div className="h-full bg-gray-200" style={{ width: '30%' }}></div>
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <AlertCircle size={40} className="mx-auto mb-3 text-amber-500" />
                  {searchTerm ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No matching voters found</h3>
                      <p className="text-gray-600 mb-4">We couldn't find any voters matching "{searchTerm}"</p>
                      <button
                        onClick={handleClearSearch}
                        className="text-primaryblue hover:underline font-medium"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No registered voters</h3>
                      <p className="text-gray-600">No voters have registered in the system yet.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              filteredUsers.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  onClick={() => handleUserClick(user._id)}
                  isSelected={false}
                  votingStats={votingStats[user._id]}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

