import React from 'react';
import { SUIT_SYMBOLS } from '../../constants';
import type { Suit } from '../../types';

interface CompletedSuitsDisplayProps {
  completedSuits: number;
}

const SUIT_ORDER: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

export const CompletedSuitsDisplay = React.memo(function CompletedSuitsDisplay({
  completedSuits,
}: CompletedSuitsDisplayProps) {
  if (completedSuits === 0) return null;

  return (
    <div className="flex items-center" style={{ gap: 'clamp(2px, 0.5vw, 4px)' }}>
      {Array.from({ length: completedSuits }, (_, i) => {
        const suit = SUIT_ORDER[i % 4];
        const color = suit === 'hearts' || suit === 'diamonds' ? '#ef5350' : '#e0e0e0';
        return (
          <span
            key={i}
            style={{
              fontSize: 'clamp(12px, 2.8vw, 16px)',
              color,
              lineHeight: 1,
              opacity: 0.9,
            }}
          >
            {SUIT_SYMBOLS[suit]}
          </span>
        );
      })}
    </div>
  );
});
