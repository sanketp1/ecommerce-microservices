import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/api/services';
import { UserResponse } from '@/types/api';

// Custom User type based on your backend API
interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileFetchAttempted: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  fetchUserProfile: () => Promise<void>;
  resetProfileFetchAttempted: () => void;
}

// Helper function to set/remove cookie
const setCookie = (name: string, value: string | null, days = 7) => {
  if (typeof window === 'undefined') return;
  
  if (value) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  } else {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      profileFetchAttempted: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        // Store token in localStorage for API client
        if (token) {
          localStorage.setItem('access_token', token);
          setCookie('access_token', token);
        } else {
          localStorage.removeItem('access_token');
          setCookie('access_token', null);
        }
        
        set({
          token,
        });
      },

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      logout: () => {
        // Clear localStorage and cookies
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setCookie('access_token', null);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      fetchUserProfile: async () => {
        if (get().profileFetchAttempted) return;
        set({ profileFetchAttempted: true });
        try {
          const userProfile = await authService.getUserProfile();
          // Merge the profile data with the existing user data
          const currentUser = get().user;
          set({
            user: { ...currentUser, ...userProfile },
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      },

      resetProfileFetchAttempted: () => set({ profileFetchAttempted: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 