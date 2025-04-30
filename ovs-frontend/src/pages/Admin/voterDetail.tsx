import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/custom/Sidebar";
import useUserStore from "../../state_galary/UserStore";
import useElectionStore from "../../state_galary/ElectionStore";
import { ArrowLeft, Mail, Calendar, CreditCard, CheckCircle, Clock, Vote, XCircle } from "lucide-react";
import axios from "axios";

export default function VoterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    users, 
    selectedUser, 
    setSelectedUser, 
    fetchUserVotingHistory 
  } = useUserStore();
  const { elections, getElections } = useElectionStore();
  const [totalElections, setTotalElections] = useState(0);

  useEffect(() => {
    // If we have an ID but no selected user, find the user and set it
    if (id && (!selectedUser.user || selectedUser.user._id !== id)) {
      const user = users.find(u => u._id === id);
      if (user) {
        setSelectedUser(user);
      } else {
        // User not found in store, navigate back to voters list
        navigate('/voters');
      }
    }
  }, [id, users, selectedUser.user, setSelectedUser, navigate]);

  // Get total elections count
  useEffect(() => {
    const fetchTotalElections = async () => {
      // First try to get from local store
      const storedElections = getElections();
      if (storedElections && storedElections.length > 0) {
        setTotalElections(storedElections.length);
        return;
      }
      
      // If not available in store, fetch from API
      try {
        const response = await axios.get('http://localhost:3000/election/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (response.data && response.data.elections) {
          setTotalElections(response.data.elections.length);
        }
      } catch (error) {
        console.error("Error fetching total elections:", error);
      }
    };
    
    fetchTotalElections();
  }, [getElections]);

  // Set up auto-refresh of voting history
  useEffect(() => {
    if (id) {
      // Initial fetch
      fetchUserVotingHistory(id);
      
      // Set up auto-refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        fetchUserVotingHistory(id);
      }, 30000);
      
      // Clean up on unmount
      return () => clearInterval(refreshInterval);
    }
  }, [id, fetchUserVotingHistory]);

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
    
    const hashCode = username.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    return colors[hashCode % colors.length];
  };

  // Get initials from username
  const getInitials = (username: string) => {
    if (!username) return '?';
    
    const parts = username.split(/[\s-_]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  };
  
  // Calculate voting stats if user is loaded
  const votingStats = selectedUser.user ? {
    totalElections: Math.max(totalElections, selectedUser.votingHistory.length),
    votedCount: selectedUser.votingHistory.filter(v => v.hasVoted).length
  } : { totalElections: 0, votedCount: 0 };
  
  const votingPercentage = votingStats.totalElections > 0 
    ? Math.round((votingStats.votedCount / votingStats.totalElections) * 100) 
    : 0;

  // Format date and time
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      // Format date as DD/MM/YYYY
      const formattedDate = date.toLocaleDateString();
      
      // Format time as HH:MM AM/PM
      const formattedTime = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return `${formattedDate} at ${formattedTime}`;
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <button 
          onClick={() => navigate('/voters')}
          className="flex items-center text-primaryblue mb-6 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Voters
        </button>

        {!selectedUser.user ? (
          <div className="flex justify-center items-center h-[80vh]">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 mx-auto mb-4 border-t-2 border-b-2 border-primaryblue rounded-full"></div>
              <p className="text-gray-600">Loading voter details...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-charcol">Voter Profile</h1>
            
            {/* Profile header section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-primaryblue to-blue-600"></div>
              
              <div className="p-6 relative">
                <div className={`w-24 h-24 rounded-full ${getProfileColor(selectedUser.user.username)} absolute -top-12 left-8 flex items-center justify-center text-3xl font-bold border-4 border-white`}>
                  {getInitials(selectedUser.user.username)}
                </div>
                
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-charcol">{selectedUser.user.username}</h2>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700 gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail size={20} className="text-primaryblue" />
                      <span>{selectedUser.user.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard size={20} className="text-primaryblue" />
                      <span>Adhar ID: {selectedUser.user.adharId}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar size={20} className="text-primaryblue" />
                      <span>Joined: {new Date(selectedUser.user.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle size={20} className={votingStats.totalElections > 0 ? "text-primaryblue" : "text-gray-400"} />
                      <span>
                        Participation Rate: {votingPercentage}% 
                        {votingStats.totalElections === 0 && (
                          <span className="text-xs text-gray-500 ml-1">(No elections available)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Voting statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Total Elections</div>
                <div className="text-2xl font-bold text-charcol">{votingStats.totalElections}</div>
                {votingStats.totalElections === 0 && (
                  <div className="text-xs text-gray-500 mt-1">No elections available</div>
                )}
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Elections Voted</div>
                <div className="text-2xl font-bold text-green-600">{votingStats.votedCount}</div>
                {votingStats.totalElections > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {votingStats.votedCount === 0 
                      ? "Has not voted in any election" 
                      : `Voted in ${votingStats.votedCount} out of ${votingStats.totalElections}`}
                  </div>
                )}
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Participation Rate</div>
                <div className="text-2xl font-bold text-primaryblue">{votingPercentage}%</div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      votingPercentage > 75 ? "bg-green-500" : 
                      votingPercentage > 50 ? "bg-blue-500" : 
                      votingPercentage > 25 ? "bg-amber-500" : 
                      votingPercentage > 0 ? "bg-red-500" : "bg-gray-200"
                    }`}
                    style={{ width: `${votingPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Election voting history */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-charcol">Voting History</h2>
                {selectedUser.isLoading && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={14} className="animate-spin mr-1" />
                    Refreshing...
                  </div>
                )}
              </div>
              
              {selectedUser.votingHistory.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
                  <h3 className="text-gray-600 font-medium mb-1">No Elections Available</h3>
                  <p className="text-gray-500 text-sm">This voter has no elections to participate in yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedUser.votingHistory.map(item => (
                    <div 
                      key={item.electionId} 
                      className="border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800">{item.electionTitle}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              item.electionStatus === 'active' ? 'bg-green-100 text-green-700' :
                              item.electionStatus === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.electionStatus}
                            </span>
                          </div>
                        </div>
                        <div>
                          {item.hasVoted ? (
                            <span className="inline-flex items-center bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                              <CheckCircle size={14} className="mr-1" />
                              Voted
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm">
                              <XCircle size={14} className="mr-1" />
                              Not Voted
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {item.hasVoted && item.voteDetails && (
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Vote size={14} className="text-gray-500" />
                              <span className="text-gray-500">Voted for:</span>
                              <span className="font-medium text-gray-700">{item.voteDetails.candidateName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-gray-500" />
                              <span className="text-gray-500">Vote cast on:</span>
                              <span className="font-medium text-gray-700">{formatDateTime(item.voteDetails.votedAt)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 