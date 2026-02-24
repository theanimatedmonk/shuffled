import { useRef, useState, useCallback, useEffect } from 'react';
import type { Card, PileId, GameState } from '../types';
import { getValidDropTargets } from '../gameLogic';

interface DragInfo {
  sourcePileId: PileId;
  cardIndex: number;
  cards: Card[];
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
}

const DRAG_THRESHOLD = 5;

export function useDragAndDrop(
  state: GameState,
  moveCards: (from: PileId, to: PileId, cardIndex: number) => void
) {
  const dragRef = useRef<DragInfo | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCards, setDragCards] = useState<Card[]>([]);
  const [draggingCardIds, setDraggingCardIds] = useState<Set<string>>(new Set());
  const [validTargets, setValidTargets] = useState<PileId[]>([]);
  const dragActivated = useRef(false);
  const pendingDrag = useRef<DragInfo | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, pileId: PileId, cardIndex: number) => {
      // Don't prevent default or stop propagation — let clicks work
      const pile = getPileFromState(state, pileId);
      if (!pile || cardIndex < 0 || cardIndex >= pile.length) return;
      if (!pile[cardIndex].faceUp) return;

      const cards = pile.slice(cardIndex);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

      pendingDrag.current = {
        sourcePileId: pileId,
        cardIndex,
        cards,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        startX: e.clientX,
        startY: e.clientY,
      };
      dragActivated.current = false;
    },
    [state]
  );

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      // Check if we have a pending drag that hasn't activated yet
      if (pendingDrag.current && !dragActivated.current) {
        const dx = e.clientX - pendingDrag.current.startX;
        const dy = e.clientY - pendingDrag.current.startY;

        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          // Activate the drag
          dragActivated.current = true;
          dragRef.current = pendingDrag.current;

          const targets = getValidDropTargets(
            state,
            dragRef.current.sourcePileId,
            dragRef.current.cardIndex
          );
          setValidTargets(targets);
          setDragCards(dragRef.current.cards);
          setDraggingCardIds(new Set(dragRef.current.cards.map(c => c.id)));
          setIsDragging(true);
        }
      }

      // Update overlay position during active drag
      if (dragActivated.current && dragRef.current && overlayRef.current) {
        const x = e.clientX - dragRef.current.offsetX;
        const y = e.clientY - dragRef.current.offsetY;
        overlayRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const handleUp = (e: PointerEvent) => {
      if (dragActivated.current && dragRef.current) {
        // Find drop target
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        let targetPileId: PileId | null = null;

        for (const el of elements) {
          const pileAttr = (el as HTMLElement).dataset?.pileId;
          if (pileAttr) {
            targetPileId = pileAttr as PileId;
            break;
          }
        }

        if (targetPileId && validTargets.includes(targetPileId)) {
          moveCards(dragRef.current.sourcePileId, targetPileId, dragRef.current.cardIndex);
        }
      }

      // Reset all drag state
      dragRef.current = null;
      pendingDrag.current = null;
      dragActivated.current = false;
      setIsDragging(false);
      setDragCards([]);
      setDraggingCardIds(new Set());
      setValidTargets([]);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
    };
  }, [state, validTargets, moveCards]);

  return {
    isDragging,
    dragCards,
    draggingCardIds,
    validTargets,
    overlayRef,
    handlePointerDown,
  };
}

function getPileFromState(state: GameState, pileId: PileId): Card[] | null {
  if (pileId === 'stock') return state.stock;
  if (pileId === 'waste') return state.waste;
  if (pileId.startsWith('foundation-')) {
    return state.foundations[parseInt(pileId.split('-')[1])];
  }
  if (pileId.startsWith('tableau-')) {
    return state.tableau[parseInt(pileId.split('-')[1])];
  }
  return null;
}
