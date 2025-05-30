import { create } from 'zustand';

interface OpenCategoryStore {
  id?: string;
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useOpenCategory = create<OpenCategoryStore>((set) => ({
  open: false,
  id: undefined,
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: undefined }),
}));
