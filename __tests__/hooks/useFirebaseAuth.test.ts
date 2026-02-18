import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const mockUnsubscribe = vi.fn();
vi.mock('@/lib/firebase', () => ({
  getFirebaseAuth: vi.fn(() => ({
    _: 'auth',
  })),
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => mockUnsubscribe),
}));

describe('useFirebaseAuth', () => {
  it('returns user state', () => {
    const { result } = renderHook(() => useFirebaseAuth());
    expect(result.current.user).toBeNull();
  });

  it('calls onAuthStateChanged on mount', async () => {
    const { onAuthStateChanged } = await import('firebase/auth');
    renderHook(() => useFirebaseAuth());
    expect(onAuthStateChanged).toHaveBeenCalled();
  });

  it('unsubscribes from auth on unmount', () => {
    const { unmount } = renderHook(() => useFirebaseAuth());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
