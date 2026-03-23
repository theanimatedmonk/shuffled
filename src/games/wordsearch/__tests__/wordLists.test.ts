import { describe, it, expect } from 'vitest';
import { WORD_POOL } from '../wordLists';

describe('WORD_POOL', () => {
  it('has at least 500 words', () => {
    expect(WORD_POOL.length).toBeGreaterThanOrEqual(500);
  });

  it('all words are uppercase', () => {
    for (const word of WORD_POOL) {
      expect(word).toBe(word.toUpperCase());
    }
  });

  it('all words contain only A-Z letters', () => {
    for (const word of WORD_POOL) {
      expect(word).toMatch(/^[A-Z]+$/);
    }
  });

  it('all words are at least 4 letters long', () => {
    for (const word of WORD_POOL) {
      expect(word.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('all words are at most 8 letters long', () => {
    for (const word of WORD_POOL) {
      expect(word.length).toBeLessThanOrEqual(8);
    }
  });

  it('has a good mix of word lengths', () => {
    const lengths = new Map<number, number>();
    for (const word of WORD_POOL) {
      lengths.set(word.length, (lengths.get(word.length) || 0) + 1);
    }
    // Should have words of length 4, 5, 6, 7
    expect(lengths.has(4)).toBe(true);
    expect(lengths.has(5)).toBe(true);
    expect(lengths.has(6)).toBe(true);
    expect(lengths.has(7)).toBe(true);
  });

  it('has enough unique words for the hardest level', () => {
    const unique = new Set(WORD_POOL);
    // Level 10 needs 12 words of length 5-8
    const eligible = WORD_POOL.filter(w => w.length >= 5 && w.length <= 8);
    const uniqueEligible = new Set(eligible);
    expect(uniqueEligible.size).toBeGreaterThanOrEqual(50);
  });
});
