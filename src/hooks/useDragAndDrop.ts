import { useRef, useState, useCallback, useEffect } from 'react';
import type { Card } from '../types';

interface DragInfo {
  sourcePileId: string;
  cardIndex: number;
  cards: Card[];
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
}

const DRAG_THRESHOLD = 5;

/**
 * Generic drag-and-drop hook for card games.
 *
 * Each game passes its own `getValidDropTargets` and `getPile` functions
 * so the hook works with any game's state shape and pile ID system.
 */
export function useDragAndDrop(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  moveCards: (from: string, to: string, cardIndex: number) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValidDropTargets: (state: any, from: string, cardIndex: number) => string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPile: (state: any, pileId: string) => Card[] | null
) {
  const dragRef = useRef<DragInfo | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCards, setDragCards] = useState<Card[]>([]);
  const [draggingCardIds, setDraggingCardIds] = useState<Set<string>>(new Set());
  const [validTargets, setValidTargets] = useState<string[]>([]);
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | null>(null);
  const dragActivated = useRef(false);
  const pendingDrag = useRef<DragInfo | null>(null);

  const pointerIdRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<HTMLElement | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, pileId: string, cardIndex: number) => {
      // Don't prevent default or stop propagation — let clicks work
      const pile = getPile(state, pileId);
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
    [state, getPile]
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
        let targetPileId: string | null = null;

        for (const el of elements) {
          const pileAttr = (el as HTMLElement).dataset?.pileId;
          if (pileAttr) {
            targetPileId = pileAttr;
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
  }, [state, validTargets, moveCards, getValidDropTargets, getPile]);

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
