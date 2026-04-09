import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  googleId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      initialize: async () => {
        try {
          const res = await api.get('/users/profile');
          if (res.data.success && res.data.user) {
            set({ user: res.data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
        // Handled by API call normally, but UI state cleared here
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
