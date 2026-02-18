import { useState, useCallback } from 'react';
import { CHEAT_SEQUENCE } from '@/constants/rewards';

/**
 * Tracks cheat sequence: feed onigiri -> akami -> maki (in that order).
 * Wrong food resets. Time between feeds does not matter.
 * Returns { checkFeed, applyCheat, isCheatActive }.
 * Call checkFeed(food) when user feeds; it returns true if cheat was just activated.
 */
export function useCheatCode() {
  const [cheatProgress, setCheatProgress] = useState(0);
  const [isCheatActive, setIsCheatActive] = useState(false);

  const checkFeed = useCallback((food: string): boolean => {
    if (isCheatActive) return false;
    const expected = CHEAT_SEQUENCE[cheatProgress];
    if (food !== expected) {
      setCheatProgress(0);
      return false;
    }
    const next = cheatProgress + 1;
    if (next >= CHEAT_SEQUENCE.length) {
      setCheatProgress(0);
      setIsCheatActive(true);
      return true;
    }
    setCheatProgress(next);
    return false;
  }, [cheatProgress, isCheatActive]);

  return { checkFeed, isCheatActive };
}
