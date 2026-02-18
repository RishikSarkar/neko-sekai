import { describe, it, expect } from 'vitest';
import { LEVEL_REWARDS, TASK_REWARDS, EARN_REWARDS, CHEAT_SEQUENCE } from '@/constants/rewards';

describe('constants/rewards', () => {
  describe('LEVEL_REWARDS', () => {
    it('has level 5 reward for saba', () => {
      expect(LEVEL_REWARDS[5]).toEqual({ food: 'saba', location: null, fashion: null });
    });
  });

  describe('TASK_REWARDS', () => {
    it('has task 10 reward for ika', () => {
      expect(TASK_REWARDS[10]).toEqual({ food: 'ika', location: null, fashion: null });
    });
  });

  describe('EARN_REWARDS', () => {
    it('has earn 1000 reward for caviar', () => {
      expect(EARN_REWARDS[1000]).toEqual({ food: 'caviar', location: null, fashion: null });
    });
  });

  describe('CHEAT_SEQUENCE', () => {
    it('is onigiri, akami, maki in order', () => {
      expect(CHEAT_SEQUENCE).toEqual(['onigiri', 'akami', 'maki']);
    });

    it('has exactly 3 items', () => {
      expect(CHEAT_SEQUENCE).toHaveLength(3);
    });
  });
});
