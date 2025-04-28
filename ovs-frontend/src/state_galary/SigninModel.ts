import { create } from "zustand";

interface SigninModel {
  isOpenSignin: boolean;
  toggleModelSignin: () => void;
}

const SigninModelStore = create<SigninModel>((set) => ({
  isOpenSignin: false,
  toggleModelSignin: () => set((state) => ({ isOpenSignin: !state.isOpenSignin })),
}));

export {SigninModelStore}