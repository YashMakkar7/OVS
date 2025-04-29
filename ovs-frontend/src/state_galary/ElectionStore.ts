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
    }),
    {
      name: 'election-storage', // unique name for localStorage key
    }
  )
);

export default useElectionStore;
