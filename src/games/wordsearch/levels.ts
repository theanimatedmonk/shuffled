import type { LevelConfig, Direction } from './types';

export const LEVELS: LevelConfig[] = [
  { level: 1,  gridRows: 8,  gridCols: 8,  wordCount: 4,  minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 2,  gridRows: 8,  gridCols: 8,  wordCount: 5,  minWordLength: 4, maxWordLength: 5, directions: ['right', 'down'] },
  { level: 3,  gridRows: 9,  gridCols: 9,  wordCount: 5,  minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 4,  gridRows: 9,  gridCols: 9,  wordCount: 6,  minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight'] },
  { level: 5,  gridRows: 10, gridCols: 10, wordCount: 6,  minWordLength: 4, maxWordLength: 6, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 6,  gridRows: 10, gridCols: 10, wordCount: 7,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 7,  gridRows: 11, gridCols: 11, wordCount: 8,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 8,  gridRows: 11, gridCols: 11, wordCount: 9,  minWordLength: 5, maxWordLength: 7, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 9,  gridRows: 12, gridCols: 12, wordCount: 10, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
  { level: 10, gridRows: 12, gridCols: 12, wordCount: 12, minWordLength: 5, maxWordLength: 8, directions: ['right', 'down', 'downRight', 'downLeft'] },
];

/** Get config for a level. Levels beyond 10 repeat the hardest config. */
export function getLevelConfig(level: number): LevelConfig {
  const idx = Math.min(level - 1, LEVELS.length - 1);
  return { ...LEVELS[idx], level };
}

/** All 4 possible directions */
export const ALL_DIRECTIONS: Direction[] = ['right', 'down', 'downRight', 'downLeft'];
