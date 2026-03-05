import type { MahjongTile, PlacedTile, LayoutPosition, MahjongGameState } from './types';
import { createTileSet, TURTLE_LAYOUT } from './constants';

// ── Shuffle ───────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Deal ──────────────────────────────────────────────────────

export function dealGame(layout: LayoutPosition[] = TURTLE_LAYOUT): MahjongGameState {
  const tiles = shuffleArray(createTileSet());
  const placed: PlacedTile[] = layout.map((pos, i) => ({
    tile: tiles[i],
    position: pos,
  }));

  return {
    tiles: placed,
    removedPairs: [],
    selectedTile: null,
    moves: 0,
    score: 0,
    history: [],
    hasWon: false,
    hasLost: false,
  };
}

// ── Position lookup helpers ───────────────────────────────────


// ── Free tile detection ───────────────────────────────────────
// A tile is "free" if:
// 1. No tile is on the layer directly above covering it
// 2. At least one side (left or right) is unblocked on the same layer
//
// Tiles use even-spaced columns (step of 2) so a tile at col C
// is adjacent to tiles at col C-2 (left) and col C+2 (right).
// For upper layers with odd offsets, we check overlap within 2 cols.

export function isTileFree(tile: PlacedTile, allTiles: PlacedTile[]): boolean {
  const { row, col, layer } = tile.position;

  // Check if blocked from above: any tile on layer+1 whose position
  // overlaps with this tile. Overlap if |row diff| < 2 AND |col diff| < 2.
  for (const t of allTiles) {
    if (t.position.layer === layer + 1) {
      if (Math.abs(t.position.row - row) < 2 && Math.abs(t.position.col - col) < 2) {
        return false;
      }
    }
  }

  // Check left/right blocking on same layer.
  // A tile is blocked on the left if any tile at same layer has
  // col = col-2 and |row diff| < 2.
  let blockedLeft = false;
  let blockedRight = false;
  for (const t of allTiles) {
    if (t.position.layer !== layer || t.tile.id === tile.tile.id) continue;
    const rowDiff = Math.abs(t.position.row - row);
    if (rowDiff < 2) {
      if (t.position.col === col - 2) blockedLeft = true;
      if (t.position.col === col + 2) blockedRight = true;
    }
  }

  return !blockedLeft || !blockedRight;
}

export function isTileFreeFast(
  tile: PlacedTile,
  allTiles: PlacedTile[],
): boolean {
  const { row, col, layer } = tile.position;

  // Check above: scan tiles on layer+1 for overlaps
  for (const t of allTiles) {
    if (t.position.layer === layer + 1) {
      if (Math.abs(t.position.row - row) < 2 && Math.abs(t.position.col - col) < 2) {
        return false;
      }
    }
  }

  // Check left/right on same layer
  let blockedLeft = false;
  let blockedRight = false;
  for (const t of allTiles) {
    if (t.position.layer !== layer || t.tile.id === tile.tile.id) continue;
    if (Math.abs(t.position.row - row) < 2) {
      if (t.position.col === col - 2) blockedLeft = true;
      if (t.position.col === col + 2) blockedRight = true;
    }
    if (blockedLeft && blockedRight) return false;
  }

  return true;
}

export function getFreeTiles(tiles: PlacedTile[]): PlacedTile[] {
  return tiles.filter(t => isTileFreeFast(t, tiles));
}

// ── Matching ──────────────────────────────────────────────────

export function tilesMatch(a: MahjongTile, b: MahjongTile): boolean {
  return a.id !== b.id && a.matchKey === b.matchKey;
}

export function findValidPairs(tiles: PlacedTile[]): [PlacedTile, PlacedTile][] {
  const free = getFreeTiles(tiles);
  const pairs: [PlacedTile, PlacedTile][] = [];
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (tilesMatch(free[i].tile, free[j].tile)) {
        pairs.push([free[i], free[j]]);
      }
    }
  }
  return pairs;
}

// ── Remove pair ───────────────────────────────────────────────

export function removePair(
  state: MahjongGameState,
  tileId1: string,
  tileId2: string
): MahjongGameState {
  const historyEntry = {
    tiles: state.tiles,
    removedPairs: state.removedPairs,
    moves: state.moves,
    score: state.score,
  };

  const newTiles = state.tiles.filter(
    t => t.tile.id !== tileId1 && t.tile.id !== tileId2
  );
  const newScore = state.score + 10;
  const newMoves = state.moves + 1;
  const hasWon = newTiles.length === 0;
  const hasLost = !hasWon && findValidPairs(newTiles).length === 0;

  return {
    tiles: newTiles,
    removedPairs: [...state.removedPairs, [tileId1, tileId2]],
    selectedTile: null,
    moves: newMoves,
    score: newScore,
    history: [...state.history, historyEntry],
    hasWon,
    hasLost,
  };
}

// ── Shuffle remaining tiles ───────────────────────────────────

export function shuffleRemainingTiles(state: MahjongGameState): MahjongGameState {
  const positions = state.tiles.map(t => t.position);
  const shuffledTiles = shuffleArray(state.tiles.map(t => t.tile));
  const newTiles: PlacedTile[] = positions.map((pos, i) => ({
    tile: shuffledTiles[i],
    position: pos,
  }));

  const hasLost = findValidPairs(newTiles).length === 0;

  return {
    ...state,
    tiles: newTiles,
    selectedTile: null,
    score: Math.max(0, state.score - 50),
    hasLost,
  };
}

// ── Hint ──────────────────────────────────────────────────────

export function getHint(tiles: PlacedTile[]): [string, string] | null {
  const pairs = findValidPairs(tiles);
  if (pairs.length === 0) return null;
  return [pairs[0][0].tile.id, pairs[0][1].tile.id];
}

// ── Win/Lose ──────────────────────────────────────────────────

export function checkWin(tiles: PlacedTile[]): boolean {
  return tiles.length === 0;
}

export function checkLose(tiles: PlacedTile[]): boolean {
  return tiles.length > 0 && findValidPairs(tiles).length === 0;
}
