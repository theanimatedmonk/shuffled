import type { Direction, Grid, GridPosition, LevelConfig, PlacedWord } from './types';
import { WORD_POOL } from './wordLists';

const DIRECTION_VECTORS: Record<Direction, { dr: number; dc: number }> = {
  right:     { dr: 0, dc: 1 },
  down:      { dr: 1, dc: 0 },
  downRight: { dr: 1, dc: 1 },
  downLeft:  { dr: 1, dc: -1 },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPositions(start: GridPosition, direction: Direction, length: number): GridPosition[] {
  const { dr, dc } = DIRECTION_VECTORS[direction];
  return Array.from({ length }, (_, i) => ({
    row: start.row + dr * i,
    col: start.col + dc * i,
  }));
}

function canPlace(
  word: string,
  start: GridPosition,
  direction: Direction,
  grid: string[][],
  rows: number,
  cols: number,
): boolean {
  const { dr, dc } = DIRECTION_VECTORS[direction];
  for (let i = 0; i < word.length; i++) {
    const r = start.row + dr * i;
    const c = start.col + dc * i;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    const existing = grid[r][c];
    if (existing !== '' && existing !== word[i]) return false;
  }
  return true;
}

function placeWord(
  word: string,
  start: GridPosition,
  direction: Direction,
  grid: string[][],
): void {
  const { dr, dc } = DIRECTION_VECTORS[direction];
  for (let i = 0; i < word.length; i++) {
    grid[start.row + dr * i][start.col + dc * i] = word[i];
  }
}

function tryGenerateGrid(config: LevelConfig): Grid | null {
  const { gridRows, gridCols, wordCount, minWordLength, maxWordLength, directions } = config;

  // Filter and shuffle word pool
  const candidates = shuffle(
    WORD_POOL.filter(w => w.length >= minWordLength && w.length <= maxWordLength)
  );

  if (candidates.length < wordCount) return null;

  const grid: string[][] = Array.from({ length: gridRows }, () => Array(gridCols).fill(''));
  const placed: PlacedWord[] = [];

  for (const word of candidates) {
    if (placed.length >= wordCount) break;

    // Skip if this word is a substring of an already placed word or vice versa
    if (placed.some(p => p.word.includes(word) || word.includes(p.word))) continue;

    // Try random directions and positions
    const dirs = shuffle([...directions]);
    let didPlace = false;

    for (const dir of dirs) {
      const { dr, dc } = DIRECTION_VECTORS[dir];
      // Compute valid start range
      const maxRow = dr === 0 ? gridRows - 1 : gridRows - 1 - (word.length - 1) * dr;
      const minCol = dc < 0 ? (word.length - 1) : 0;
      const maxCol = dc > 0 ? gridCols - 1 - (word.length - 1) : gridCols - 1;

      if (maxRow < 0 || maxCol < minCol) continue;

      // Gather all valid starts and shuffle
      const starts: GridPosition[] = [];
      for (let r = 0; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          starts.push({ row: r, col: c });
        }
      }

      for (const start of shuffle(starts)) {
        if (canPlace(word, start, dir, grid, gridRows, gridCols)) {
          placeWord(word, start, dir, grid);
          placed.push({
            word,
            start,
            direction: dir,
            positions: getPositions(start, dir, word.length),
          });
          didPlace = true;
          break;
        }
      }
      if (didPlace) break;
    }
  }

  if (placed.length < wordCount) return null;

  // Fill empty cells with random letters
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = LETTERS[Math.floor(Math.random() * 26)];
      }
    }
  }

  return { cells: grid, rows: gridRows, cols: gridCols, words: placed };
}

/** Generate a grid for the given level config. Retries up to 10 times on failure. */
export function generateGrid(config: LevelConfig): Grid {
  for (let attempt = 0; attempt < 10; attempt++) {
    const result = tryGenerateGrid(config);
    if (result) return result;
  }
  // Fallback: relax word count
  const relaxed = { ...config, wordCount: Math.max(3, config.wordCount - 2) };
  const result = tryGenerateGrid(relaxed);
  if (result) return result;

  // Ultimate fallback: minimal grid
  return tryGenerateGrid({ ...config, wordCount: 3, minWordLength: 4, maxWordLength: 5 })!;
}
