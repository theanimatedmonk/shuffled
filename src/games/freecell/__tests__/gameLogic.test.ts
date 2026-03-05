import { describe, it, expect } from 'vitest';
import type { Card, Suit, Rank, FreeCellGameState } from '../types';
import {
  dealFreeCellGame,
  isValidFreeCellMove,
  checkWin,
  getMaxMovableCards,
  getValidFreeCellDropTargets,
  findAutoMoveToFoundation,
  findSafeFreeCellAutoMoves,
  canAutoComplete,
} from '../gameLogic';
import { SUIT_COLORS } from '../../../constants';

function makeCard(rank: Rank, suit: Suit, faceUp = true): Card {
  return { id: `${suit}-${rank}`, suit, rank, color: SUIT_COLORS[suit], faceUp };
}

function emptyState(overrides: Partial<FreeCellGameState> = {}): FreeCellGameState {
  return {
    freeCells: [null, null, null, null],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], [], []],
    moves: 0,
    score: 0,
    history: [],
    hasWon: false,
    selectedCard: null,
    ...overrides,
  };
}

// ── dealFreeCellGame ──────────────────────────────────────────

describe('dealFreeCellGame', () => {
  it('creates 52 total cards all face up', () => {
    const state = dealFreeCellGame();
    const total = state.tableau.reduce((s, t) => s + t.length, 0);
    expect(total).toBe(52);
    for (const pile of state.tableau) {
      for (const card of pile) {
        expect(card.faceUp).toBe(true);
      }
    }
  });

  it('deals 8 tableau columns (4×7 + 4×6)', () => {
    const state = dealFreeCellGame();
    expect(state.tableau).toHaveLength(8);
    const sizes = state.tableau.map(t => t.length).sort((a, b) => a - b);
    expect(sizes).toEqual([6, 6, 6, 6, 7, 7, 7, 7]);
  });

  it('starts with empty free cells and foundations', () => {
    const state = dealFreeCellGame();
    expect(state.freeCells).toEqual([null, null, null, null]);
    for (const f of state.foundations) {
      expect(f).toHaveLength(0);
    }
  });
});

// ── getMaxMovableCards ────────────────────────────────────────

describe('getMaxMovableCards', () => {
  it('returns (free+1)×2^empty with all empty', () => {
    const state = emptyState(); // 4 free cells, 8 empty tableau
    // (4+1) × 2^8 = 5 × 256 = 1280
    expect(getMaxMovableCards(state)).toBe(1280);
  });

  it('returns 1 when no free cells and no empty tableau', () => {
    const state = emptyState({
      freeCells: [makeCard('A', 'hearts'), makeCard('2', 'hearts'), makeCard('3', 'hearts'), makeCard('4', 'hearts')],
      tableau: Array.from({ length: 8 }, () => [makeCard('K', 'spades')]),
    });
    expect(getMaxMovableCards(state)).toBe(1);
  });

  it('subtracts 1 empty tableau when moving to empty', () => {
    const state = emptyState({
      freeCells: [null, null, null, null],
      tableau: [[makeCard('K', 'spades')], [], [], [], [], [], [], []],
    });
    // 7 empty tableau, 4 free cells
    // To non-empty: (4+1) × 2^7 = 640
    expect(getMaxMovableCards(state, false)).toBe(640);
    // To empty: (4+1) × 2^6 = 320
    expect(getMaxMovableCards(state, true)).toBe(320);
  });
});

// ── isValidFreeCellMove ───────────────────────────────────────

describe('isValidFreeCellMove', () => {
  it('rejects move to same pile', () => {
    const state = emptyState({
      tableau: [[makeCard('K', 'spades')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'tableau-0', 0)).toBe(false);
  });

  it('allows single card to empty free cell', () => {
    const state = emptyState({
      tableau: [[makeCard('K', 'spades')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'freecell-0', 0)).toBe(true);
  });

  it('rejects card to occupied free cell', () => {
    const state = emptyState({
      freeCells: [makeCard('A', 'hearts'), null, null, null],
      tableau: [[makeCard('K', 'spades')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'freecell-0', 0)).toBe(false);
  });

  it('allows Ace to correct foundation', () => {
    const state = emptyState({
      tableau: [[makeCard('A', 'hearts')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'foundation-0', 0)).toBe(true);
  });

  it('rejects Ace to wrong foundation', () => {
    const state = emptyState({
      tableau: [[makeCard('A', 'hearts')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'foundation-1', 0)).toBe(false);
  });

  it('allows alternating color descending to tableau', () => {
    const state = emptyState({
      tableau: [
        [makeCard('6', 'spades')], // black 6
        [makeCard('7', 'hearts')], // red 7
        [], [], [], [], [], [],
      ],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'tableau-1', 0)).toBe(true);
  });

  it('rejects same color to tableau', () => {
    const state = emptyState({
      tableau: [
        [makeCard('6', 'hearts')], // red 6
        [makeCard('7', 'diamonds')], // red 7
        [], [], [], [], [], [],
      ],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'tableau-1', 0)).toBe(false);
  });

  it('allows any card to empty tableau', () => {
    const state = emptyState({
      tableau: [[makeCard('5', 'hearts')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'tableau-0', 'tableau-1', 0)).toBe(true);
  });

  it('enforces supermove limit', () => {
    // 2 cards in a valid sequence, but only 1 movable
    const state = emptyState({
      freeCells: [makeCard('A', 'hearts'), makeCard('2', 'hearts'), makeCard('3', 'hearts'), makeCard('4', 'hearts')],
      tableau: [
        [makeCard('7', 'hearts'), makeCard('6', 'spades')], // red 7, black 6 — valid sequence
        [makeCard('8', 'spades')], // black 8 — valid target for red 7
        [makeCard('K', 'clubs')], [makeCard('K', 'diamonds')], [makeCard('K', 'hearts')],
        [makeCard('K', 'spades')], [makeCard('Q', 'clubs')], [makeCard('Q', 'diamonds')],
      ],
    });
    // 0 free cells, 0 empty tableau → max = 1
    expect(getMaxMovableCards(state)).toBe(1);
    // Moving 2 cards (the sequence) should fail due to supermove limit
    expect(isValidFreeCellMove(state, 'tableau-0', 'tableau-1', 0)).toBe(false);
    // Moving single card (black 6) to tableau with red 7 — valid color + rank
    expect(isValidFreeCellMove(state, 'tableau-0', 'tableau-2', 1)).toBe(false); // K clubs, not valid
    // Moving single card (black 6) to an appropriate target
    const state2 = emptyState({
      freeCells: [makeCard('A', 'hearts'), makeCard('2', 'hearts'), makeCard('3', 'hearts'), makeCard('4', 'hearts')],
      tableau: [
        [makeCard('7', 'hearts'), makeCard('6', 'spades')], // red 7, black 6
        [makeCard('7', 'diamonds')], // red 7 — valid target for black 6
        [makeCard('K', 'clubs')], [makeCard('K', 'diamonds')], [makeCard('K', 'hearts')],
        [makeCard('K', 'spades')], [makeCard('Q', 'clubs')], [makeCard('Q', 'diamonds')],
      ],
    });
    expect(getMaxMovableCards(state2)).toBe(1);
    // Moving single card (index 1 = black 6) to red 7 should work
    expect(isValidFreeCellMove(state2, 'tableau-0', 'tableau-1', 1)).toBe(true);
  });

  it('allows moving from free cell to foundation', () => {
    const state = emptyState({
      freeCells: [makeCard('A', 'hearts'), null, null, null],
    });
    expect(isValidFreeCellMove(state, 'freecell-0', 'foundation-0', 0)).toBe(true);
  });

  it('allows moving from free cell to tableau', () => {
    const state = emptyState({
      freeCells: [makeCard('6', 'spades'), null, null, null],
      tableau: [[makeCard('7', 'hearts')], [], [], [], [], [], [], []],
    });
    expect(isValidFreeCellMove(state, 'freecell-0', 'tableau-0', 0)).toBe(true);
  });
});

// ── checkWin ──────────────────────────────────────────────────

describe('checkWin', () => {
  it('returns true when all foundations full', () => {
    const full = Array.from({ length: 13 }, () => makeCard('A', 'hearts'));
    const state = emptyState({
      foundations: [full, [...full], [...full], [...full]],
    });
    expect(checkWin(state)).toBe(true);
  });

  it('returns false when incomplete', () => {
    const state = emptyState({
      foundations: [[makeCard('A', 'hearts')], [], [], []],
    });
    expect(checkWin(state)).toBe(false);
  });
});

// ── getValidFreeCellDropTargets ───────────────────────────────

describe('getValidFreeCellDropTargets', () => {
  it('includes free cells, foundations, and tableau', () => {
    const state = emptyState({
      tableau: [[makeCard('A', 'hearts')], [], [], [], [], [], [], []],
    });
    const targets = getValidFreeCellDropTargets(state, 'tableau-0', 0);
    // Should include foundation-0 (Ace of hearts) + 4 free cells + 7 empty tableau
    expect(targets).toContain('foundation-0');
    expect(targets).toContain('freecell-0');
    expect(targets.length).toBeGreaterThanOrEqual(10);
  });
});

// ── findAutoMoveToFoundation ──────────────────────────────────

describe('findAutoMoveToFoundation', () => {
  it('finds foundation for Ace on tableau', () => {
    const state = emptyState({
      tableau: [[makeCard('A', 'hearts')], [], [], [], [], [], [], []],
    });
    const target = findAutoMoveToFoundation(state, 'tableau-0', 0);
    expect(target).toBe('foundation-0');
  });

  it('finds foundation for card in free cell', () => {
    const state = emptyState({
      freeCells: [makeCard('A', 'hearts'), null, null, null],
    });
    const target = findAutoMoveToFoundation(state, 'freecell-0', 0);
    expect(target).toBe('foundation-0');
  });

  it('returns null for non-top card', () => {
    const state = emptyState({
      tableau: [[makeCard('A', 'hearts'), makeCard('2', 'spades')], [], [], [], [], [], [], []],
    });
    expect(findAutoMoveToFoundation(state, 'tableau-0', 0)).toBeNull();
  });
});

// ── findSafeFreeCellAutoMoves ─────────────────────────────────

describe('findSafeFreeCellAutoMoves', () => {
  it('considers Aces safe', () => {
    const state = emptyState({
      tableau: [[makeCard('A', 'hearts')], [], [], [], [], [], [], []],
    });
    const moves = findSafeFreeCellAutoMoves(state);
    expect(moves).toHaveLength(1);
    expect(moves[0].from).toBe('tableau-0');
    expect(moves[0].to).toBe('foundation-0');
  });

  it('finds safe moves from free cells', () => {
    const state = emptyState({
      freeCells: [makeCard('A', 'diamonds'), null, null, null],
    });
    const moves = findSafeFreeCellAutoMoves(state);
    expect(moves).toHaveLength(1);
    expect(moves[0].from).toBe('freecell-0');
    expect(moves[0].to).toBe('foundation-1');
  });

  it('returns empty when no safe moves', () => {
    const state = emptyState({
      tableau: [[makeCard('K', 'spades')], [], [], [], [], [], [], []],
    });
    expect(findSafeFreeCellAutoMoves(state)).toHaveLength(0);
  });
});

// ── canAutoComplete ───────────────────────────────────────────

describe('canAutoComplete', () => {
  it('returns true when all tableau descending and free cells empty', () => {
    const state = emptyState({
      tableau: [
        [makeCard('5', 'hearts'), makeCard('4', 'spades'), makeCard('3', 'hearts')],
        [], [], [], [], [], [], [],
      ],
    });
    expect(canAutoComplete(state)).toBe(true);
  });

  it('returns false when tableau not descending', () => {
    const state = emptyState({
      tableau: [
        [makeCard('3', 'hearts'), makeCard('5', 'spades')], // not descending
        [], [], [], [], [], [], [],
      ],
    });
    expect(canAutoComplete(state)).toBe(false);
  });

  it('returns false when free cells occupied', () => {
    const state = emptyState({
      freeCells: [makeCard('A', 'hearts'), null, null, null],
      tableau: [
        [makeCard('3', 'spades'), makeCard('2', 'hearts')],
        [], [], [], [], [], [], [],
      ],
    });
    expect(canAutoComplete(state)).toBe(false);
  });
});
