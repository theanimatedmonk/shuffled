import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface WinOverlayProps {
  moves: number;
  score: number;
  onNewGame: () => void;
}

export function WinOverlay({ moves, score, onNewGame }: WinOverlayProps) {
  useEffect(() => {
    // Initial bursts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.2, y: 0.5 },
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.8, y: 0.5 },
    });

    // Continuous shower
    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 120,
        origin: { y: 0 },
        startVelocity: 30,
        gravity: 1.2,
      });
    }, 250);

    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="win-overlay">
      <div className="win-overlay__card">
        <div className="win-overlay__title">You Win!</div>
        <div className="win-overlay__stats">
          <div>
            <span>Moves</span>
            <span className="win-overlay__stat-value">{moves}</span>
          </div>
          <div>
            <span>Score</span>
            <span className="win-overlay__stat-value">{score}</span>
          </div>
        </div>
        <button className="win-overlay__btn" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
}
