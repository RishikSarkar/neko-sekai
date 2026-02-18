import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCheatCode } from '@/hooks/useCheatCode';

describe('useCheatCode', () => {
  it('returns checkFeed and isCheatActive', () => {
    const { result } = renderHook(() => useCheatCode());
    expect(typeof result.current.checkFeed).toBe('function');
    expect(result.current.isCheatActive).toBe(false);
  });

  it('completes sequence when feeding onigiri -> akami -> maki', () => {
    const { result } = renderHook(() => useCheatCode());

    act(() => {
      expect(result.current.checkFeed('onigiri')).toBe(false);
    });
    expect(result.current.isCheatActive).toBe(false);

    act(() => {
      expect(result.current.checkFeed('akami')).toBe(false);
    });
    expect(result.current.isCheatActive).toBe(false);

    act(() => {
      expect(result.current.checkFeed('maki')).toBe(true);
    });
    expect(result.current.isCheatActive).toBe(true);
  });

  it('resets sequence when wrong food is fed', () => {
    const { result } = renderHook(() => useCheatCode());

    act(() => {
      result.current.checkFeed('onigiri');
    });
    act(() => {
      result.current.checkFeed('maki'); // wrong - expected akami
    });
    expect(result.current.isCheatActive).toBe(false);

    act(() => {
      expect(result.current.checkFeed('onigiri')).toBe(false);
    });
    act(() => {
      expect(result.current.checkFeed('akami')).toBe(false);
    });
    act(() => {
      expect(result.current.checkFeed('maki')).toBe(true);
    });
    expect(result.current.isCheatActive).toBe(true);
  });

  it('returns false from checkFeed once cheat is active', () => {
    const { result } = renderHook(() => useCheatCode());

    act(() => result.current.checkFeed('onigiri'));
    act(() => result.current.checkFeed('akami'));
    act(() => result.current.checkFeed('maki'));
    expect(result.current.isCheatActive).toBe(true);

    act(() => {
      expect(result.current.checkFeed('onigiri')).toBe(false);
      expect(result.current.checkFeed('akami')).toBe(false);
    });
  });

  it('resets when wrong food at start, then correct sequence activates', () => {
    const { result } = renderHook(() => useCheatCode());

    act(() => result.current.checkFeed('maki'));
    act(() => result.current.checkFeed('ika'));
    expect(result.current.isCheatActive).toBe(false);

    act(() => result.current.checkFeed('onigiri'));
    act(() => result.current.checkFeed('akami'));
    act(() => result.current.checkFeed('maki'));
    expect(result.current.isCheatActive).toBe(true);
  });
});
