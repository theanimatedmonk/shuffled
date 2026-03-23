import { describe, it, expect } from 'vitest';
import { LEVELS, getLevelConfig } from '../levels';

describe('LEVELS', () => {
  it('has 10 defined levels', () => {
    expect(LEVELS.length).toBe(10);
  });

  it('levels are numbered 1 through 10', () => {
    LEVELS.forEach((level, i) => {
      expect(level.level).toBe(i + 1);
    });
  });

  it('grid size increases or stays the same across levels', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].gridRows).toBeGreaterThanOrEqual(LEVELS[i - 1].gridRows);
      expect(LEVELS[i].gridCols).toBeGreaterThanOrEqual(LEVELS[i - 1].gridCols);
    }
  });

  it('word count increases or stays the same across levels', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].wordCount).toBeGreaterThanOrEqual(LEVELS[i - 1].wordCount);
    }
  });

  it('direction count increases or stays the same across levels', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].directions.length).toBeGreaterThanOrEqual(LEVELS[i - 1].directions.length);
    }
  });

  it('all levels have valid direction values', () => {
    const validDirs = new Set(['right', 'down', 'downRight', 'downLeft']);
    for (const level of LEVELS) {
      for (const dir of level.directions) {
        expect(validDirs.has(dir)).toBe(true);
      }
    }
  });

  it('all levels have wordCount <= grid capacity (rows * cols)', () => {
    for (const level of LEVELS) {
      // Very loose sanity check: word count should be far less than total cells
      expect(level.wordCount).toBeLessThan(level.gridRows * level.gridCols);
    }
  });
});

describe('getLevelConfig', () => {
  it('returns config for level 1', () => {
    const config = getLevelConfig(1);
    expect(config.level).toBe(1);
    expect(config.gridRows).toBe(8);
    expect(config.wordCount).toBe(4);
  });

  it('returns config for level 10', () => {
    const config = getLevelConfig(10);
    expect(config.level).toBe(10);
    expect(config.gridRows).toBe(12);
    expect(config.wordCount).toBe(12);
  });

  it('returns hardest config for levels beyond 10', () => {
    const config = getLevelConfig(25);
    expect(config.level).toBe(25);
    expect(config.gridRows).toBe(LEVELS[LEVELS.length - 1].gridRows);
    expect(config.wordCount).toBe(LEVELS[LEVELS.length - 1].wordCount);
  });

  it('returns a copy (not the original reference)', () => {
    const config = getLevelConfig(1);
    config.wordCount = 999;
    const fresh = getLevelConfig(1);
    expect(fresh.wordCount).toBe(4);
  });
});
