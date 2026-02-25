import React from 'react';

interface TopBarProps {
  moves: number;
  score: number;
  canAutoComplete: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  onAutoComplete: () => void;
}

export const TopBar = React.memo(function TopBar({
  moves,
  score,
  canAutoComplete,
  onNewGame,
  onUndo,
  onAutoComplete,
}: TopBarProps) {
  return (
    <div
      className="topbar-layout flex justify-between items-center text-white/85 mx-auto w-full flex-wrap"
      style={{
        padding: 'clamp(8px, 1.5vw, 12px) var(--board-padding)',
        gap: 'clamp(4px, 1vw, 12px)',
      }}
    >
      <div className="flex items-center" style={{ gap: 'clamp(4px, 1vw, 8px)' }}>
        <button
          className="bg-white/12 text-white border border-white/18 rounded-lg cursor-pointer font-medium backdrop-blur-[4px] whitespace-nowrap transition-[background,transform] hover:bg-white/22 active:scale-[0.96]"
          style={{
            padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 16px)',
            fontSize: 'clamp(12px, 2.8vw, 14px)',
          }}
          onClick={onNewGame}
        >
          New Game
        </button>
        <button
          className="bg-white/12 text-white border border-white/18 rounded-lg cursor-pointer font-medium backdrop-blur-[4px] whitespace-nowrap transition-[background,transform] hover:bg-white/22 active:scale-[0.96]"
          style={{
            padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 16px)',
            fontSize: 'clamp(12px, 2.8vw, 14px)',
          }}
          onClick={onUndo}
        >
          Undo
        </button>
        {canAutoComplete && (
          <button
            className="bg-[rgba(255,193,7,0.25)] text-white border border-[rgba(255,193,7,0.4)] rounded-lg cursor-pointer font-medium backdrop-blur-[4px] whitespace-nowrap transition-[background,transform] hover:bg-[rgba(255,193,7,0.35)] active:scale-[0.96]"
            style={{
              padding: 'clamp(6px, 1.2vw, 8px) clamp(10px, 2vw, 16px)',
              fontSize: 'clamp(11px, 2.5vw, 14px)',
            }}
            onClick={onAutoComplete}
          >
            Auto Complete
          </button>
        )}
      </div>
      <div
        className="flex font-medium tracking-wide"
        style={{
          gap: 'clamp(8px, 2vw, 16px)',
          fontSize: 'clamp(12px, 2.8vw, 14px)',
          letterSpacing: '0.3px',
        }}
      >
        <span>
          <span className="opacity-60 mr-1">Moves</span>
          {moves}
        </span>
        <span>
          <span className="opacity-60 mr-1">Score</span>
          {score}
        </span>
      </div>
    </div>
  );
});
