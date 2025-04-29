import { useEffect, useRef, useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import useCreateElectionStore from '../../state_galary/CreateElectionStore';
import useElectionStore, { Election } from '../../state_galary/ElectionStore';
import axios from 'axios';

const CreateElectionModal = () => {
  const { isOpen, toggleModal } = useCreateElectionStore();
  const { addElection } = useElectionStore();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle body overflow and cleanup
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Reset form state
      setError(null);
      setIsLoading(false);
      
      // Focus on title input when modal opens
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    const title = titleRef.current?.value || '';
    const description = descriptionRef.current?.value || '';
    
    if (!title.trim() || !description.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3000/election/create', {
        title,
        description
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const newElection: Election = response.data?.election || {
        _id: `election-${Date.now()}`,
        creator: "current-user-id", 
        title,
        description,
        totalVotes: 0,
        status: 'upcoming' as const,
        createdAt: new Date().toISOString(),
        __v: 0
      };
      
      // Add to store
      addElection(newElection);
      
      // Reset form and close modal
      if (titleRef.current) titleRef.current.value = '';
      if (descriptionRef.current) descriptionRef.current.value = '';
      
      console.log('Election created successfully');
      toggleModal();
    } catch (error) {
      console.error('Error creating election:', error);
      setError('Failed to create election. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
      onClick={toggleModal}
    >
      <div 
        className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl overflow-hidden"
        style={{ 
          animation: isOpen ? 'fadeIn 0.3s ease forwards' : 'none'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primaryblue to-blue-600 text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Plus size={20} className="text-white" />
            </div>
            <h2 className="font-semibold text-lg">Create New Election</h2>
          </div>
          <button 
            onClick={toggleModal}
            className="text-white hover:text-gray-200 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              ref={titleRef}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryblue focus:border-transparent transition-all"
              placeholder="Enter election title"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              ref={descriptionRef}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryblue focus:border-transparent transition-all min-h-[120px] resize-none"
              placeholder="Enter election description"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={toggleModal}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 bg-primaryblue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg active:scale-95 transform transition-transform ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElectionModal; 