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
    <div className="topbar">
      <div className="topbar__left">
        <button className="topbar__btn" onClick={onNewGame}>New Game</button>
        <button className="topbar__btn" onClick={onUndo}>Undo</button>
        {canAutoComplete && (
          <button className="topbar__btn topbar__btn--auto" onClick={onAutoComplete}>
            Auto Complete
          </button>
        )}
      </div>
      <div className="topbar__stats">
        <span>
          <span className="topbar__stat-label">Moves</span>
          {moves}
        </span>
        <span>
          <span className="topbar__stat-label">Score</span>
          {score}
        </span>
      </div>
    </div>
  );
});
