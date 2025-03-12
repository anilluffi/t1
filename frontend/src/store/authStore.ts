import { create } from "zustand";
import axios from "axios";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,

  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    } else {
      localStorage.removeItem("token");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }

    set({ token: accessToken, refreshToken });
  },

  

  logout: () => {
    console.warn("Вызван logout");
    set({ token: null }); 
  },
  
}));
