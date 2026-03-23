import type { LevelConfig, Direction } from './types';

// 50 levels: 10 per grid size, gradually increasing word count and directions
export const LEVELS: LevelConfig[] = [
  // 8x8 grid — Levels 1-10 (right, down; diagonal added at level 6)
  { level: 1,  gridRows: 8, gridCols: 8, wordCount: 3, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 2,  gridRows: 8, gridCols: 8, wordCount: 3, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 3,  gridRows: 8, gridCols: 8, wordCount: 4, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 4,  gridRows: 8, gridCols: 8, wordCount: 4, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 5,  gridRows: 8, gridCols: 8, wordCount: 5, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 6,  gridRows: 8, gridCols: 8, wordCount: 5, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down', 'downRight'] },
  { level: 7,  gridRows: 8, gridCols: 8, wordCount: 5, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down', 'downRight'] },
  { level: 8,  gridRows: 8, gridCols: 8, wordCount: 6, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down', 'downRight'] },
  { level: 9,  gridRows: 8, gridCols: 8, wordCount: 6, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down', 'downRight'] },
  { level: 10, gridRows: 8, gridCols: 8, wordCount: 6, minWordLength: 4, maxWordLength: 5, directions: ['right', 'down', 'downRight'] },

  // 9x9 grid — Levels 11-20 (3 directions; 4th added at level 16)
  { level: 11, gridRows: 9, gridCols: 9, wordCount: 5, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 12, gridRows: 9, gridCols: 9, wordCount: 5, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 13, gridRows: 9, gridCols: 9, wordCount: 6, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 14, gridRows: 9, gridCols: 9, wordCount: 6, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 15, gridRows: 9, gridCols: 9, wordCount: 7, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 16, gridRows: 9, gridCols: 9, wordCount: 7, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 17, gridRows: 9, gridCols: 9, wordCount: 7, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 18, gridRows: 9, gridCols: 9, wordCount: 8, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 19, gridRows: 9, gridCols: 9, wordCount: 8, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 20, gridRows: 9, gridCols: 9, wordCount: 8, minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight', 'downLeft'] },

  // 10x10 grid — Levels 21-30 (all 4 directions)
  { level: 21, gridRows: 10, gridCols: 10, wordCount: 6,  minWordLength: 4, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 22, gridRows: 10, gridCols: 10, wordCount: 6,  minWordLength: 4, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 23, gridRows: 10, gridCols: 10, wordCount: 7,  minWordLength: 4, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 24, gridRows: 10, gridCols: 10, wordCount: 7,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 25, gridRows: 10, gridCols: 10, wordCount: 8,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 26, gridRows: 10, gridCols: 10, wordCount: 8,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 27, gridRows: 10, gridCols: 10, wordCount: 9,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 28, gridRows: 10, gridCols: 10, wordCount: 9,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 29, gridRows: 10, gridCols: 10, wordCount: 10, minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 30, gridRows: 10, gridCols: 10, wordCount: 10, minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },

  // 11x11 grid — Levels 31-40 (all 4 directions, longer words)
  { level: 31, gridRows: 11, gridCols: 11, wordCount: 8,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 32, gridRows: 11, gridCols: 11, wordCount: 8,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 33, gridRows: 11, gridCols: 11, wordCount: 9,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 34, gridRows: 11, gridCols: 11, wordCount: 9,  minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 35, gridRows: 11, gridCols: 11, wordCount: 10, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 36, gridRows: 11, gridCols: 11, wordCount: 10, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 37, gridRows: 11, gridCols: 11, wordCount: 11, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 38, gridRows: 11, gridCols: 11, wordCount: 11, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 39, gridRows: 11, gridCols: 11, wordCount: 12, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 40, gridRows: 11, gridCols: 11, wordCount: 12, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },

  // 12x12 grid — Levels 41-50 (all 4 directions, hardest)
  { level: 41, gridRows: 12, gridCols: 12, wordCount: 10, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 42, gridRows: 12, gridCols: 12, wordCount: 10, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 43, gridRows: 12, gridCols: 12, wordCount: 11, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 44, gridRows: 12, gridCols: 12, wordCount: 11, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 45, gridRows: 12, gridCols: 12, wordCount: 12, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 46, gridRows: 12, gridCols: 12, wordCount: 12, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 47, gridRows: 12, gridCols: 12, wordCount: 13, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 48, gridRows: 12, gridCols: 12, wordCount: 13, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 49, gridRows: 12, gridCols: 12, wordCount: 14, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 50, gridRows: 12, gridCols: 12, wordCount: 14, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
];

/** Get config for a level. Levels beyond 50 repeat the hardest config. */
export function getLevelConfig(level: number): LevelConfig {
  const idx = Math.min(level - 1, LEVELS.length - 1);
  return { ...LEVELS[idx], level };
}

/** All 4 possible directions */
export const ALL_DIRECTIONS: Direction[] = ['right', 'down', 'downRight', 'downLeft'];
