import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFirestore } from '@/hooks/useFirestore';

const mockDb = {};
vi.mock('@/lib/firebase', () => ({
  getFirebaseDb: vi.fn(() => mockDb),
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
}));

describe('useFirestore', () => {
  it('returns savePetData and fetchPetData functions', () => {
    const { result } = renderHook(() => useFirestore());
    expect(typeof result.current.savePetData).toBe('function');
    expect(typeof result.current.fetchPetData).toBe('function');
  });

  it('fetchPetData returns null when doc does not exist', async () => {
    const { result } = renderHook(() => useFirestore());
    let data: unknown = null;
    await act(async () => {
      data = await result.current.fetchPetData('user1');
    });
    expect(data).toBeNull();
  });
});
