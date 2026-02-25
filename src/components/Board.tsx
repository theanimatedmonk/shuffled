import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { PileId } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useSettings } from '../contexts/SettingsContext';
import { useSound } from '../hooks/useSound';
import {
  canAutoComplete,
  getAutoCompleteMove,
  findAutoMoveToFoundation,
  findSafeAutoMoves,
} from '../gameLogic';
import { SUIT_SYMBOLS } from '../constants';
import { TopBar } from './TopBar';
import { StockPile } from './StockPile';
import { WastePile } from './WastePile';
import { FoundationPile } from './FoundationPile';
import { TableauPile } from './TableauPile';
import { WinOverlay } from './WinOverlay';
import { SettingsModal } from './SettingsModal';

const DOUBLE_TAP_MS = 400;

export function Board() {
  const { state, newGame, drawStock, moveCards, undo, selectCard } =
    useGameState();
  const { settings } = useSettings();
  const { play } = useSound();

  // Wrap moveCards to play sound on drag-drop
  const moveCardsWithSound = useCallback(
    (from: PileId, to: PileId, cardIndex: number) => {
      moveCards(from, to, cardIndex);
      play('cardPlace');
    },
    [moveCards, play]
  );

  const {
    isDragging,
    dragCards,
    draggingCardIds,
    validTargets,
    overlayRef,
    initialPos,
    handlePointerDown,
  } = useDragAndDrop(state, moveCardsWithSound);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const showAutoComplete = canAutoComplete(state) && !state.hasWon;

  // Custom double-tap detector — browser dblclick is unreliable with touch-none
  const lastTap = useRef<{ pileId: PileId; cardIndex: number; time: number } | null>(null);

  const handleCardClick = useCallback(
    (pileId: PileId, cardIndex: number) => {
      const now = Date.now();
      const prev = lastTap.current;

      if (prev && prev.pileId === pileId && prev.cardIndex === cardIndex && now - prev.time < DOUBLE_TAP_MS) {
        // Double-tap detected — try auto-move to foundation
        lastTap.current = null;
        const target = findAutoMoveToFoundation(state, pileId, cardIndex);
        if (target) {
          moveCards(pileId, target, cardIndex);
          play('cardPlace');
          return;
        }
      }

      lastTap.current = { pileId, cardIndex, time: now };
      selectCard(pileId, cardIndex);
    },
    [selectCard, state, moveCards, play]
  );

  const handlePileClick = useCallback(
    (pileId: PileId) => {
      if (state.selectedCard) {
        selectCard(pileId, 0);
      }
    },
    [state.selectedCard, selectCard]
  );

  const handleDrawStock = useCallback(() => {
    drawStock(settings.drawMode);
    play('stockClick');
  }, [drawStock, settings.drawMode, play]);

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
      play('cardPlace');
    }, 120);

    return () => clearTimeout(timeout);
  }, [autoCompleting, state, moveCards, play]);

  // Auto-move safe cards to foundation
  useEffect(() => {
    if (!settings.autoMoveToFoundation) return;
    if (state.hasWon || autoCompleting) return;

    const safeMoves = findSafeAutoMoves(state);
    if (safeMoves.length === 0) return;

    const timeout = setTimeout(() => {
      const move = safeMoves[0];
      moveCards(move.from, move.to, move.cardIndex);
      play('cardPlace');
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, settings.autoMoveToFoundation, autoCompleting, moveCards, play]);

  // Win celebration sound
  const prevWon = useRef(false);
  useEffect(() => {
    if (state.hasWon && !prevWon.current) {
      play('winCelebration');
    }
    prevWon.current = state.hasWon;
  }, [state.hasWon, play]);

  const validTargetSet = new Set(validTargets);

  return (
    <div className="flex-1 flex flex-col w-full overflow-y-auto">
      <TopBar
        moves={state.moves}
        score={state.score}
        canAutoComplete={showAutoComplete}
        onNewGame={newGame}
        onUndo={undo}
        onAutoComplete={startAutoComplete}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="board-grid mx-auto w-full justify-center">
        {/* Top row */}
        <StockPile cards={state.stock} onDraw={handleDrawStock} />
        <WastePile
          cards={state.waste}
          drawMode={settings.drawMode}
          selectedCardIndex={
            state.selectedCard?.pileId === 'waste'
              ? state.selectedCard.cardIndex
              : null
          }
          isValidTarget={validTargetSet.has('waste')}
          onPointerDown={handlePointerDown}
          onCardClick={handleCardClick}
        />
        <div style={{ width: 'var(--card-width)' }} />
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
            onPileClick={handlePileClick}
          />
        ))}
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[10000]"
          ref={overlayRef}
          style={initialPos ? { transform: `translate(${initialPos.x}px, ${initialPos.y}px)` } : undefined}
        >
          {dragCards.map((card, i) => {
            const textColor = card.color === 'red' ? 'text-[#d32f2f]' : 'text-[#212121]';
            return (
              <div
                key={card.id}
                className="absolute w-[var(--card-width)] h-[var(--card-height)] card-3d-container pointer-events-none"
                style={{ top: i * 22, left: 0 }}
              >
                <div className="w-full h-full relative card-3d card-3d--face-up cursor-grabbing">
                  <div
                    className="absolute inset-0 flex flex-col justify-between overflow-hidden border border-[#d0d0d0] card-face card-front-bg shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)]"
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
                        {SUIT_SYMBOLS[card.suit]}
                      </span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span
                        className={`leading-none opacity-85 ${textColor}`}
                        style={{ fontSize: 'var(--card-center-font-size)' }}
                      >
                        {SUIT_SYMBOLS[card.suit]}
                      </span>
                    </div>
                    <div className={`flex flex-col items-center leading-none self-end rotate-180 ${textColor}`}>
                      <span className="font-bold leading-[1.1]" style={{ fontSize: 'var(--card-font-size)' }}>
                        {card.rank}
                      </span>
                      <span className="leading-none" style={{ fontSize: 'calc(var(--card-font-size) * 0.8)' }}>
                        {SUIT_SYMBOLS[card.suit]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.hasWon && (
        <WinOverlay moves={state.moves} score={state.score} onNewGame={newGame} />
      )}

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onNewGame={() => { newGame(); setSettingsOpen(false); }}
        />
      )}
    </div>
  );
}
