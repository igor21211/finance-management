import { create } from 'zustand';

interface NewAccountStore {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewAccount = create<NewAccountStore>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
