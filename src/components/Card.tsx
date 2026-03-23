import React from 'react';
import type { Card as CardType } from '../types';
import { SUIT_SYMBOLS } from '../constants';
import { FaceCardArt } from './FaceCardArt';

interface CardProps {
  card: CardType;
  style?: React.CSSProperties;
  isStatic?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  isValidTarget?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export const CardComponent = React.memo(function CardComponent({
  card,
  style,
  isStatic = false,
  isSelected = false,
  isDragging = false,
  isValidTarget = false,
  onPointerDown,
  onClick,
}: CardProps) {
  const symbol = SUIT_SYMBOLS[card.suit];
  const textColor = card.color === 'red' ? 'text-[#d32f2f]' : 'text-[#212121]';
  const isFaceCard = ['J', 'Q', 'K'].includes(card.rank);

  const containerClasses = [
    'w-[var(--card-width)] h-[var(--card-height)] card-3d-container z-[1]',
    isStatic ? 'relative' : 'absolute',
    isSelected ? '-translate-y-2 transition-transform duration-150 ease-out !z-50' : '',
    isDragging ? 'opacity-0 pointer-events-none' : '',
    card.faceUp ? 'touch-none' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      style={style}
      onPointerDown={card.faceUp ? onPointerDown : undefined}
      onClick={onClick}
    >
      <div
        className={`w-full h-full relative card-3d ${
          card.faceUp ? 'card-3d--face-up cursor-grab active:cursor-grabbing' : 'card-3d--face-down cursor-default'
        }`}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 flex flex-col justify-between overflow-hidden border border-[#d0d0d0] card-face card-front-bg card-hover shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] ${
            isSelected ? 'outline-3 outline-[#FFC107] -outline-offset-1' : ''
          } ${
            isValidTarget ? 'shadow-[0_0_0_2px_#FFC107,0_0_12px_rgba(255,193,7,0.4)]' : ''
          }`}
          style={{
            borderRadius: 'var(--card-radius)',
            padding: 'clamp(2px, 0.5vw, 5px)',
          }}
        >
          {/* Top row: rank left, suit pip right */}
          <div className={`flex items-start justify-between ${textColor}`}>
            <span className="font-bold leading-[1.1]" style={{ fontSize: 'calc(var(--card-font-size) * 1.4)' }}>
              {card.rank}
            </span>
            <span className="leading-none" style={{ fontSize: 'calc(var(--card-font-size) * 0.85)' }}>
              {symbol}
            </span>
          </div>

          {/* Center content */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              className={`leading-none ${textColor}`}
              style={{ fontSize: 'calc(var(--card-center-font-size) * 1.4)' }}
            >
              {symbol}
            </span>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 overflow-hidden card-face card-face--back shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]"
          style={{ borderRadius: 'var(--card-radius)' }}
        >
          <div
            className="w-full h-full card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_var(--card-back-border)]"
            style={{ borderRadius: 'var(--card-radius)' }}
          />
        </div>
      </div>
    </div>
  );
});
