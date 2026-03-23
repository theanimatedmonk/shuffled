import React from 'react';

interface GridCellProps {
  letter: string;
  row: number;
  col: number;
  isInDragSelection: boolean;
  isFound: boolean;
  onPointerDown: (row: number, col: number, e: React.PointerEvent) => void;
}

// Color palette for found words
const FOUND_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
  '#00BCD4', '#E91E63', '#8BC34A', '#FF5722', '#3F51B5',
  '#009688', '#FFC107',
];

export function getFoundColor(index: number): string {
  return FOUND_COLORS[index % FOUND_COLORS.length];
}

export const GridCell = React.memo(function GridCell({
  letter,
  row,
  col,
  isInDragSelection,
  isFound,
  onPointerDown,
}: GridCellProps) {
  return (
    <div
      data-row={row}
      data-col={col}
      className="flex items-center justify-center font-bold select-none cursor-pointer rounded-md transition-colors duration-100"
      style={{
        width: 'var(--ws-cell-size)',
        height: 'var(--ws-cell-size)',
        fontSize: 'calc(var(--ws-cell-size) * 0.5)',
        color: isFound ? '#fff' : isInDragSelection ? '#fff' : '#e8e8e8',
        background: isFound
          ? 'var(--ws-found-color, #4CAF50)'
          : isInDragSelection
            ? 'rgba(255, 193, 7, 0.85)'
            : 'rgba(255, 255, 255, 0.08)',
        textShadow: (isFound || isInDragSelection) ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
      }}
      onPointerDown={(e) => onPointerDown(row, col, e)}
    >
      {letter}
    </div>
  );
});
