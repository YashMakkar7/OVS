import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/custom/Sidebar";
import StatusManagement from "../components/custom/StatusManagement";
import useElectionStore from "../state_galary/ElectionStore";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

interface Election {
  _id: string;
  title: string;
  description: string;
  totalVotes: number;
  status: 'active' | 'upcoming' | 'completed';
  createdAt: string;
}

export default function ElectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElections, updateElectionStatus } = useElectionStore();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const elections = getElections();
      const foundElection = elections.find(e => e._id === id);
      if (foundElection) {
        setElection(foundElection);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [id, getElections]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (status: 'active' | 'upcoming' | 'completed') => {
    if (!id) return;
    
    setUpdateLoading(true);
    setError(null);
    
    try {
      // Determine which endpoint to call based on the selected status
      let endpoint = '';
      switch (status) {
        case 'active':
          endpoint = `http://localhost:3000/election/status/start/${id}`;
          break;
        case 'upcoming':
          endpoint = `http://localhost:3000/election/status/upcoming/${id}`;
          break;
        case 'completed':
          endpoint = `http://localhost:3000/election/status/complete/${id}`;
          break;
      }
      
      const response = await axios.put(endpoint,{},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      
      if (response.data && response.data.status) {
        // Update the election in the store
        updateElectionStatus(id, status);
        
        // Update the local state
        if (election) {
          setElection({ ...election, status });
        }
      } else {
        setError(response.data.msg || 'Failed to update status');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError('Failed to update election status. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePublishResults = async () => {
    // Empty function for backend call
    console.log("Publishing results");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <button 
          onClick={() => navigate('/election')}
          className="flex items-center text-primaryblue mb-6 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Elections
        </button>

        {loading ? (
          <div className="text-center py-20">
            <p>Loading...</p>
          </div>
        ) : !election ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Election Not Found</h2>
            <p className="text-gray-600">The election you're looking for doesn't exist or has been removed.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-charcol">{election.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(election.status)}`}>
                  {election.status}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-line">{election.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-coolgray p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Total Votes</p>
                  <p className="text-xl font-semibold text-charcol">{election.totalVotes}</p>
                </div>
                <div className="bg-coolgray p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Created On</p>
                  <p className="text-xl font-semibold text-charcol">
                    {new Date(election.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            <StatusManagement 
              currentStatus={election.status}
              onUpdateStatus={handleUpdateStatus}
              onPublishResults={handlePublishResults}
              electionId={election._id}
            />
          </div>
        )}
      </div>
    </div>
  );
} 