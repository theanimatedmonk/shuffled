import React from 'react';
import type { Card } from '../../types';
import type { SelectedCard } from './types';
import { CardComponent } from '../../components/Card';
import { Placeholder } from '../../components/Placeholder';

interface SpiderTableauPileProps {
  index: number;
  cards: Card[];
  selectedCard: SelectedCard | null;
  isValidTarget: boolean;
  draggingCards: Set<string>;
  onPointerDown: (e: React.PointerEvent, pileId: string, cardIndex: number) => void;
  onCardClick: (pileId: string, cardIndex: number) => void;
  onPileClick: (pileId: string) => void;
}

export const SpiderTableauPile = React.memo(function SpiderTableauPile({
  index,
  cards,
  selectedCard,
  isValidTarget,
  draggingCards,
  onPointerDown,
  onCardClick,
  onPileClick,
}: SpiderTableauPileProps) {
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

  const isInSelectedStack = (i: number) =>
    selectedCard?.pileId === pileId && selectedCard.cardIndex <= i;

  return (
    <div
      className="relative w-[var(--card-width)]"
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
          onPointerDown={card.faceUp ? (e) => onPointerDown(e, pileId, i) : undefined}
          onClick={card.faceUp ? () => onCardClick(pileId, i) : undefined}
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
