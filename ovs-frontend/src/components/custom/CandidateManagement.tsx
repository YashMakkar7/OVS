import { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import useCandidateStore, { Candidate } from '../../state_galary/CandidateStore';

interface CandidateManagementProps {
  electionId: string;
  electionStatus: 'active' | 'upcoming' | 'completed';
}

interface CandidateFormData {
  name: string;
  description: string;
}

const CandidateManagement = ({ electionId, electionStatus }: CandidateManagementProps) => {
  const { getCandidates, fetchCandidates, addMultipleCandidates, deleteCandidate } = useCandidateStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    description: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const isReadOnly = electionStatus === 'active' || electionStatus === 'completed';
  const MAX_CANDIDATES = 10;

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const fetchedCandidates = await fetchCandidates(electionId);
        setCandidates(fetchedCandidates);
      } catch (err) {
        setError('Failed to load candidates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCandidates();
  }, [electionId, fetchCandidates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setFormError('Candidate name is required');
      return;
    }
    
    if (candidates.length >= MAX_CANDIDATES) {
      setFormError(`Cannot add more than ${MAX_CANDIDATES} candidates`);
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      await addMultipleCandidates(electionId, [{
        name: formData.name,
        description: formData.description
      }]);
      
      // Refresh candidates
      const freshCandidates = await fetchCandidates(electionId);
      setCandidates(freshCandidates);
      
      // Reset form
      setFormData({
        name: '',
        description: ''
      });
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.response?.data?.msg || 'Failed to add candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    setDeleteLoading(candidateId);
    try {
      await deleteCandidate(electionId, candidateId);
      setCandidates(prev => prev.filter(c => c._id !== candidateId));
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to delete candidate');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-charcol">Candidate Management</h2>
        <div className="flex items-center">
          <span className="text-sm mr-2 text-gray-500">
            {candidates.length} / {MAX_CANDIDATES} candidates
          </span>
          
          {!isReadOnly && candidates.length < MAX_CANDIDATES && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primaryblue text-white p-2 rounded-md hover:bg-blue-600 transition"
              disabled={showForm}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {/* Add Candidate Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Add New Candidate</h3>
          <form onSubmit={handleAddCandidate}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryblue focus:border-primaryblue"
                placeholder="Candidate name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryblue focus:border-primaryblue"
                placeholder="Brief description about the candidate"
                rows={3}
              />
            </div>
            
            {formError && (
              <div className="text-red-600 text-sm mb-3">
                {formError}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primaryblue text-white rounded-md hover:bg-blue-600 transition flex items-center"
              >
                {isSubmitting ? 'Adding...' : 'Add Candidate'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError(null);
                  setFormData({ name: '', description: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Candidate List */}
      {loading ? (
        <div className="text-center py-10">
          <p>Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No candidates added yet.</p>
          {!isReadOnly && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-primaryblue hover:underline"
            >
              Add your first candidate
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{candidate.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{candidate.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Votes: {candidate.votes}
                </div>
              </div>
              
              {!isReadOnly && (
                <button
                  onClick={() => handleDeleteCandidate(candidate._id)}
                  disabled={deleteLoading === candidate._id}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete candidate"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Status warning message */}
      {isReadOnly && (
        <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {electionStatus === 'active' 
            ? "You cannot modify candidates while the election is active."
            : "You cannot modify candidates for completed elections."}
        </div>
      )}
    </div>
  );
};

export default CandidateManagement; 