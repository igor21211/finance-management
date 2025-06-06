import { create } from 'zustand';

interface OpenTransactionStore {
  id?: string;
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useOpenTransaction = create<OpenTransactionStore>(
  (set) => ({
    open: false,
    id: undefined,
    onOpen: (id) => set({ open: true, id }),
    onClose: () => set({ open: false, id: undefined }),
  })
);
