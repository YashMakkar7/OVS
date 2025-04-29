import { create } from "zustand";

interface DeleteConfirmationState {
  isOpen: boolean;
  electionToDelete: {
    id: string;
    title: string;
  } | null;
  openDialog: (id: string, title: string) => void;
  closeDialog: () => void;
}

const useDeleteConfirmationStore = create<DeleteConfirmationState>((set) => ({
  isOpen: false,
  electionToDelete: null,
  openDialog: (id, title) => set({ isOpen: true, electionToDelete: { id, title } }),
  closeDialog: () => set({ isOpen: false }),
}));

export default useDeleteConfirmationStore; 