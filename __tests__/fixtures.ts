import type { FoodItem, Location, Cosmetics } from '@/types';

export const mockFoodItems: Record<string, FoodItem> = {
  onigiri: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
  maki: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
};

export const mockLocations: Record<string, Location> = {
  livingroom: { name: 'living room', price: 0, owned: true, bg: 'livingroom/01/livingroom-01' },
  city: { name: 'city', price: 100, owned: false, bg: 'city/01/city-01' },
};

export const mockCosmetics: Cosmetics = {
  head: {
    'pointed-hat': { price: 0, unlocked: true, owned: true, name: 'pointy hat', location: 'living room', level: 0, task: 0, earn: 0 },
  },
  face: {
    'glasses-01': { price: 0, unlocked: true, owned: true, name: 'glasses 1', location: 'living room', level: 0, task: 0, earn: 0 },
  },
  body: {
    'shirt-01': { price: 0, unlocked: true, owned: true, name: 'shirt 1', location: 'living room', level: 0, task: 0, earn: 0 },
  },
  equipped: { head: 'pointed-hat', face: 'glasses-01', body: 'shirt-01' },
};
