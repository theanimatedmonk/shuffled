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
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | null>(null);
  const dragActivated = useRef(false);
  const pendingDrag = useRef<DragInfo | null>(null);

  const pointerIdRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<HTMLElement | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, pileId: PileId, cardIndex: number) => {
      // Don't prevent default or stop propagation — let clicks work
      const pile = getPileFromState(state, pileId);
      if (!pile || cardIndex < 0 || cardIndex >= pile.length) return;
      if (!pile[cardIndex].faceUp) return;

      const cards = pile.slice(cardIndex);
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();

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

      // Store pointer info — capture is deferred until drag threshold is crossed
      // (capturing immediately breaks click/dblclick event sequence)
      pointerIdRef.current = e.pointerId;
      pointerTargetRef.current = el;
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
          // Prevent browser scroll/pan once drag is confirmed
          e.preventDefault();

          // Now capture the pointer so mobile touch events keep firing during drag
          if (pointerIdRef.current !== null && pointerTargetRef.current) {
            try {
              pointerTargetRef.current.setPointerCapture(pointerIdRef.current);
            } catch {
              // Element may have been removed
            }
          }

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
          setInitialPos({
            x: e.clientX - dragRef.current.offsetX,
            y: e.clientY - dragRef.current.offsetY,
          });
          setIsDragging(true);
        }
      }

      // Update overlay position during active drag
      if (dragActivated.current && dragRef.current && overlayRef.current) {
        e.preventDefault();
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

      // Release pointer capture
      if (pointerIdRef.current !== null && pointerTargetRef.current) {
        try {
          pointerTargetRef.current.releasePointerCapture(pointerIdRef.current);
        } catch {
          // Already released
        }
      }
      pointerIdRef.current = null;
      pointerTargetRef.current = null;

      // Reset all drag state
      dragRef.current = null;
      pendingDrag.current = null;
      dragActivated.current = false;
      setIsDragging(false);
      setDragCards([]);
      setDraggingCardIds(new Set());
      setValidTargets([]);
      setInitialPos(null);
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
    initialPos,
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
