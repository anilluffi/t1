import { create } from "zustand";
import axios from "axios";
interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  refreshAccessToken: () => Promise<void>;
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

    set({ token: accessToken, refreshToken: refreshToken });
  },

  refreshAccessToken: async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("No refresh token");
        return;
      }
    
      try {
        const response = await axios.post("http://localhost:3000/api/auth/refresh", { refreshToken });
    
        
        if (response.data.refreshToken) {
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
        } else {
          localStorage.setItem("token", response.data.accessToken);
        }
      } catch (error) {
        console.error("Failed to refresh token", error);
        set({ token: null, refreshToken: null });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
    
    

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ token: null, refreshToken: null });
  },
}));
