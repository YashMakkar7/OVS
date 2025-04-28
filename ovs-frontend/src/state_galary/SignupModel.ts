import { create } from "zustand";

interface SignupModel {
  isOpen: boolean;
  toggleModel: () => void;
}

const SignupModelStore = create<SignupModel>((set) => ({
  isOpen: false,
  toggleModel: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export {SignupModelStore}