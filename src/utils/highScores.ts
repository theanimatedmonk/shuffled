import type { GameType } from '../types';

export interface BestScore {
  score: number;
  moves: number;
  elapsedSeconds: number;
  date: number;
}

function storageKey(gameType: GameType): string {
  return `shuffled-${gameType}-best`;
}

/** Load the best score for a game, or null if none saved. */
export function getBestScore(gameType: GameType): BestScore | null {
  try {
    const raw = localStorage.getItem(storageKey(gameType));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BestScore;
    if (typeof parsed.score !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Save a new best score if it beats the current record.
 * Returns `true` if this is a new personal best.
 */
export function saveBestScore(gameType: GameType, entry: BestScore): boolean {
  try {
    const current = getBestScore(gameType);
    if (current && current.score >= entry.score) {
      return false; // not a new best
    }
    localStorage.setItem(storageKey(gameType), JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}
