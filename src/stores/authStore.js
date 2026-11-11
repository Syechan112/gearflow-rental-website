import { create } from 'zustand';
import { ROLES } from '@/constants/roles';
import { userRepository } from '@/database/repositories/userRepository';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: async () => {
    try {
      const savedUser = localStorage.getItem('gearflow_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        set({ user: parsed, isAuthenticated: true, isLoading: false });
        return;
      }
      // Default to owner on first load
      const owner = await userRepository.getByRole(ROLES.OWNER);
      if (owner && owner.length > 0) {
        set({ user: owner[0], isAuthenticated: true, isLoading: false });
        localStorage.setItem('gearflow_user', JSON.stringify(owner[0]));
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
    if (user) {
      localStorage.setItem('gearflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gearflow_user');
    }
  },

  switchRole: async (role) => {
    set({ isLoading: true });
    try {
      const users = await userRepository.getByRole(role);
      if (users && users.length > 0) {
        const user = users[0];
        set({ user, isAuthenticated: true, isLoading: false });
        localStorage.setItem('gearflow_user', JSON.stringify(user));
        return user;
      }
    } catch (err) {
      console.error('Error switching role:', err);
    }
    set({ isLoading: false });
    return null;
  },

  logout: () => {
    localStorage.removeItem('gearflow_user');
    set({ user: null, isAuthenticated: false });
  },
}));
