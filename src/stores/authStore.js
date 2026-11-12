import { create } from 'zustand';
import { ROLES } from '@/constants/roles';
import { userRepository } from '@/database/repositories/userRepository';
import { subscribeToDbChanges } from '@/utils/dbEvents';

let isSubscribed = false;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: async () => {
    if (!isSubscribed) {
      isSubscribed = true;
      subscribeToDbChanges(() => {
        get().refreshUser();
      });
    }

    try {
      const savedUser = localStorage.getItem('gearflow_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const freshUser = await userRepository.getById(parsed.id);
        const activeUser = freshUser || parsed;
        set({ user: activeUser, isAuthenticated: true, isLoading: false });
        localStorage.setItem('gearflow_user', JSON.stringify(activeUser));
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

  refreshUser: async () => {
    const current = get().user;
    if (!current?.id) return;
    try {
      const fresh = await userRepository.getById(current.id);
      if (fresh) {
        set({ user: fresh });
        localStorage.setItem('gearflow_user', JSON.stringify(fresh));
      }
    } catch (err) {
      console.error('Failed to refresh user auth:', err);
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
