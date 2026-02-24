import React from 'react';
import type { Card as CardType } from '../types';
import { SUIT_SYMBOLS } from '../constants';

interface CardProps {
  card: CardType;
  style?: React.CSSProperties;
  isStatic?: boolean;
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
  isStatic = false,
  isSelected = false,
  isDragging = false,
  isValidTarget = false,
  onPointerDown,
  onClick,
  onDoubleClick,
}: CardProps) {
  const symbol = SUIT_SYMBOLS[card.suit];
  const textColor = card.color === 'red' ? 'text-[#d32f2f]' : 'text-[#212121]';

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
      onDoubleClick={card.faceUp ? onDoubleClick : undefined}
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
          <div className={`flex flex-col items-center leading-none self-start ${textColor}`}>
            <span className="font-bold leading-[1.1]" style={{ fontSize: 'var(--card-font-size)' }}>
              {card.rank}
            </span>
            <span className="leading-none" style={{ fontSize: 'calc(var(--card-font-size) * 0.8)' }}>
              {symbol}
            </span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              className={`leading-none opacity-85 ${textColor}`}
              style={{ fontSize: 'var(--card-center-font-size)' }}
            >
              {symbol}
            </span>
          </div>
          <div className={`flex flex-col items-center leading-none self-end rotate-180 ${textColor}`}>
            <span className="font-bold leading-[1.1]" style={{ fontSize: 'var(--card-font-size)' }}>
              {card.rank}
            </span>
            <span className="leading-none" style={{ fontSize: 'calc(var(--card-font-size) * 0.8)' }}>
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
            className="w-full h-full card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_#1565C0]"
            style={{ borderRadius: 'var(--card-radius)' }}
          />
        </div>
      </div>
    </div>
  );
});
