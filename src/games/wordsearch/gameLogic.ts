import type { Grid, GridPosition } from './types';

/** Check if the selected positions spell a hidden word. Returns the word or null. */
export function checkSelection(grid: Grid, positions: GridPosition[], foundWords: string[]): string | null {
  if (positions.length < 2) return null;

  // Build the string from positions
  const forward = positions.map(p => grid.cells[p.row][p.col]).join('');
  const reverse = [...forward].reverse().join('');

  for (const placed of grid.words) {
    if (foundWords.includes(placed.word)) continue;
    if (placed.word === forward || placed.word === reverse) {
      // Verify positions actually match this word's positions
      const wordPositions = placed.positions;
      if (wordPositions.length !== positions.length) continue;

      const matchForward = wordPositions.every((wp, i) =>
        wp.row === positions[i].row && wp.col === positions[i].col
      );
      const matchReverse = wordPositions.every((wp, i) =>
        wp.row === positions[positions.length - 1 - i].row &&
        wp.col === positions[positions.length - 1 - i].col
      );

      if (matchForward || matchReverse) return placed.word;
    }
  }
  return null;
}

/** Calculate score for finding a word */
export function scoreForWord(word: string): number {
  return word.length * 10;
}

/** Calculate level completion bonus */
export function levelBonus(level: number): number {
  return level * 50;
}

/** Check if all words have been found */
export function isLevelComplete(grid: Grid, foundWords: string[]): boolean {
  return grid.words.every(w => foundWords.includes(w.word));
}

/** Compute straight-line positions between two grid points */
export function computeLinePath(start: GridPosition, end: GridPosition): GridPosition[] {
  const dr = end.row - start.row;
  const dc = end.col - start.col;

  if (dr === 0 && dc === 0) return [{ ...start }];

  // Determine if it's a valid straight line (horizontal, vertical, or 45-degree diagonal)
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  let stepR: number;
  let stepC: number;
  let steps: number;

  if (dr === 0) {
    // Horizontal
    stepR = 0;
    stepC = dc > 0 ? 1 : -1;
    steps = absDc;
  } else if (dc === 0) {
    // Vertical
    stepR = dr > 0 ? 1 : -1;
    stepC = 0;
    steps = absDr;
  } else if (absDr === absDc) {
    // Diagonal
    stepR = dr > 0 ? 1 : -1;
    stepC = dc > 0 ? 1 : -1;
    steps = absDr;
  } else {
    // Not a valid line — snap to the closest axis
    if (absDr > absDc) {
      // More vertical
      stepR = dr > 0 ? 1 : -1;
      stepC = 0;
      steps = absDr;
    } else if (absDc > absDr) {
      // More horizontal
      stepR = 0;
      stepC = dc > 0 ? 1 : -1;
      steps = absDc;
    } else {
      stepR = dr > 0 ? 1 : -1;
      stepC = dc > 0 ? 1 : -1;
      steps = absDr;
    }
  }

  const positions: GridPosition[] = [];
  for (let i = 0; i <= steps; i++) {
    positions.push({
      row: start.row + stepR * i,
      col: start.col + stepC * i,
    });
  }
  return positions;
}
