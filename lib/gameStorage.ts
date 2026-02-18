import type { Task, FoodItem, Location, Cosmetics } from '@/types';

export interface GameState {
  currUser: string;
  currCoins: number;
  petName: string;
  totalCoinsEarned: number;
  currLevel: number;
  levelProgress: number;
  levelXPNeeded: number;
  tasks: Task[];
  totalTasksCompleted: number;
  currBg: string;
  locations: Record<string, Location>;
  foodItems: Record<string, FoodItem>;
  currFood: string;
  foodIndex: number;
  favoriteFood: string;
  cosmetics: Cosmetics;
  lastPlayed: string;
}

const STORAGE_KEY = 'gameState';

export const gameStorage = {
  load(): GameState | null {
    if (typeof window === 'undefined') return null;
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? (JSON.parse(s) as GameState) : null;
  },

  save(state: Omit<GameState, 'lastPlayed'>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        lastPlayed: new Date().toLocaleDateString(),
      })
    );
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
