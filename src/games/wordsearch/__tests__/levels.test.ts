import { describe, it, expect } from 'vitest';
import { LEVELS, getLevelConfig } from '../levels';

describe('LEVELS', () => {
  it('has 50 defined levels', () => {
    expect(LEVELS.length).toBe(50);
  });

  it('levels are numbered 1 through 50', () => {
    LEVELS.forEach((level, i) => {
      expect(level.level).toBe(i + 1);
    });
  });

  it('has 10 levels per grid size', () => {
    const gridSizes = [8, 9, 10, 11, 12];
    for (const size of gridSizes) {
      const count = LEVELS.filter(l => l.gridRows === size).length;
      expect(count).toBe(10);
    }
  });

  it('grid size increases or stays the same across levels', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].gridRows).toBeGreaterThanOrEqual(LEVELS[i - 1].gridRows);
      expect(LEVELS[i].gridCols).toBeGreaterThanOrEqual(LEVELS[i - 1].gridCols);
    }
  });

  it('word count increases or stays the same within each grid size', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      if (LEVELS[i].gridRows === LEVELS[i - 1].gridRows) {
        expect(LEVELS[i].wordCount).toBeGreaterThanOrEqual(LEVELS[i - 1].wordCount);
      }
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

  it('all levels have wordCount <= grid capacity', () => {
    for (const level of LEVELS) {
      expect(level.wordCount).toBeLessThan(level.gridRows * level.gridCols);
    }
  });
});

describe('getLevelConfig', () => {
  it('returns config for level 1', () => {
    const config = getLevelConfig(1);
    expect(config.level).toBe(1);
    expect(config.gridRows).toBe(8);
    expect(config.wordCount).toBe(3);
  });

  it('returns config for level 50', () => {
    const config = getLevelConfig(50);
    expect(config.level).toBe(50);
    expect(config.gridRows).toBe(12);
    expect(config.wordCount).toBe(14);
  });

  it('returns hardest config for levels beyond 50', () => {
    const config = getLevelConfig(75);
    expect(config.level).toBe(75);
    expect(config.gridRows).toBe(LEVELS[LEVELS.length - 1].gridRows);
    expect(config.wordCount).toBe(LEVELS[LEVELS.length - 1].wordCount);
  });

  it('returns a copy (not the original reference)', () => {
    const config = getLevelConfig(1);
    config.wordCount = 999;
    const fresh = getLevelConfig(1);
    expect(fresh.wordCount).toBe(3);
  });
});
