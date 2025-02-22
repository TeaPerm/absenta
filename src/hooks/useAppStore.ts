import { create } from "zustand";

interface AppState {
  selectedUniversity: string;
  setSelectedUniversity: (university: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedUniversity: "",
  setSelectedUniversity: (university) => set({ selectedUniversity: university }),
}));