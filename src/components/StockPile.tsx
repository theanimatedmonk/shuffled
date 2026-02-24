import React from 'react';
import type { Card } from '../types';

interface StockPileProps {
  cards: Card[];
  onDraw: () => void;
}

export const StockPile = React.memo(function StockPile({ cards, onDraw }: StockPileProps) {
  if (cards.length === 0) {
    return (
      <div
        className="relative cursor-pointer w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] flex items-center justify-center border-2 border-dashed border-white/30 bg-black/5 text-white/50 transition-[border-color,color] duration-200 hover:border-white/50 hover:text-white/70"
        style={{ fontSize: 'var(--card-center-font-size)' }}
        onClick={onDraw}
        data-pile-id="stock"
      >
        &#x21BB;
      </div>
    );
  }

  return (
    <div
      className="relative cursor-pointer w-[var(--card-width)] h-[var(--card-height)]"
      onClick={onDraw}
      data-pile-id="stock"
    >
      {cards.length > 2 && (
        <div
          className="stock-depth absolute w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_#1565C0,0_1px_3px_rgba(0,0,0,0.12)]"
        />
      )}
      {cards.length > 1 && (
        <div
          className="stock-depth absolute w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_#1565C0,0_1px_3px_rgba(0,0,0,0.12)]"
        />
      )}
      <div className="absolute top-0 left-0">
        <div className="relative w-[var(--card-width)] h-[var(--card-height)] card-3d-container">
          <div className="w-full h-full relative card-3d card-3d--face-down">
            <div
              className="absolute inset-0 flex flex-col justify-between overflow-hidden border border-[#d0d0d0] card-face card-front-bg shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]"
              style={{
                borderRadius: 'var(--card-radius)',
                padding: 'clamp(2px, 0.5vw, 5px)',
              }}
            />
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
      </div>
    </div>
  );
});
