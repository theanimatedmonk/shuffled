import React from 'react';
import type { Card, PileId } from '../types';
import { SUIT_SYMBOLS, FOUNDATION_SUITS } from '../constants';
import { CardComponent } from './Card';
import { Placeholder } from './Placeholder';

interface FoundationPileProps {
  index: number;
  cards: Card[];
  isValidTarget: boolean;
  onCardClick: (pileId: PileId, cardIndex: number) => void;
  onPileClick: (pileId: PileId) => void;
}

export const FoundationPile = React.memo(function FoundationPile({
  index,
  cards,
  isValidTarget,
  onCardClick,
  onPileClick,
}: FoundationPileProps) {
  const pileId: PileId = `foundation-${index as 0 | 1 | 2 | 3}`;
  const suitHint = SUIT_SYMBOLS[FOUNDATION_SUITS[index]];

  if (cards.length === 0) {
    return (
      <div className="pile" data-pile-id={pileId}>
        <Placeholder
          hint={suitHint}
          isValidTarget={isValidTarget}
          onClick={() => onPileClick(pileId)}
        />
      </div>
    );
  }

  const topIndex = cards.length - 1;
  const topCard = cards[topIndex];

  return (
    <div className="pile" data-pile-id={pileId}>
      <CardComponent
        card={topCard}
        className="card-container--static"
        isValidTarget={isValidTarget}
        onClick={() => onCardClick(pileId, topIndex)}
      />
    </div>
  );
});
