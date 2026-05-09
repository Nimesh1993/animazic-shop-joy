import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Demo-only credentials. Replace with real auth before production.
const DEMO_USER = "admin";
const DEMO_PASS = "admin123";

interface AuthState {
  isAdmin: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      username: null,
      login: (username, password) => {
        if (username.trim() === DEMO_USER && password === DEMO_PASS) {
          set({ isAdmin: true, username });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false, username: null }),
    }),
    { name: "boutique-auth", storage: createJSONStorage(() => localStorage) },
  ),
);

export const DEMO_CREDENTIALS = { username: DEMO_USER, password: DEMO_PASS };