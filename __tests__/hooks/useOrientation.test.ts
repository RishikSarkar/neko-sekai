import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOrientation } from '@/hooks/useOrientation';

describe('useOrientation', () => {
  beforeEach(() => {
    vi.stubGlobal('addEventListener', vi.fn());
    vi.stubGlobal('removeEventListener', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when width > height (landscape)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe(true);
  });

  it('returns false when height > width (portrait)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 812, configurable: true });

    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe(false);
  });

  it('adds resize listener on mount', () => {
    renderHook(() => useOrientation());
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('removes resize listener on unmount', () => {
    const { unmount } = renderHook(() => useOrientation());
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
