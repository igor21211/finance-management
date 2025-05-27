import { create } from 'zustand';

interface NewTransactionStore {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewTransaction = create<NewTransactionStore>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
