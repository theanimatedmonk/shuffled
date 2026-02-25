import React from 'react';

interface TopBarProps {
  moves: number;
  score: number;
  canAutoComplete: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  onAutoComplete: () => void;
  onOpenSettings: () => void;
}

export const TopBar = React.memo(function TopBar({
  moves,
  score,
  canAutoComplete,
  onNewGame,
  onUndo,
  onAutoComplete,
  onOpenSettings,
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
      <div className="flex items-center" style={{ gap: 'clamp(8px, 2vw, 16px)' }}>
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
        <button
          className="bg-white/12 text-white border border-white/18 rounded-lg cursor-pointer backdrop-blur-[4px] transition-[background,transform] hover:bg-white/22 active:scale-[0.96] flex items-center justify-center"
          style={{ padding: 'clamp(6px, 1.2vw, 8px)' }}
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <svg
            width="clamp(16px, 3.5vw, 20px)"
            height="clamp(16px, 3.5vw, 20px)"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 'clamp(16px, 3.5vw, 20px)', height: 'clamp(16px, 3.5vw, 20px)' }}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
});
