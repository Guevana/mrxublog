import { create } from 'zustand';
import { AppModule } from '../types';
import { getAppModules } from '../services/wpService';

interface AppState {
  isLoggedIn: boolean;
  login: () => void;
  
  modules: AppModule[];
  isModulesLoading: boolean;
  modulesFetched: boolean;
  fetchModules: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: localStorage.getItem('hasVisited') === 'true',
  login: () => {
    localStorage.setItem('hasVisited', 'true');
    set({ isLoggedIn: true });
  },

  modules: [],
  isModulesLoading: false,
  modulesFetched: false,
  fetchModules: async () => {
    if (get().modulesFetched || get().isModulesLoading) return;
    
    set({ isModulesLoading: true });
    try {
      const mods = await getAppModules();
      set({ modules: mods, modulesFetched: true });
    } catch (err) {
      console.error('Error fetching app modules', err);
    } finally {
      set({ isModulesLoading: false });
    }
  }
}));
