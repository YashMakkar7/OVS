import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  adharId?: string;
  createdAt: string;
  __v?: number;
}

interface UsersStore {
  users: User[];
  setUsers: (users: User[]) => void;
  getUsers: () => User[];
  getCount: () => number;
}

const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [],
      setUsers: (users) => set({ users }),
      getUsers: () => get().users,
      getCount: () => get().users.length-1,
    }),
    {
      name: 'users-storage', // unique name for localStorage key
    }
  )
);

export default useUsersStore;

