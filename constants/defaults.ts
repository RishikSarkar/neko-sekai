import type { Task, FoodItem, Location, Cosmetics } from '@/types';

export const DEFAULT_FOOD_ITEMS: Record<string, FoodItem> = {
  onigiri: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
  ika: { price: 10, quantity: 2, xp: 25, owned: false, location: 'all', level: 0, task: 10, earn: 0, show: true },
  saba: { price: 20, quantity: 2, xp: 40, owned: false, location: 'all', level: 5, task: 0, earn: 0, show: true },
  caviar: { price: 100, quantity: 2, xp: 150, owned: false, location: 'all', level: 0, task: 0, earn: 1000, show: true },
  maki: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
  tori: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
  tataki: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
  akami: { price: 10, quantity: 2, xp: 20, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
  tamago: { price: 10, quantity: 2, xp: 20, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
  taco: { price: 12, quantity: 2, xp: 25, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
  cheesecake: { price: 15, quantity: 2, xp: 30, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
  uni: { price: 20, quantity: 2, xp: 35, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
};

export const DEFAULT_LOCATIONS: Record<string, Location> = {
  livingroom: { name: 'living room', price: 0, owned: true, bg: 'livingroom/01/livingroom-01' },
  city: { name: 'city', price: 100, owned: false, bg: 'city/01/city-01' },
};

export const DEFAULT_COSMETICS: Cosmetics = {
  head: {
    'pointed-hat': { price: 0, unlocked: true, owned: true, name: 'pointy hat', location: 'living room', level: 0, task: 0, earn: 0 },
    'cap-01': { price: 50, unlocked: true, owned: false, name: 'cap 1', location: 'living room', level: 0, task: 0, earn: 0 },
  },
  face: {
    'glasses-01': { price: 0, unlocked: true, owned: true, name: 'glasses 1', location: 'living room', level: 0, task: 0, earn: 0 },
    'shades-01': { price: 50, unlocked: true, owned: false, name: 'shades 1', location: 'living room', level: 0, task: 0, earn: 0 },
  },
  body: {
    'shirt-01': { price: 0, unlocked: true, owned: true, name: 'shirt 1', location: 'living room', level: 0, task: 0, earn: 0 },
    'futuristic-01': { price: 100, unlocked: false, owned: false, name: 'hi-tech 1', location: 'city', level: 0, task: 0, earn: 0 },
  },
  equipped: { head: 'pointed-hat', face: 'glasses-01', body: 'shirt-01' },
};

export const DEFAULT_TASKS: Task[] = [
  { id: 1, name: 'task 1', completed: false, editing: false, tempName: 'task 1', coins: 10 },
  { id: 2, name: 'task 2', completed: false, editing: false, tempName: 'task 2', coins: 10 },
  { id: 3, name: 'task 3', completed: false, editing: false, tempName: 'task 3', coins: 10 },
  { id: 4, name: 'task 4', completed: false, editing: false, tempName: 'task 4', coins: 10 },
  { id: 5, name: 'task 5', completed: false, editing: false, tempName: 'task 5', coins: 10 },
];
