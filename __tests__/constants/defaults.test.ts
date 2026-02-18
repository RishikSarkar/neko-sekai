import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FOOD_ITEMS,
  DEFAULT_LOCATIONS,
  DEFAULT_COSMETICS,
  DEFAULT_TASKS,
} from '@/constants/defaults';

describe('constants/defaults', () => {
  describe('DEFAULT_FOOD_ITEMS', () => {
    it('has expected food items with required fields', () => {
      const required = ['onigiri', 'akami', 'maki', 'ika', 'saba', 'caviar'];
      for (const id of required) {
        expect(DEFAULT_FOOD_ITEMS[id]).toBeDefined();
        expect(DEFAULT_FOOD_ITEMS[id]).toMatchObject({
          price: expect.any(Number),
          quantity: expect.any(Number),
          xp: expect.any(Number),
          owned: expect.any(Boolean),
          location: expect.any(String),
          level: expect.any(Number),
          task: expect.any(Number),
          earn: expect.any(Number),
          show: expect.any(Boolean),
        });
      }
    });

    it('includes onigiri, akami, maki (cheat sequence foods)', () => {
      expect(DEFAULT_FOOD_ITEMS.onigiri).toBeDefined();
      expect(DEFAULT_FOOD_ITEMS.akami).toBeDefined();
      expect(DEFAULT_FOOD_ITEMS.maki).toBeDefined();
    });
  });

  describe('DEFAULT_LOCATIONS', () => {
    it('has livingroom and city', () => {
      expect(DEFAULT_LOCATIONS.livingroom).toBeDefined();
      expect(DEFAULT_LOCATIONS.city).toBeDefined();
      expect(DEFAULT_LOCATIONS.livingroom.owned).toBe(true);
      expect(DEFAULT_LOCATIONS.city.owned).toBe(false);
    });
  });

  describe('DEFAULT_COSMETICS', () => {
    it('has head, face, body, equipped', () => {
      expect(DEFAULT_COSMETICS.head).toBeDefined();
      expect(DEFAULT_COSMETICS.face).toBeDefined();
      expect(DEFAULT_COSMETICS.body).toBeDefined();
      expect(DEFAULT_COSMETICS.equipped).toMatchObject({
        head: expect.any(String),
        face: expect.any(String),
        body: expect.any(String),
      });
    });
  });

  describe('DEFAULT_TASKS', () => {
    it('has 5 tasks with ids 1–5', () => {
      expect(DEFAULT_TASKS).toHaveLength(5);
      DEFAULT_TASKS.forEach((t, i) => {
        expect(t.id).toBe(i + 1);
        expect(t.name).toMatch(/task \d/);
        expect(t.completed).toBe(false);
        expect(t.editing).toBe(false);
        expect(t.coins).toBe(10);
      });
    });
  });
});
