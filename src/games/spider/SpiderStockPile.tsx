import React from 'react';
import type { Card } from '../../types';

interface SpiderStockPileProps {
  cards: Card[];
  canDeal: boolean;
  onDeal: () => void;
}

export const SpiderStockPile = React.memo(function SpiderStockPile({
  cards,
  canDeal,
  onDeal,
}: SpiderStockPileProps) {
  if (cards.length === 0) {
    return (
      <div
        className="relative w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] border-2 border-dashed border-white/20 bg-black/5"
        data-pile-id="stock"
      />
    );
  }

  const dealsLeft = Math.floor(cards.length / 10);

  return (
    <div
      className={`relative w-[var(--card-width)] h-[var(--card-height)] ${canDeal ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
      onClick={canDeal ? onDeal : undefined}
      data-pile-id="stock"
    >
      {/* Stack effect */}
      {dealsLeft > 2 && (
        <div className="stock-depth absolute w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_var(--card-back-border),0_1px_3px_rgba(0,0,0,0.12)]" />
      )}
      {dealsLeft > 1 && (
        <div className="stock-depth absolute w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_var(--card-back-border),0_1px_3px_rgba(0,0,0,0.12)]" />
      )}
      <div className="absolute top-0 left-0">
        <div className="relative w-[var(--card-width)] h-[var(--card-height)] card-3d-container">
          <div className="w-full h-full relative card-3d card-3d--face-down">
            <div
              className="absolute inset-0 card-face card-front-bg border border-[#d0d0d0] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
              style={{ borderRadius: 'var(--card-radius)' }}
            />
            <div
              className="absolute inset-0 card-face card-face--back shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
              style={{ borderRadius: 'var(--card-radius)' }}
            >
              <div
                className="w-full h-full card-back-pattern border-3 border-white shadow-[inset_0_0_0_2px_var(--card-back-border)]"
                style={{ borderRadius: 'var(--card-radius)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deals left badge */}
      <div
        className="absolute -top-1 -right-1 bg-white/90 text-[#2e7d32] rounded-full font-bold flex items-center justify-center shadow-sm z-10"
        style={{ width: 'clamp(16px, 3.5vw, 22px)', height: 'clamp(16px, 3.5vw, 22px)', fontSize: 'clamp(9px, 2vw, 12px)' }}
      >
        {dealsLeft}
      </div>
    </div>
  );
});
