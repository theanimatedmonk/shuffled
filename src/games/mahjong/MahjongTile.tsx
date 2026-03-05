import React from 'react';
import type { PlacedTile } from './types';
import { getSuitSymbol } from './constants';

interface MahjongTileProps {
  placed: PlacedTile;
  isFree: boolean;
  isSelected: boolean;
  isHinted: boolean;
  onClick: () => void;
}

export const MahjongTileComponent = React.memo(function MahjongTileComponent({
  placed,
  isFree,
  isSelected,
  isHinted,
  onClick,
}: MahjongTileProps) {
  const { tile, position } = placed;
  const layerOffset = 2;

  const style: React.CSSProperties = {
    position: 'absolute',
    width: 'var(--mahjong-tile-width)',
    height: 'var(--mahjong-tile-height)',
    left: `calc(${position.col} * var(--mahjong-tile-width) / 2 - ${position.layer * layerOffset}px)`,
    top: `calc(${position.row} * var(--mahjong-tile-height) / 2 - ${position.layer * layerOffset}px)`,
    zIndex: position.layer * 100 + position.row,
    transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
    transform: isSelected ? 'translateY(-3px)' : undefined,
  };

  const shadowSize = position.layer * 2;

  return (
    <div
      style={style}
      className={`rounded-md cursor-pointer ${!isFree ? 'opacity-70 cursor-default' : ''}`}
      onClick={isFree ? onClick : undefined}
    >
      <div
        className={`w-full h-full rounded-md flex flex-col items-center justify-center relative overflow-hidden select-none ${
          isSelected ? 'ring-2 ring-[#FFC107] ring-offset-1' : ''
        } ${isHinted ? 'ring-2 ring-[#FFC107] animate-pulse' : ''}`}
        style={{
          background: isFree
            ? 'linear-gradient(145deg, #fffff0, #e8e0c8)'
            : 'linear-gradient(145deg, #e8e0c8, #d0c8b0)',
          boxShadow: `${shadowSize + 1}px ${shadowSize + 1}px ${shadowSize + 2}px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)`,
          border: '1px solid #b8a880',
        }}
      >
        {/* Suit indicator (small, top-left) */}
        {tile.suit && (
          <span
            className="absolute leading-none opacity-60"
            style={{
              top: 'clamp(1px, 0.3vw, 3px)',
              left: 'clamp(2px, 0.5vw, 4px)',
              fontSize: 'calc(var(--mahjong-tile-font-size) * 0.35)',
              color: tile.color,
            }}
          >
            {getSuitSymbol(tile)}
          </span>
        )}

        {/* Main symbol */}
        <span
          className="font-bold leading-none"
          style={{
            fontSize: 'var(--mahjong-tile-font-size)',
            color: tile.color,
          }}
        >
          {tile.symbol}
        </span>

        {/* Category label (small, bottom) */}
        <span
          className="leading-none text-center truncate w-full opacity-50"
          style={{
            fontSize: 'calc(var(--mahjong-tile-font-size) * 0.28)',
            color: '#555',
            paddingInline: '1px',
          }}
        >
          {tile.suit ? tile.suit.charAt(0).toUpperCase() : tile.label}
        </span>
      </div>
    </div>
  );
});
