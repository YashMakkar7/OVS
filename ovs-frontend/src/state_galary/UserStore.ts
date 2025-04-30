import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface User {
  _id: string;
  username: string;
  email: string;
  adharId: string;
  createdAt: string;
}

export interface UserVotingStatus {
  electionId: string;
  electionTitle: string;
  electionStatus: 'active' | 'upcoming' | 'completed';
  hasVoted: boolean;
  voteDetails: {
    votedAt: string;
    candidateName: string;
  } | null;
}

interface UserStore {
  users: User[];
  filteredUsers: User[];
  selectedUser: {
    user: User | null;
    votingHistory: UserVotingStatus[];
    isLoading: boolean;
  };
  isLoading: boolean;
  searchTerm: string;
  
  fetchUsers: () => Promise<void>;
  searchUsers: (term: string) => void;
  setSelectedUser: (user: User | null) => void;
  fetchUserVotingHistory: (userId: string) => Promise<void>;
  clearSelectedUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      filteredUsers: [],
      selectedUser: {
        user: null,
        votingHistory: [],
        isLoading: false
      },
      isLoading: false,
      searchTerm: '',
      
      fetchUsers: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('http://localhost:3000/info/users', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          
          if (response.data && response.data.users) {
            // Filter out admin users
            const filteredUsers = response.data.users.filter(
              (user: User) => user.username.toLowerCase() !== 'admin'
            );
            
            set({ 
              users: filteredUsers,
              filteredUsers: filteredUsers,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          set({ isLoading: false });
        }
      },
      
      searchUsers: (term) => {
        const { users } = get();
        set({ searchTerm: term });
        
        if (!term.trim()) {
          set({ filteredUsers: users });
          return;
        }
        
        const lowerTerm = term.toLowerCase();
        
        // Filter users and separate into exact, partial matches, and other matches
        //@ts-ignore
        const exactUsernameMatches = [];
        //@ts-ignore
        const partialUsernameMatches = [];
        //@ts-ignore
        const otherMatches = [];
        
        users.forEach(user => {
          // Skip admin users
          if (user.username.toLowerCase() === 'admin') {
            return;
          }
          
          const username = user.username.toLowerCase();
          const email = user.email.toLowerCase();
          const adharId = user.adharId.toLowerCase();
          
          if (username === lowerTerm) {
            exactUsernameMatches.push(user);
          } else if (username.includes(lowerTerm)) {
            partialUsernameMatches.push(user);
          } else if (email.includes(lowerTerm) || adharId.includes(lowerTerm)) {
            otherMatches.push(user);
          }
        });
        
        // Combine the arrays in order of priority
        const filtered = [
          //@ts-ignore
          ...exactUsernameMatches,
          //@ts-ignore
          ...partialUsernameMatches,
          //@ts-ignore
          ...otherMatches
        ];
        
        set({ filteredUsers: filtered });
      },
      
      setSelectedUser: (user) => {
        set({ 
          selectedUser: {
            user,
            votingHistory: [],
            isLoading: false
          }
        });
        
        if (user) {
          get().fetchUserVotingHistory(user._id);
        }
      },
      
      fetchUserVotingHistory: async (userId) => {
        set(state => ({
          selectedUser: {
            ...state.selectedUser,
            isLoading: true
          }
        }));
        
        try {
          // Fetch the user's voting history using the admin endpoint
          const response = await axios.get(`http://localhost:3000/vote/history/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          
          if (response.data && response.data.votingHistory) {
            set(state => ({
              selectedUser: {
                ...state.selectedUser,
                votingHistory: response.data.votingHistory,
                isLoading: false
              }
            }));
          }
        } catch (error) {
          console.error("Error fetching user voting history:", error);
          set(state => ({
            selectedUser: {
              ...state.selectedUser,
              isLoading: false
            }
          }));
        }
      },
      
      clearSelectedUser: () => {
        set({
          selectedUser: {
            user: null,
            votingHistory: [],
            isLoading: false
          }
        });
      }
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore; 