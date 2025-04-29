import { create } from "zustand";

interface CreateElectionState {
  isOpen: boolean;
  toggleModal: () => void;
}

const useCreateElectionStore = create<CreateElectionState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useCreateElectionStore; 