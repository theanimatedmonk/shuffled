import React from 'react';
import type { Card as CardType } from '../types';
import { SUIT_SYMBOLS } from '../constants';

interface CardProps {
  card: CardType;
  style?: React.CSSProperties;
  className?: string;
  isSelected?: boolean;
  isDragging?: boolean;
  isValidTarget?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export const CardComponent = React.memo(function CardComponent({
  card,
  style,
  className = '',
  isSelected = false,
  isDragging = false,
  isValidTarget = false,
  onPointerDown,
  onClick,
  onDoubleClick,
}: CardProps) {
  const symbol = SUIT_SYMBOLS[card.suit];
  const colorClass = card.color === 'red' ? 'card--red' : 'card--black';
  const faceClass = card.faceUp ? 'card--face-up' : 'card--face-down';

  const containerClasses = [
    'card-container',
    className,
    isSelected ? 'card-container--selected' : '',
    isDragging ? 'card-container--dragging' : '',
    isValidTarget ? 'card-container--valid-target' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      style={style}
      onPointerDown={card.faceUp ? onPointerDown : undefined}
      onClick={onClick}
      onDoubleClick={card.faceUp ? onDoubleClick : undefined}
    >
      <div className={`card ${faceClass} ${colorClass}`}>
        <div className="card__front">
          <div className="card__corner card__corner--top">
            <span className="card__rank">{card.rank}</span>
            <span className="card__suit">{symbol}</span>
          </div>
          <div className="card__center">
            <span className="card__center-suit">{symbol}</span>
          </div>
          <div className="card__corner card__corner--bottom">
            <span className="card__rank">{card.rank}</span>
            <span className="card__suit">{symbol}</span>
          </div>
        </div>
        <div className="card__back">
          <div className="card__back-inner" />
        </div>
      </div>
    </div>
  );
});
