import { describe, it, expect } from 'vitest';
import { generateSequence } from '@/lib/animations';

describe('lib/animations', () => {
  describe('generateSequence', () => {
    it('returns array of paths with 1-based indices', () => {
      const result = generateSequence('/images/cat/', 4);
      expect(result).toEqual([
        '/images/cat/1.png',
        '/images/cat/2.png',
        '/images/cat/3.png',
        '/images/cat/4.png',
      ]);
    });

    it('returns empty array when count is 0', () => {
      expect(generateSequence('/foo/', 0)).toEqual([]);
    });

    it('returns single item when count is 1', () => {
      expect(generateSequence('base', 1)).toEqual(['base1.png']);
    });
  });
});
