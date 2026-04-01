import React from 'react';
import type { Card } from '../../types';
import type { SelectedCard } from './types';
import { CardComponent } from '../../components/Card';
import { Placeholder } from '../../components/Placeholder';

interface FreeCellTableauPileProps {
  index: number;
  cards: Card[];
  selectedCard: SelectedCard | null;
  isValidTarget: boolean;
  draggingCards: Set<string>;
  onPointerDown: (e: React.PointerEvent, pileId: string, cardIndex: number) => void;
  onCardClick: (pileId: string, cardIndex: number) => void;
  onPileClick: (pileId: string) => void;
}

export const FreeCellTableauPile = React.memo(function FreeCellTableauPile({
  index,
  cards,
  selectedCard,
  isValidTarget,
  draggingCards,
  onPointerDown,
  onCardClick,
  onPileClick,
}: FreeCellTableauPileProps) {
  const pileId = `tableau-${index}`;

  if (cards.length === 0) {
    return (
      <div className="relative w-[var(--card-width)]" data-pile-id={pileId} style={{ height: 'var(--card-height)' }}>
        <Placeholder
          hint=""
          isValidTarget={isValidTarget}
          onClick={() => onPileClick(pileId)}
        />
      </div>
    );
  }

  const isInSelectedStack = (i: number) =>
    selectedCard?.pileId === pileId && selectedCard.cardIndex <= i;

  const lastIdx = cards.length - 1;

  return (
    <div
      className="relative w-[var(--card-width)]"
      data-pile-id={pileId}
      style={{ height: `calc(${lastIdx} * var(--tableau-offset) + var(--card-height))` }}
    >
      {cards.map((card, i) => (
        <CardComponent
          key={card.id}
          card={card}
          style={{
            top: `calc(${i} * var(--tableau-offset))`,
            left: 0,
            zIndex: i + 1,
          }}
          isSelected={isInSelectedStack(i)}
          isDragging={draggingCards.has(card.id)}
          isValidTarget={i === cards.length - 1 && isValidTarget}
          onPointerDown={(e) => onPointerDown(e, pileId, i)}
          onClick={() => onCardClick(pileId, i)}
        />
      ))}
    </div>
  );
});

