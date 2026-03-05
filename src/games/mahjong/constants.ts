import type { MahjongTile, TileSuit, TileWind, TileDragon, LayoutPosition } from './types';

// ── Tile Display Info ─────────────────────────────────────────

const SUIT_SYMBOLS: Record<TileSuit, string> = {
  bamboo: '竹',
  circles: '●',
  characters: '万',
};

const SUIT_COLORS: Record<TileSuit, string> = {
  bamboo: '#2e7d32',
  circles: '#1565c0',
  characters: '#c62828',
};

const WIND_SYMBOLS: Record<TileWind, string> = {
  east: '東', south: '南', west: '西', north: '北',
};

const DRAGON_SYMBOLS: Record<TileDragon, string> = {
  red: '中', green: '發', white: '□',
};

const DRAGON_COLORS: Record<TileDragon, string> = {
  red: '#c62828', green: '#2e7d32', white: '#555',
};

const SEASON_SYMBOLS = ['春', '夏', '秋', '冬'];
const SEASON_LABELS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const FLOWER_SYMBOLS = ['梅', '蘭', '菊', '竹'];
const FLOWER_LABELS = ['Plum', 'Orchid', 'Chrysanth.', 'Bamboo'];

// ── Tile Set Creation ─────────────────────────────────────────

export function createTileSet(): MahjongTile[] {
  const tiles: MahjongTile[] = [];
  let id = 0;

  // Suited tiles: bamboo, circles, characters × ranks 1-9 × 4 copies
  const suits: TileSuit[] = ['bamboo', 'circles', 'characters'];
  for (const suit of suits) {
    for (let rank = 1; rank <= 9; rank++) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({
          id: `t${id++}`,
          category: 'suited',
          suit,
          rank,
          matchKey: `${suit}-${rank}`,
          symbol: `${rank}`,
          label: `${suit.charAt(0).toUpperCase() + suit.slice(1)} ${rank}`,
          color: SUIT_COLORS[suit],
        });
      }
    }
  }

  // Wind tiles: 4 winds × 4 copies
  const winds: TileWind[] = ['east', 'south', 'west', 'north'];
  for (const wind of winds) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `t${id++}`,
        category: 'wind',
        wind,
        matchKey: `wind-${wind}`,
        symbol: WIND_SYMBOLS[wind],
        label: `${wind.charAt(0).toUpperCase() + wind.slice(1)} Wind`,
        color: '#333',
      });
    }
  }

  // Dragon tiles: 3 dragons × 4 copies
  const dragons: TileDragon[] = ['red', 'green', 'white'];
  for (const dragon of dragons) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `t${id++}`,
        category: 'dragon',
        dragon,
        matchKey: `dragon-${dragon}`,
        symbol: DRAGON_SYMBOLS[dragon],
        label: `${dragon.charAt(0).toUpperCase() + dragon.slice(1)} Dragon`,
        color: DRAGON_COLORS[dragon],
      });
    }
  }

  // Season tiles: 4 unique tiles, all match each other
  for (let i = 0; i < 4; i++) {
    tiles.push({
      id: `t${id++}`,
      category: 'season',
      bonusIndex: i,
      matchKey: 'season',
      symbol: SEASON_SYMBOLS[i],
      label: SEASON_LABELS[i],
      color: '#6a1b9a',
    });
  }

  // Flower tiles: 4 unique tiles, all match each other
  for (let i = 0; i < 4; i++) {
    tiles.push({
      id: `t${id++}`,
      category: 'flower',
      bonusIndex: i,
      matchKey: 'flower',
      symbol: FLOWER_SYMBOLS[i],
      label: FLOWER_LABELS[i],
      color: '#e65100',
    });
  }

  return tiles; // 144 total
}

// ── Suit symbol getter for tile rendering ─────────────────────
export function getSuitSymbol(tile: MahjongTile): string {
  if (tile.suit) return SUIT_SYMBOLS[tile.suit];
  return '';
}

// ── Classic Turtle Layout (144 positions) ─────────────────────
// Grid uses half-unit positions for offset layers.
// Each tile occupies 2 columns × 2 rows in the grid coordinate system
// to allow half-tile offsets on upper layers.

export const TURTLE_LAYOUT: LayoutPosition[] = [
  // ═══ Layer 0 (ground level) — 86 tiles ═══
  // Row 0: 12 tiles
  { row: 0, col: 2, layer: 0 }, { row: 0, col: 4, layer: 0 },
  { row: 0, col: 6, layer: 0 }, { row: 0, col: 8, layer: 0 },
  { row: 0, col: 10, layer: 0 }, { row: 0, col: 12, layer: 0 },
  { row: 0, col: 14, layer: 0 }, { row: 0, col: 16, layer: 0 },
  { row: 0, col: 18, layer: 0 }, { row: 0, col: 20, layer: 0 },
  { row: 0, col: 22, layer: 0 }, { row: 0, col: 24, layer: 0 },
  // Row 1: 8 tiles (narrower)
  { row: 2, col: 4, layer: 0 }, { row: 2, col: 6, layer: 0 },
  { row: 2, col: 8, layer: 0 }, { row: 2, col: 10, layer: 0 },
  { row: 2, col: 16, layer: 0 }, { row: 2, col: 18, layer: 0 },
  { row: 2, col: 20, layer: 0 }, { row: 2, col: 22, layer: 0 },
  // Row 2: 10 tiles
  { row: 4, col: 2, layer: 0 }, { row: 4, col: 4, layer: 0 },
  { row: 4, col: 6, layer: 0 }, { row: 4, col: 8, layer: 0 },
  { row: 4, col: 10, layer: 0 }, { row: 4, col: 12, layer: 0 },
  { row: 4, col: 14, layer: 0 }, { row: 4, col: 16, layer: 0 },
  { row: 4, col: 18, layer: 0 }, { row: 4, col: 20, layer: 0 },
  // Row 3: 12 tiles + 2 wings
  { row: 6, col: 0, layer: 0 }, // left wing
  { row: 6, col: 2, layer: 0 }, { row: 6, col: 4, layer: 0 },
  { row: 6, col: 6, layer: 0 }, { row: 6, col: 8, layer: 0 },
  { row: 6, col: 10, layer: 0 }, { row: 6, col: 12, layer: 0 },
  { row: 6, col: 14, layer: 0 }, { row: 6, col: 16, layer: 0 },
  { row: 6, col: 18, layer: 0 }, { row: 6, col: 20, layer: 0 },
  { row: 6, col: 22, layer: 0 }, { row: 6, col: 24, layer: 0 },
  { row: 6, col: 26, layer: 0 }, // right wing
  // Row 4: 12 tiles
  { row: 8, col: 2, layer: 0 }, { row: 8, col: 4, layer: 0 },
  { row: 8, col: 6, layer: 0 }, { row: 8, col: 8, layer: 0 },
  { row: 8, col: 10, layer: 0 }, { row: 8, col: 12, layer: 0 },
  { row: 8, col: 14, layer: 0 }, { row: 8, col: 16, layer: 0 },
  { row: 8, col: 18, layer: 0 }, { row: 8, col: 20, layer: 0 },
  { row: 8, col: 22, layer: 0 }, { row: 8, col: 24, layer: 0 },
  // Row 5: 10 tiles
  { row: 10, col: 2, layer: 0 }, { row: 10, col: 4, layer: 0 },
  { row: 10, col: 6, layer: 0 }, { row: 10, col: 8, layer: 0 },
  { row: 10, col: 10, layer: 0 }, { row: 10, col: 12, layer: 0 },
  { row: 10, col: 14, layer: 0 }, { row: 10, col: 16, layer: 0 },
  { row: 10, col: 18, layer: 0 }, { row: 10, col: 20, layer: 0 },
  // Row 6: 8 tiles
  { row: 12, col: 4, layer: 0 }, { row: 12, col: 6, layer: 0 },
  { row: 12, col: 8, layer: 0 }, { row: 12, col: 10, layer: 0 },
  { row: 12, col: 16, layer: 0 }, { row: 12, col: 18, layer: 0 },
  { row: 12, col: 20, layer: 0 }, { row: 12, col: 22, layer: 0 },
  // Row 7: 12 tiles
  { row: 14, col: 2, layer: 0 }, { row: 14, col: 4, layer: 0 },
  { row: 14, col: 6, layer: 0 }, { row: 14, col: 8, layer: 0 },
  { row: 14, col: 10, layer: 0 }, { row: 14, col: 12, layer: 0 },
  { row: 14, col: 14, layer: 0 }, { row: 14, col: 16, layer: 0 },
  { row: 14, col: 18, layer: 0 }, { row: 14, col: 20, layer: 0 },
  { row: 14, col: 22, layer: 0 }, { row: 14, col: 24, layer: 0 },

  // ═══ Layer 1 — 36 tiles ═══
  // Row 0: 6 tiles
  { row: 1, col: 5, layer: 1 }, { row: 1, col: 7, layer: 1 },
  { row: 1, col: 9, layer: 1 }, { row: 1, col: 17, layer: 1 },
  { row: 1, col: 19, layer: 1 }, { row: 1, col: 21, layer: 1 },
  // Row 1: 6 tiles
  { row: 3, col: 5, layer: 1 }, { row: 3, col: 7, layer: 1 },
  { row: 3, col: 9, layer: 1 }, { row: 3, col: 17, layer: 1 },
  { row: 3, col: 19, layer: 1 }, { row: 3, col: 21, layer: 1 },
  // Row 2: 6 tiles
  { row: 5, col: 5, layer: 1 }, { row: 5, col: 7, layer: 1 },
  { row: 5, col: 9, layer: 1 }, { row: 5, col: 17, layer: 1 },
  { row: 5, col: 19, layer: 1 }, { row: 5, col: 21, layer: 1 },
  // Row 3: 6 tiles
  { row: 9, col: 5, layer: 1 }, { row: 9, col: 7, layer: 1 },
  { row: 9, col: 9, layer: 1 }, { row: 9, col: 17, layer: 1 },
  { row: 9, col: 19, layer: 1 }, { row: 9, col: 21, layer: 1 },
  // Row 4: 6 tiles
  { row: 11, col: 5, layer: 1 }, { row: 11, col: 7, layer: 1 },
  { row: 11, col: 9, layer: 1 }, { row: 11, col: 17, layer: 1 },
  { row: 11, col: 19, layer: 1 }, { row: 11, col: 21, layer: 1 },
  // Row 5: 6 tiles
  { row: 13, col: 5, layer: 1 }, { row: 13, col: 7, layer: 1 },
  { row: 13, col: 9, layer: 1 }, { row: 13, col: 17, layer: 1 },
  { row: 13, col: 19, layer: 1 }, { row: 13, col: 21, layer: 1 },

  // ═══ Layer 2 — 16 tiles (4×4 center block) ═══
  { row: 4, col: 8, layer: 2 }, { row: 4, col: 10, layer: 2 },
  { row: 4, col: 16, layer: 2 }, { row: 4, col: 18, layer: 2 },
  { row: 6, col: 8, layer: 2 }, { row: 6, col: 10, layer: 2 },
  { row: 6, col: 16, layer: 2 }, { row: 6, col: 18, layer: 2 },
  { row: 8, col: 8, layer: 2 }, { row: 8, col: 10, layer: 2 },
  { row: 8, col: 16, layer: 2 }, { row: 8, col: 18, layer: 2 },
  { row: 10, col: 8, layer: 2 }, { row: 10, col: 10, layer: 2 },
  { row: 10, col: 16, layer: 2 }, { row: 10, col: 18, layer: 2 },

  // ═══ Layer 3 — 4 tiles (2×2 center) ═══
  { row: 5, col: 11, layer: 3 }, { row: 5, col: 15, layer: 3 },
  { row: 9, col: 11, layer: 3 }, { row: 9, col: 15, layer: 3 },

  // ═══ Layer 4 — 2 tiles (cap) ═══
  { row: 7, col: 12, layer: 4 }, { row: 7, col: 14, layer: 4 },
];
// Total: 86 (layer 0) + 36 (layer 1) + 16 (layer 2) + 4 (layer 3) + 2 (layer 4) = 144
