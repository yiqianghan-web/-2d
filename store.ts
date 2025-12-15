import { create } from 'zustand';

export type TreeMode = 'SCATTERED' | 'TREE_SHAPE';

interface AppState {
  mode: TreeMode;
  setMode: (mode: TreeMode) => void;
  toggleMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  mode: 'TREE_SHAPE', // Start formed for impact
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'SCATTERED' ? 'TREE_SHAPE' : 'SCATTERED' 
  })),
}));