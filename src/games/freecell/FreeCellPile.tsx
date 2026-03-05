import React from 'react';
import type { Card } from '../../types';
import { CardComponent } from '../../components/Card';
import { Placeholder } from '../../components/Placeholder';

interface FreeCellPileProps {
  index: number;
  card: Card | null;
  isSelected: boolean;
  isValidTarget: boolean;
  onCardClick: (pileId: string, cardIndex: number) => void;
  onPileClick: (pileId: string) => void;
}

export const FreeCellPile = React.memo(function FreeCellPile({
  index,
  card,
  isSelected,
  isValidTarget,
  onCardClick,
  onPileClick,
}: FreeCellPileProps) {
  const pileId = `freecell-${index}`;

  if (!card) {
    return (
      <div className="relative w-[var(--card-width)] h-[var(--card-height)]" data-pile-id={pileId}>
        <Placeholder
          hint="Free"
          isValidTarget={isValidTarget}
          onClick={() => onPileClick(pileId)}
        />
      </div>
    );
  }

  return (
    <div className="relative w-[var(--card-width)] h-[var(--card-height)]" data-pile-id={pileId}>
      <CardComponent
        card={card}
        isStatic
        isSelected={isSelected}
        isValidTarget={isValidTarget}
        onClick={() => onCardClick(pileId, 0)}
      />
    </div>
  );
});
