export interface Task {
  id: number;
  name: string;
  completed: boolean;
  editing: boolean;
  tempName: string;
  coins: number;
}

export interface FoodItem {
  price: number;
  quantity: number;
  xp: number;
  owned: boolean;
  location: string;
  level: number;
  task: number;
  earn: number;
  show: boolean;
}

export interface Location {
  name: string;
  price: number;
  owned: boolean;
  bg: string;
}

export interface CosmeticItem {
  price: number;
  unlocked: boolean;
  owned: boolean;
  name: string;
  location: string;
  level: number;
  task: number;
  earn: number;
}

export interface CosmeticSlot {
  head: string | null;
  face: string | null;
  body: string | null;
}

export interface Cosmetics {
  head: Record<string, CosmeticItem>;
  face: Record<string, CosmeticItem>;
  body: Record<string, CosmeticItem>;
  equipped: CosmeticSlot;
}
