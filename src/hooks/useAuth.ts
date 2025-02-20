import { create } from "zustand";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    signIn: (token: string) => void;
    signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    
    signIn: async (token) => {
        localStorage.setItem("token", token);
        set({ token, isAuthenticated: true });
    },
    
    signOut: () => {
        localStorage.removeItem("token");
        set({ token: null, isAuthenticated: false });
    },
}));