import { create } from 'zustand';

interface NewCategoryStore {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewCategory = create<NewCategoryStore>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
