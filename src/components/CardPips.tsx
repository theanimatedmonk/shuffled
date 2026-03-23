import React from 'react';
import type { Rank, Suit } from '../types';

interface CardPipsProps {
  rank: Rank;
  suit: Suit;
  color: string;
}

// SVG suit shapes — viewBox 0 0 100 120 for proper aspect ratios
const SUIT_PATHS: Record<Suit, React.ReactNode> = {
  hearts: (
    <path d="M50 105 C50 105 5 65 5 35 C5 15 20 2 35 2 C43 2 50 10 50 20 C50 10 57 2 65 2 C80 2 95 15 95 35 C95 65 50 105 50 105Z" />
  ),
  diamonds: (
    <path d="M50 5 L90 60 L50 115 L10 60Z" />
  ),
  clubs: (
    <>
      <circle cx="50" cy="32" r="24" />
      <circle cx="28" cy="58" r="24" />
      <circle cx="72" cy="58" r="24" />
      <path d="M42 65 L42 112 L58 112 L58 65 C55 72 45 72 42 65Z" />
    </>
  ),
  spades: (
    <>
      <path d="M50 5 C50 5 5 50 5 72 C5 90 20 98 35 94 C43 92 50 85 50 78 C50 85 57 92 65 94 C80 98 95 90 95 72 C95 50 50 5 50 5Z" />
      <path d="M42 85 L42 115 L58 115 L58 85 C55 92 45 92 42 85Z" />
    </>
  ),
};

function SuitIcon({ suit, color, flipped }: { suit: Suit; color: string; flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 120"
      width="100%"
      height="100%"
      fill={color}
      style={flipped ? { transform: 'rotate(180deg)' } : undefined}
    >
      {SUIT_PATHS[suit]}
    </svg>
  );
}

// Pip positions: [col, row%]
// col: 0=left(25%), 1=center(50%), 2=right(75%)
// row: percentage within pip area (0=top edge, 100=bottom edge)
type PipDef = { col: 0 | 1 | 2; row: number };

const LAYOUTS: Partial<Record<Rank, PipDef[]>> = {
  '2': [
    { col: 1, row: 5 },
    { col: 1, row: 95 },
  ],
  '3': [
    { col: 1, row: 5 },
    { col: 1, row: 50 },
    { col: 1, row: 95 },
  ],
  '4': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
  '5': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 1, row: 50 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
  '6': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 0, row: 50 }, { col: 2, row: 50 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
  '7': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 1, row: 28 },
    { col: 0, row: 50 }, { col: 2, row: 50 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
  '8': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 1, row: 28 },
    { col: 0, row: 50 }, { col: 2, row: 50 },
    { col: 1, row: 72 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
  '9': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 0, row: 35 }, { col: 2, row: 35 },
    { col: 1, row: 50 },
    { col: 0, row: 65 }, { col: 2, row: 65 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
  '10': [
    { col: 0, row: 5 }, { col: 2, row: 5 },
    { col: 1, row: 20 },
    { col: 0, row: 35 }, { col: 2, row: 35 },
    { col: 0, row: 65 }, { col: 2, row: 65 },
    { col: 1, row: 80 },
    { col: 0, row: 95 }, { col: 2, row: 95 },
  ],
};

// Column x positions
const COL_X = [25, 50, 75];

export const CardPips = React.memo(function CardPips({ rank, suit, color }: CardPipsProps) {
  const pips = LAYOUTS[rank];
  if (!pips) return null;

  const numPips = pips.length;
  // Larger pips for fewer cards, scale down for more
  const sizePercent = numPips <= 3 ? 45 : numPips <= 5 ? 38 : numPips <= 8 ? 32 : 28;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: '13%',
        bottom: '13%',
        left: '5%',
        right: '5%',
      }}
    >
      {pips.map(({ col, row }, i) => {
        const isFlipped = row > 55;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${COL_X[col]}%`,
              top: `${row}%`,
              width: `${sizePercent}%`,
              aspectRatio: '100 / 120',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <SuitIcon suit={suit} color={color} flipped={isFlipped} />
          </div>
        );
      })}
    </div>
  );
});
