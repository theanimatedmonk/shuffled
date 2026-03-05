export function computeDisplayScore(
  baseScore: number,
  elapsedSeconds: number,
  timerEnabled: boolean,
): number {
  if (!timerEnabled) return baseScore;
  const penalty = Math.floor(elapsedSeconds / 10);
  return Math.max(0, baseScore - penalty);
}
