import { create } from "zustand";

interface UserInfoState {
  name: string;
  email: string;
  adharId: string;
  avatar: string;
  setUserInfo: (
    name: string,
    email: string,
    adhar: string,
    avatar: string
  ) => void;
}

const useUserInfoStore = create<UserInfoState>((set) => ({
  name: "",
  email: "",
  adharId: "",
  avatar: "",
  setUserInfo: (name: string, email: string, adharId: string, avatar: string) =>
    set({ name, email, adharId, avatar }),
}));

export default useUserInfoStore;
