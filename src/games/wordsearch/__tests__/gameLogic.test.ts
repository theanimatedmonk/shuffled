import { describe, it, expect } from 'vitest';
import { checkSelection, scoreForWord, levelBonus, isLevelComplete, computeLinePath } from '../gameLogic';
import type { Grid, GridPosition, PlacedWord } from '../types';

// ── Helpers ──────────────────────────────────────────────────

function makeGrid(words: PlacedWord[], rows = 8, cols = 8): Grid {
  const cells: string[][] = Array.from({ length: rows }, () => Array(cols).fill('X'));
  for (const w of words) {
    for (let i = 0; i < w.positions.length; i++) {
      cells[w.positions[i].row][w.positions[i].col] = w.word[i];
    }
  }
  return { cells, rows, cols, words };
}

function makeWord(word: string, startRow: number, startCol: number, direction: 'right' | 'down'): PlacedWord {
  const positions: GridPosition[] = [];
  for (let i = 0; i < word.length; i++) {
    positions.push({
      row: startRow + (direction === 'down' ? i : 0),
      col: startCol + (direction === 'right' ? i : 0),
    });
  }
  return { word, start: { row: startRow, col: startCol }, direction, positions };
}

// ── checkSelection ──────────────────────────────────────────

describe('checkSelection', () => {
  const tiger = makeWord('TIGER', 0, 0, 'right');
  const shark = makeWord('SHARK', 2, 3, 'down');
  const grid = makeGrid([tiger, shark]);

  it('returns the word when positions match forward', () => {
    const result = checkSelection(grid, tiger.positions, []);
    expect(result).toBe('TIGER');
  });

  it('returns the word when positions match in reverse', () => {
    const reversed = [...tiger.positions].reverse();
    const result = checkSelection(grid, reversed, []);
    expect(result).toBe('TIGER');
  });

  it('returns null for already found words', () => {
    const result = checkSelection(grid, tiger.positions, ['TIGER']);
    expect(result).toBeNull();
  });

  it('returns null for positions that do not spell any hidden word', () => {
    const randomPositions: GridPosition[] = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }];
    const result = checkSelection(grid, randomPositions, []);
    expect(result).toBeNull();
  });

  it('returns null for single cell selection', () => {
    const result = checkSelection(grid, [{ row: 0, col: 0 }], []);
    expect(result).toBeNull();
  });

  it('returns null for empty selection', () => {
    const result = checkSelection(grid, [], []);
    expect(result).toBeNull();
  });

  it('returns the correct word when positions match a different word', () => {
    const result = checkSelection(grid, shark.positions, []);
    expect(result).toBe('SHARK');
  });

  it('returns null when positions match the letters but not the word placement', () => {
    // TIGER at (0,0)→(0,4), try selecting wrong positions that happen to spell TIGER
    const wrongPositions: GridPosition[] = [
      { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
    ];
    const result = checkSelection(grid, wrongPositions, []);
    expect(result).toBeNull();
  });

  it('handles word length mismatch gracefully', () => {
    // Select only part of TIGER's positions
    const partial = tiger.positions.slice(0, 3);
    const result = checkSelection(grid, partial, []);
    expect(result).toBeNull();
  });
});

// ── scoreForWord ────────────────────────────────────────────

describe('scoreForWord', () => {
  it('returns word length * 10', () => {
    expect(scoreForWord('TIGER')).toBe(50);
    expect(scoreForWord('CAT')).toBe(30);
    expect(scoreForWord('ELEPHANT')).toBe(80);
  });
});

// ── levelBonus ──────────────────────────────────────────────

describe('levelBonus', () => {
  it('returns level * 50', () => {
    expect(levelBonus(1)).toBe(50);
    expect(levelBonus(5)).toBe(250);
    expect(levelBonus(10)).toBe(500);
  });
});

// ── isLevelComplete ─────────────────────────────────────────

describe('isLevelComplete', () => {
  const tiger = makeWord('TIGER', 0, 0, 'right');
  const shark = makeWord('SHARK', 2, 3, 'down');
  const grid = makeGrid([tiger, shark]);

  it('returns true when all words are found', () => {
    expect(isLevelComplete(grid, ['TIGER', 'SHARK'])).toBe(true);
  });

  it('returns false when some words are missing', () => {
    expect(isLevelComplete(grid, ['TIGER'])).toBe(false);
  });

  it('returns false when no words are found', () => {
    expect(isLevelComplete(grid, [])).toBe(false);
  });
});

// ── computeLinePath ─────────────────────────────────────────

describe('computeLinePath', () => {
  it('returns single cell for same start and end', () => {
    const path = computeLinePath({ row: 3, col: 5 }, { row: 3, col: 5 });
    expect(path).toEqual([{ row: 3, col: 5 }]);
  });

  it('computes horizontal path (left to right)', () => {
    const path = computeLinePath({ row: 0, col: 0 }, { row: 0, col: 4 });
    expect(path).toEqual([
      { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
    ]);
  });

  it('computes horizontal path (right to left)', () => {
    const path = computeLinePath({ row: 2, col: 5 }, { row: 2, col: 2 });
    expect(path).toEqual([
      { row: 2, col: 5 }, { row: 2, col: 4 }, { row: 2, col: 3 }, { row: 2, col: 2 },
    ]);
  });

  it('computes vertical path (top to bottom)', () => {
    const path = computeLinePath({ row: 1, col: 3 }, { row: 4, col: 3 });
    expect(path).toEqual([
      { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 }, { row: 4, col: 3 },
    ]);
  });

  it('computes vertical path (bottom to top)', () => {
    const path = computeLinePath({ row: 5, col: 2 }, { row: 2, col: 2 });
    expect(path).toEqual([
      { row: 5, col: 2 }, { row: 4, col: 2 }, { row: 3, col: 2 }, { row: 2, col: 2 },
    ]);
  });

  it('computes diagonal path (top-left to bottom-right)', () => {
    const path = computeLinePath({ row: 0, col: 0 }, { row: 3, col: 3 });
    expect(path).toEqual([
      { row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 },
    ]);
  });

  it('computes diagonal path (top-right to bottom-left)', () => {
    const path = computeLinePath({ row: 0, col: 4 }, { row: 3, col: 1 });
    expect(path).toEqual([
      { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 2, col: 2 }, { row: 3, col: 1 },
    ]);
  });

  it('computes diagonal path (bottom-right to top-left)', () => {
    const path = computeLinePath({ row: 4, col: 4 }, { row: 1, col: 1 });
    expect(path).toEqual([
      { row: 4, col: 4 }, { row: 3, col: 3 }, { row: 2, col: 2 }, { row: 1, col: 1 },
    ]);
  });

  it('snaps near-horizontal drag to horizontal', () => {
    // dr=1, dc=5 → more horizontal → snap to horizontal
    const path = computeLinePath({ row: 0, col: 0 }, { row: 1, col: 5 });
    expect(path.every(p => p.row === 0)).toBe(true);
    expect(path.length).toBe(6);
  });

  it('snaps near-vertical drag to vertical', () => {
    // dr=5, dc=1 → more vertical → snap to vertical
    const path = computeLinePath({ row: 0, col: 0 }, { row: 5, col: 1 });
    expect(path.every(p => p.col === 0)).toBe(true);
    expect(path.length).toBe(6);
  });
});
