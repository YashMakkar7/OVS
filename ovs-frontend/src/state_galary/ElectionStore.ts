import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Election {
  _id: string;
  creator: string;
  title: string;
  description: string;
  totalVotes: number;
  status: 'active' | 'upcoming' | 'completed';
  createdAt: string;
  __v: number;
}

interface ElectionStore {
  elections: Election[];
  setElections: (elections: Election[]) => void;
  addElection: (election: Election) => void;
  removeElection: (id: string) => void;
  getElections: () => Election[];
  updateElectionStatus: (id: string, status: 'active' | 'upcoming' | 'completed') => void;
}

const useElectionStore = create<ElectionStore>()(
  persist(
    (set, get) => ({
      elections: [],
      setElections: (elections) => set({ elections }),
      addElection: (election) => set((state) => ({ 
        elections: [election, ...state.elections] 
      })),
      removeElection: (id) => set((state) => ({
        elections: state.elections.filter(election => election._id !== id)
      })),
      getElections: () => get().elections,
      updateElectionStatus: (id, status) => set((state) => ({
        elections: state.elections.map(election => 
          election._id === id 
            ? { ...election, status } 
            : election
        )
      })),
    }),
    {
      name: 'election-storage', // unique name for localStorage key
    }
  )
);

export default useElectionStore;
