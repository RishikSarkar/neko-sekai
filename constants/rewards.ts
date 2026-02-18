export const LEVEL_REWARDS: Record<number, { food: string; location: null; fashion: null }> = {
  5: { food: 'saba', location: null, fashion: null },
};

export const TASK_REWARDS: Record<number, { food: string; location: null; fashion: null }> = {
  10: { food: 'ika', location: null, fashion: null },
};

export const EARN_REWARDS: Record<number, { food: string; location: null; fashion: null }> = {
  1000: { food: 'caviar', location: null, fashion: null },
};

/** Cheat sequence: feed onigiri, then akami, then maki (in order) to activate. Wrong food resets. */
export const CHEAT_SEQUENCE = ['onigiri', 'akami', 'maki'] as const;
