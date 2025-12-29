import {create} from 'zustand'
import { persist } from 'zustand/middleware';

interface DashboardData {
    totalElections: number;
    activeElections: number;
    totalVoters: number;
    votesCast: number;
    upcomingElections: number;
    completedElections: number;
    incrementTotalElections: () => void;
    incrementActiveElections: () => void;
    incrementTotalVoters: () => void;
    incrementVotesCast: () => void;
    incrementUpcomingElections: () => void;
    incrementCompletedElections: () => void;
    setAllData: (totalElections: number, activeElections: number, totalVoters: number, votesCast: number, upcomingElections: number, completedElections: number) => void;
}

const useDashboardStore = create<DashboardData>()(
    persist(
        (set) => ({
            totalElections: 0,
            activeElections: 0,
            totalVoters: 0,
            votesCast: 0,
            upcomingElections: 0,
            completedElections: 0,  

            incrementTotalElections: () => set((state) => ({ totalElections: state.totalElections + 1 })),
            incrementActiveElections: () => set((state) => ({ activeElections: state.activeElections + 1 })),
            incrementTotalVoters: () => set((state) => ({ totalVoters: state.totalVoters + 1 })),
            incrementVotesCast: () => set((state) => ({ votesCast: state.votesCast + 1 })),
            incrementUpcomingElections: () => set((state) => ({ upcomingElections: state.upcomingElections + 1 })),
            incrementCompletedElections: () => set((state) => ({ completedElections: state.completedElections + 1 })),  
            
            setAllData: (totalElections: number, activeElections: number, totalVoters: number, votesCast: number, upcomingElections: number, completedElections: number) => set({
                totalElections,
                activeElections,
                totalVoters,
                votesCast,
                upcomingElections,
                completedElections,
            }),
        }),
        {
            name: 'dashboard-storage', // unique name for localStorage key
        }
    )
);

export default useDashboardStore;