import React, { useCallback, useEffect } from 'react';
import type { PileId } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import {
  canAutoComplete,
  getAutoCompleteMove,
  findAutoMoveToFoundation,
} from '../gameLogic';
import { SUIT_SYMBOLS } from '../constants';
import { TopBar } from './TopBar';
import { StockPile } from './StockPile';
import { WastePile } from './WastePile';
import { FoundationPile } from './FoundationPile';
import { TableauPile } from './TableauPile';
import { WinOverlay } from './WinOverlay';

export function Board() {
  const { state, newGame, drawStock, moveCards, undo, selectCard } =
    useGameState();
  const {
    isDragging,
    dragCards,
    draggingCardIds,
    validTargets,
    overlayRef,
    handlePointerDown,
  } = useDragAndDrop(state, moveCards);

  const showAutoComplete = canAutoComplete(state) && !state.hasWon;

  const handleCardClick = useCallback(
    (pileId: PileId, cardIndex: number) => {
      selectCard(pileId, cardIndex);
    },
    [selectCard]
  );

  const handleDoubleClick = useCallback(
    (pileId: PileId, cardIndex: number) => {
      const target = findAutoMoveToFoundation(state, pileId, cardIndex);
      if (target) {
        moveCards(pileId, target, cardIndex);
      }
    },
    [state, moveCards]
  );

  const handlePileClick = useCallback(
    (pileId: PileId) => {
      if (state.selectedCard) {
        // Try to move selected card to this pile
        selectCard(pileId, 0);
      }
    },
    [state.selectedCard, selectCard]
  );

  // Auto-complete via repeated effect
  const [autoCompleting, setAutoCompleting] = React.useState(false);

  const startAutoComplete = useCallback(() => {
    setAutoCompleting(true);
  }, []);

  useEffect(() => {
    if (!autoCompleting) return;

    const move = getAutoCompleteMove(state);
    if (!move || state.hasWon) {
      setAutoCompleting(false);
      return;
    }

    const timeout = setTimeout(() => {
      moveCards(move.from, move.to, move.cardIndex);
    }, 120);

    return () => clearTimeout(timeout);
  }, [autoCompleting, state, moveCards]);

  const validTargetSet = new Set(validTargets);

  return (
    <div className="board-wrapper">
      <TopBar
        moves={state.moves}
        score={state.score}
        canAutoComplete={showAutoComplete}
        onNewGame={newGame}
        onUndo={undo}
        onAutoComplete={startAutoComplete}
      />
      <div className="board">
        {/* Top row */}
        <StockPile cards={state.stock} onDraw={drawStock} />
        <WastePile
          cards={state.waste}
          selectedCardIndex={
            state.selectedCard?.pileId === 'waste'
              ? state.selectedCard.cardIndex
              : null
          }
          isValidTarget={validTargetSet.has('waste')}
          onPointerDown={handlePointerDown}
          onCardClick={handleCardClick}
          onDoubleClick={handleDoubleClick}
        />
        <div className="board__spacer" />
        {state.foundations.map((pile, i) => (
          <FoundationPile
            key={i}
            index={i}
            cards={pile}
            isValidTarget={validTargetSet.has(`foundation-${i}` as PileId)}
            onCardClick={handleCardClick}
            onPileClick={handlePileClick}
          />
        ))}

        {/* Tableau row */}
        {state.tableau.map((pile, i) => (
          <TableauPile
            key={i}
            index={i}
            cards={pile}
            selectedCard={state.selectedCard}
            isValidTarget={validTargetSet.has(`tableau-${i}` as PileId)}
            draggingCards={draggingCardIds}
            onPointerDown={handlePointerDown}
            onCardClick={handleCardClick}
            onDoubleClick={handleDoubleClick}
            onPileClick={handlePileClick}
          />
        ))}
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div className="drag-overlay" ref={overlayRef}>
          {dragCards.map((card, i) => (
            <div
              key={card.id}
              className="drag-overlay-card"
              style={{ top: i * 22, left: 0 }}
            >
              <div className={`card card--face-up card--${card.color === 'red' ? 'red' : 'black'}`}>
                <div className="card__front">
                  <div className="card__corner card__corner--top">
                    <span className="card__rank">{card.rank}</span>
                    <span className="card__suit">{SUIT_SYMBOLS[card.suit]}</span>
                  </div>
                  <div className="card__center">
                    <span className="card__center-suit">{SUIT_SYMBOLS[card.suit]}</span>
                  </div>
                  <div className="card__corner card__corner--bottom">
                    <span className="card__rank">{card.rank}</span>
                    <span className="card__suit">{SUIT_SYMBOLS[card.suit]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {state.hasWon && (
        <WinOverlay moves={state.moves} score={state.score} onNewGame={newGame} />
      )}
    </div>
  );
}
