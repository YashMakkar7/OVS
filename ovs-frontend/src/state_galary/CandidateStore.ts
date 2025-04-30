import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface Candidate {
  _id: string;
  electionId: string;
  name: string;
  description: string;
  votes: number;
}

interface CandidateStore {
  candidates: Record<string, Candidate[]>; // Map election ID to array of candidates
  addCandidate: (electionId: string, candidate: Candidate) => void;
  removeCandidate: (electionId: string, candidateId: string) => void;
  setCandidates: (electionId: string, candidates: Candidate[]) => void;
  getCandidates: (electionId: string) => Candidate[];
  fetchCandidates: (electionId: string) => Promise<Candidate[]>;
  addMultipleCandidates: (electionId: string, candidates: Omit<Candidate, '_id' | 'electionId' | 'votes'>[]) => Promise<void>;
  deleteCandidate: (electionId: string, candidateId: string) => Promise<void>;
}

const useCandidateStore = create<CandidateStore>()(
  persist(
    (set, get) => ({
      candidates: {},
      
      addCandidate: (electionId, candidate) => set((state) => {
        const currentCandidates = state.candidates[electionId] || [];
        return {
          candidates: {
            ...state.candidates,
            [electionId]: [...currentCandidates, candidate]
          }
        };
      }),
      
      removeCandidate: (electionId, candidateId) => set((state) => {
        const currentCandidates = state.candidates[electionId] || [];
        return {
          candidates: {
            ...state.candidates,
            [electionId]: currentCandidates.filter(c => c._id !== candidateId)
          }
        };
      }),
      
      setCandidates: (electionId, candidates) => set((state) => ({
        candidates: {
          ...state.candidates,
          [electionId]: candidates
        }
      })),
      
      getCandidates: (electionId) => {
        return get().candidates[electionId] || [];
      },
      
      fetchCandidates: async (electionId) => {
        try {
          const response = await axios.get(`http://localhost:3000/candidate/${electionId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          
          if (response.data && response.data.candidates) {
            const candidates = response.data.candidates;
            set((state) => ({
              candidates: {
                ...state.candidates,
                [electionId]: candidates
              }
            }));
            return candidates;
          }
          return [];
        } catch (error) {
          console.error("Error fetching candidates:", error);
          return [];
        }
      },
      
      addMultipleCandidates: async (electionId, candidatesToAdd) => {
        try {
          const response = await axios.post(
            `http://localhost:3000/candidate/addcandidates/${electionId}`,
            { candidates: candidatesToAdd },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          if (response.data && response.data.candidates) {
            await get().fetchCandidates(electionId);
          }
        } catch (error) {
          console.error("Error adding candidates:", error);
          throw error;
        }
      },
      
      deleteCandidate: async (electionId, candidateId) => {
        try {
          await axios.delete(
            `http://localhost:3000/candidate/delete/${electionId}/${candidateId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          get().removeCandidate(electionId, candidateId);
        } catch (error) {
          console.error("Error deleting candidate:", error);
          throw error;
        }
      }
    }),
    {
      name: 'candidate-storage',
    }
  )
);

export default useCandidateStore; 