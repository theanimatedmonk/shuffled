import React from 'react';
import type { Card, PileId } from '../types';
import { CardComponent } from './Card';

interface WastePileProps {
  cards: Card[];
  selectedCardIndex: number | null;
  isValidTarget: boolean;
  onPointerDown: (e: React.PointerEvent, pileId: PileId, cardIndex: number) => void;
  onCardClick: (pileId: PileId, cardIndex: number) => void;
  onDoubleClick: (pileId: PileId, cardIndex: number) => void;
}

export const WastePile = React.memo(function WastePile({
  cards,
  selectedCardIndex,
  isValidTarget,
  onPointerDown,
  onCardClick,
  onDoubleClick,
}: WastePileProps) {
  if (cards.length === 0) {
    return <div className="relative w-[var(--card-width)] h-[var(--card-height)]" data-pile-id="waste" />;
  }

  const topIndex = cards.length - 1;
  const topCard = cards[topIndex];

  return (
    <div className="relative w-[var(--card-width)] h-[var(--card-height)]" data-pile-id="waste">
      <CardComponent
        card={topCard}
        isStatic
        isSelected={selectedCardIndex === topIndex}
        isValidTarget={isValidTarget}
        onPointerDown={(e) => onPointerDown(e, 'waste', topIndex)}
        onClick={() => onCardClick('waste', topIndex)}
        onDoubleClick={() => onDoubleClick('waste', topIndex)}
      />
    </div>
  );
});
