import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  isSupported: vi.fn(() => Promise.resolve(true)),
}));

describe('Firebase lib', () => {
  it('exports getFirebaseDb and getFirebaseAuth', async () => {
    const firebase = await import('@/lib/firebase');
    expect(typeof firebase.getFirebaseDb).toBe('function');
    expect(typeof firebase.getFirebaseAuth).toBe('function');
    expect(typeof firebase.getFirebaseAnalytics).toBe('function');
  });
});
