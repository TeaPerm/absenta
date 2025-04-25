import { create } from "zustand";

interface AppState {
  selectedUniversity: string;
  setSelectedUniversity: (university: string) => void;
  activeCourseId: string | null;
  setActiveCourseId: (courseId: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedUniversity: "",
  setSelectedUniversity: (university) => set({ selectedUniversity: university }),
  activeCourseId: null,
  setActiveCourseId: (courseId) => set({ activeCourseId: courseId }),
}));