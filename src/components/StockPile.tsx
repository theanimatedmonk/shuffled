import React from 'react';
import type { Card } from '../types';

interface StockPileProps {
  cards: Card[];
  onDraw: () => void;
}

export const StockPile = React.memo(function StockPile({ cards, onDraw }: StockPileProps) {
  if (cards.length === 0) {
    return (
      <div className="stock-pile stock-pile--empty" onClick={onDraw} data-pile-id="stock">
        &#x21BB;
      </div>
    );
  }

  return (
    <div className="stock-pile" onClick={onDraw} data-pile-id="stock">
      {cards.length > 2 && <div className="stock-pile__depth" />}
      {cards.length > 1 && <div className="stock-pile__depth" />}
      <div className="stock-pile__top">
        <div className="card-container card-container--static">
          <div className="card card--face-down">
            <div className="card__front" />
            <div className="card__back">
              <div className="card__back-inner" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
