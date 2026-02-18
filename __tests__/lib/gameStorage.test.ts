import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gameStorage } from '@/lib/gameStorage';

const mockState = {
  currUser: 'testUser',
  currCoins: 100,
  petName: 'Neko',
  totalCoinsEarned: 500,
  currLevel: 1,
  levelProgress: 0,
  levelXPNeeded: 100,
  tasks: [],
  totalTasksCompleted: 0,
  currBg: 'livingroom',
  locations: {},
  foodItems: {},
  currFood: 'onigiri',
  foodIndex: 0,
  favoriteFood: 'onigiri',
  cosmetics: { head: {}, face: {}, body: {}, equipped: { head: null, face: null, body: null } },
};

describe('lib/gameStorage', () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete storage[key];
      }),
    });
  });

  it('returns null when nothing is stored', () => {
    expect(gameStorage.load()).toBeNull();
  });

  it('saves and loads state correctly', () => {
    gameStorage.save(mockState);
    const loaded = gameStorage.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.currUser).toBe('testUser');
    expect(loaded?.currCoins).toBe(100);
    expect(loaded?.petName).toBe('Neko');
    expect(loaded?.lastPlayed).toBeDefined();
  });

  it('adds lastPlayed on save', () => {
    gameStorage.save(mockState);
    const loaded = gameStorage.load();
    expect(loaded?.lastPlayed).toBeDefined();
    expect(typeof loaded?.lastPlayed).toBe('string');
  });

  it('clear removes stored state', () => {
    gameStorage.save(mockState);
    expect(gameStorage.load()).not.toBeNull();
    gameStorage.clear();
    expect(gameStorage.load()).toBeNull();
  });

  it('returns null when window is undefined (SSR)', () => {
    const origWindow = globalThis.window;
    // @ts-expect-error simulate SSR
    vi.stubGlobal('window', undefined);
    expect(gameStorage.load()).toBeNull();
    vi.stubGlobal('window', origWindow);
  });
});
