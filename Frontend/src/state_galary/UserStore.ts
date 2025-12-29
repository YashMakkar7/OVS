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
  fetchAdminUserVotingHistory: (userId: string) => Promise<void>;
  fetchOwnVotingHistory: () => Promise<void>;
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
          // Try admin endpoint first, if it fails, fallback to user endpoint
          get().fetchAdminUserVotingHistory(user._id).catch(() => {
            get().fetchOwnVotingHistory();
          });
        }
      },
      
      fetchUserVotingHistory: async (userId) => {
        // Try admin endpoint first, if it fails, fallback to user endpoint
        try {
          await get().fetchAdminUserVotingHistory(userId);
        } catch (error) {
          await get().fetchOwnVotingHistory();
        }
      },
      
      fetchAdminUserVotingHistory: async (userId) => {
        set(state => ({
          selectedUser: {
            ...state.selectedUser,
            isLoading: true
          }
        }));
        
        try {
          // Use the admin endpoint to get voting history for a specific user
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
          console.error("Error fetching admin user voting history:", error);
          set(state => ({
            selectedUser: {
              ...state.selectedUser,
              isLoading: false
            }
          }));
          throw error; // Rethrow for fallback handling
        }
      },
      
      fetchOwnVotingHistory: async () => {
        set(state => ({
          selectedUser: {
            ...state.selectedUser,
            isLoading: true
          }
        }));
        
        try {
          // Use the user endpoint to get own voting history
          const response = await axios.get(`http://localhost:3000/vote/myhistory`, {
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
          console.error("Error fetching own voting history:", error);
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