import { create } from 'zustand';

interface AdminInfoState {
  name: string;
  email: string;
  avatar: string;
  setAdminInfo: (name: string, email: string, avatar: string) => void;
}

const useAdminInfoStore = create<AdminInfoState>((set) => ({
  name: '',
  email: '',
  avatar: '',
  setAdminInfo: ( name:string, email:string, avatar:string ) => set({ name, email, avatar }),
}));

export default useAdminInfoStore;
