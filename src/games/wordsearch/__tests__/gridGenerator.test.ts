import { describe, it, expect } from 'vitest';
import { generateGrid } from '../gridGenerator';
import type { LevelConfig, Direction } from '../types';

function makeConfig(overrides: Partial<LevelConfig> = {}): LevelConfig {
  return {
    level: 1,
    gridRows: 8,
    gridCols: 8,
    wordCount: 4,
    minWordLength: 4,
    maxWordLength: 5,
    directions: ['right', 'down'],
    ...overrides,
  };
}

describe('generateGrid', () => {
  it('returns a grid with the correct dimensions', () => {
    const config = makeConfig({ gridRows: 10, gridCols: 12 });
    const grid = generateGrid(config);
    expect(grid.rows).toBe(10);
    expect(grid.cols).toBe(12);
    expect(grid.cells.length).toBe(10);
    grid.cells.forEach(row => expect(row.length).toBe(12));
  });

  it('places the requested number of words', () => {
    const config = makeConfig({ wordCount: 5 });
    const grid = generateGrid(config);
    expect(grid.words.length).toBe(5);
  });

  it('fills all cells with uppercase letters (no empty cells)', () => {
    const grid = generateGrid(makeConfig());
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        expect(grid.cells[r][c]).toMatch(/^[A-Z]$/);
      }
    }
  });

  it('places words that match the grid cell values', () => {
    const grid = generateGrid(makeConfig());
    for (const word of grid.words) {
      const letters = word.positions.map(p => grid.cells[p.row][p.col]).join('');
      expect(letters).toBe(word.word);
    }
  });

  it('all word positions are within grid bounds', () => {
    const config = makeConfig({ gridRows: 8, gridCols: 8, wordCount: 6, directions: ['right', 'down', 'downRight', 'downLeft'] });
    const grid = generateGrid(config);
    for (const word of grid.words) {
      for (const pos of word.positions) {
        expect(pos.row).toBeGreaterThanOrEqual(0);
        expect(pos.row).toBeLessThan(grid.rows);
        expect(pos.col).toBeGreaterThanOrEqual(0);
        expect(pos.col).toBeLessThan(grid.cols);
      }
    }
  });

  it('words have correct position count matching word length', () => {
    const grid = generateGrid(makeConfig());
    for (const word of grid.words) {
      expect(word.positions.length).toBe(word.word.length);
    }
  });

  it('respects minWordLength and maxWordLength', () => {
    const config = makeConfig({ minWordLength: 5, maxWordLength: 6 });
    const grid = generateGrid(config);
    for (const word of grid.words) {
      expect(word.word.length).toBeGreaterThanOrEqual(5);
      expect(word.word.length).toBeLessThanOrEqual(6);
    }
  });

  it('only uses allowed directions', () => {
    const allowed: Direction[] = ['right', 'down'];
    const config = makeConfig({ directions: allowed, wordCount: 4 });
    const grid = generateGrid(config);
    for (const word of grid.words) {
      expect(allowed).toContain(word.direction);
    }
  });

  it('placed words do not have conflicting overlaps', () => {
    const config = makeConfig({ wordCount: 6, directions: ['right', 'down', 'downRight', 'downLeft'] });
    const grid = generateGrid(config);

    // Build a map of position → letter from placed words
    const posMap = new Map<string, string>();
    for (const word of grid.words) {
      for (let i = 0; i < word.positions.length; i++) {
        const key = `${word.positions[i].row},${word.positions[i].col}`;
        const letter = word.word[i];
        if (posMap.has(key)) {
          // Overlapping cell must have the same letter
          expect(posMap.get(key)).toBe(letter);
        }
        posMap.set(key, letter);
      }
    }
  });

  it('no duplicate words in the grid', () => {
    const grid = generateGrid(makeConfig({ wordCount: 6 }));
    const words = grid.words.map(w => w.word);
    expect(new Set(words).size).toBe(words.length);
  });

  it('handles large grid with many words', () => {
    const config = makeConfig({ gridRows: 12, gridCols: 12, wordCount: 12, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] });
    const grid = generateGrid(config);
    expect(grid.words.length).toBeGreaterThanOrEqual(3); // at least fallback count
    expect(grid.cells.length).toBe(12);
  });

  it('generates different grids on successive calls (randomness)', () => {
    const config = makeConfig();
    const grid1 = generateGrid(config);
    const grid2 = generateGrid(config);
    // Extremely unlikely both grids have identical cells
    const flat1 = grid1.cells.flat().join('');
    const flat2 = grid2.cells.flat().join('');
    // Words might differ
    const words1 = grid1.words.map(w => w.word).sort().join(',');
    const words2 = grid2.words.map(w => w.word).sort().join(',');
    // At least one of cells or words should differ
    expect(flat1 !== flat2 || words1 !== words2).toBe(true);
  });
});
