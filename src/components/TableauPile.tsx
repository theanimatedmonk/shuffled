import React from 'react';
import type { Card, PileId, SelectedCard } from '../types';
import { CardComponent } from './Card';
import { Placeholder } from './Placeholder';

interface TableauPileProps {
  index: number;
  cards: Card[];
  selectedCard: SelectedCard | null;
  isValidTarget: boolean;
  draggingCards: Set<string>;
  onPointerDown: (e: React.PointerEvent, pileId: PileId, cardIndex: number) => void;
  onCardClick: (pileId: PileId, cardIndex: number) => void;
  onDoubleClick: (pileId: PileId, cardIndex: number) => void;
  onPileClick: (pileId: PileId) => void;
}

export const TableauPile = React.memo(function TableauPile({
  index,
  cards,
  selectedCard,
  isValidTarget,
  draggingCards,
  onPointerDown,
  onCardClick,
  onDoubleClick,
  onPileClick,
}: TableauPileProps) {
  const pileId: PileId = `tableau-${index as 0 | 1 | 2 | 3 | 4 | 5 | 6}`;

  if (cards.length === 0) {
    return (
      <div className="tableau-pile" data-pile-id={pileId} style={{ height: 'var(--card-height)' }}>
        <Placeholder
          hint="K"
          isValidTarget={isValidTarget}
          onClick={() => onPileClick(pileId)}
        />
      </div>
    );
  }

  // Calculate offsets
  let totalOffset = 0;
  const offsets: number[] = [];
  for (let i = 0; i < cards.length; i++) {
    offsets.push(totalOffset);
    if (i < cards.length - 1) {
      totalOffset += cards[i].faceUp
        ? getCssVarPx('--tableau-offset', 22)
        : getCssVarPx('--tableau-offset-down', 8);
    }
  }
  const totalHeight = totalOffset + getCssVarPx('--card-height', 112);

  // Check if any card at or above index is selected
  const isInSelectedStack = (i: number) =>
    selectedCard?.pileId === pileId && selectedCard.cardIndex <= i;

  return (
    <div
      className="tableau-pile"
      data-pile-id={pileId}
      style={{ height: totalHeight }}
    >
      {cards.map((card, i) => (
        <CardComponent
          key={card.id}
          card={card}
          style={{
            top: offsets[i],
            left: 0,
            zIndex: i + 1,
          }}
          isSelected={isInSelectedStack(i)}
          isDragging={draggingCards.has(card.id)}
          isValidTarget={i === cards.length - 1 && isValidTarget}
          onPointerDown={(e) => onPointerDown(e, pileId, i)}
          onClick={() => onCardClick(pileId, i)}
          onDoubleClick={() => onDoubleClick(pileId, i)}
        />
      ))}
    </div>
  );
});

function getCssVarPx(name: string, fallback: number): number {
  if (typeof document === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}
