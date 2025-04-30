import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import useCandidateStore, { Candidate } from '../../state_galary/CandidateStore';
import axios from 'axios';

interface VotingComponentProps {
  electionId: string;
}

const VotingComponent = ({ electionId }: VotingComponentProps) => {
  const { fetchCandidates } = useCandidateStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const fetchedCandidates = await fetchCandidates(electionId);
        setCandidates(fetchedCandidates);
        
        // Check if user has already voted
        checkVoteStatus();
      } catch (err) {
        setError('Failed to load candidates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCandidates();
  }, [electionId, fetchCandidates]);

  const checkVoteStatus = async () => {
    try {
      // You might need to implement this endpoint on your backend
      const response = await axios.get(`http://localhost:3000/election/check-vote/${electionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.data && response.data.hasVoted) {
        setHasVoted(true);
      }
    } catch (err) {
      console.error("Error checking vote status:", err);
    }
  };

  const handleSubmitVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to vote');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `http://localhost:3000/election/vote/${electionId}/${selectedCandidate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      if (response.data && response.status === 200) {
        setVoteSuccess(true);
        setHasVoted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="text-center py-10">
          <p>Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (voteSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-center text-green-600 mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Vote Cast Successfully!</h2>
        <p className="text-center text-gray-600">Thank you for participating in this election.</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="text-center py-10">
          <AlertCircle size={32} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">You have already voted in this election</h2>
          <p className="text-gray-600">Each user can only vote once per election.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-charcol mb-2">Cast Your Vote</h2>
        <p className="text-gray-600">Select one candidate and submit your vote. This action cannot be undone.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No candidates available for this election.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className={`bg-gray-50 p-4 rounded-lg flex items-start cursor-pointer ${
                selectedCandidate === candidate._id ? 'ring-2 ring-primaryblue' : ''
              }`}
              onClick={() => setSelectedCandidate(candidate._id)}
            >
              <div className="flex items-center h-5 mr-3 mt-1">
                <input
                  type="radio"
                  name="candidate"
                  id={candidate._id}
                  value={candidate._id}
                  checked={selectedCandidate === candidate._id}
                  onChange={() => setSelectedCandidate(candidate._id)}
                  className="h-4 w-4 text-primaryblue focus:ring-primaryblue"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={candidate._id} className="block cursor-pointer">
                  <h3 className="font-medium text-gray-800">{candidate.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{candidate.description}</p>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <button
          onClick={handleSubmitVote}
          disabled={!selectedCandidate || submitting || candidates.length === 0}
          className={`w-full py-3 rounded-md font-medium ${
            !selectedCandidate || submitting || candidates.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primaryblue text-white hover:bg-blue-600'
          } transition`}
        >
          {submitting ? 'Submitting...' : 'Submit Vote'}
        </button>
        <p className="text-sm text-center mt-2 text-gray-500">
          Your vote is anonymous and cannot be changed after submission.
        </p>
      </div>
    </div>
  );
};

export default VotingComponent; 