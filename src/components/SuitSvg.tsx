import React from 'react';
import type { Suit } from '../types';

interface SuitSvgProps {
  suit: Suit;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

const SUIT_PATHS: Record<Suit, React.ReactNode> = {
  hearts: (
    <path d="M50 90 C50 90 8 55 8 30 C8 12 22 2 36 2 C44 2 50 10 50 18 C50 10 56 2 64 2 C78 2 92 12 92 30 C92 55 50 90 50 90Z" />
  ),
  diamonds: (
    <path d="M50 4 L88 50 L50 96 L12 50Z" />
  ),
  clubs: (
    <>
      <circle cx="50" cy="28" r="21" />
      <circle cx="30" cy="50" r="21" />
      <circle cx="70" cy="50" r="21" />
      <path d="M43 55 L43 92 Q50 82 57 92 L57 55 Z" />
    </>
  ),
  spades: (
    <>
      <path d="M50 4 C50 4 8 42 8 62 C8 78 22 86 36 82 C44 80 50 72 50 65 C50 72 56 80 64 82 C78 86 92 78 92 62 C92 42 50 4 50 4Z" />
      <path d="M43 72 L43 96 Q50 84 57 96 L57 72 Z" />
    </>
  ),
};

export const SuitSvg = React.memo(function SuitSvg({ suit, color, className, style }: SuitSvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill={color}
      className={className}
      style={style}
    >
      {SUIT_PATHS[suit]}
    </svg>
  );
});
