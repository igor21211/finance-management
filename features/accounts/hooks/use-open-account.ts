import { create } from 'zustand';

interface OpenAccountStore {
  id?: string;
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useOpenAccount = create<OpenAccountStore>((set) => ({
  open: false,
  id: undefined,
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: undefined }),
}));
