import React from 'react';
import type { Rank, Color } from '../types';

interface FaceCardArtProps {
  rank: Rank;
  cardColor: Color;
}

const COLORS = {
  red: { primary: '#d32f2f', secondary: '#b71c1c', robe: '#d32f2f', robeLight: '#ef5350' },
  black: { primary: '#212121', secondary: '#000000', robe: '#1a237e', robeLight: '#3949ab' },
};

const SKIN = '#f5d0a9';
const SKIN_SHADOW = '#e8b88a';
const GOLD = '#ffc107';
const GOLD_DARK = '#ff8f00';

function KingSvg({ c }: { c: typeof COLORS.red }) {
  return (
    <svg viewBox="0 0 60 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Robe / body */}
      <rect x="10" y="45" width="40" height="45" rx="3" fill={c.robe} />
      <rect x="15" y="45" width="30" height="45" rx="2" fill={c.robeLight} opacity="0.4" />
      {/* Gold trim */}
      <rect x="10" y="44" width="40" height="5" rx="1" fill={GOLD} />
      {/* Collar */}
      <polygon points="22,44 30,38 38,44" fill={GOLD_DARK} />
      {/* Face */}
      <ellipse cx="30" cy="28" rx="12" ry="14" fill={SKIN} />
      <ellipse cx="30" cy="30" rx="11" ry="10" fill={SKIN_SHADOW} opacity="0.3" />
      {/* Eyes */}
      <ellipse cx="25" cy="26" rx="1.5" ry="2" fill={c.primary} />
      <ellipse cx="35" cy="26" rx="1.5" ry="2" fill={c.primary} />
      {/* Beard */}
      <path d="M20,32 Q22,42 30,44 Q38,42 40,32 Q38,38 30,40 Q22,38 20,32Z" fill={c.secondary} opacity="0.6" />
      {/* Mouth */}
      <path d="M26,33 Q30,36 34,33" stroke={c.primary} strokeWidth="0.8" fill="none" />
      {/* Crown */}
      <polygon points="18,18 20,10 24,16 27,6 30,14 33,6 36,16 40,10 42,18" fill={GOLD} />
      <polygon points="18,18 20,10 24,16 27,6 30,14 33,6 36,16 40,10 42,18" fill={GOLD_DARK} opacity="0.3" />
      <rect x="18" y="17" width="24" height="3" rx="1" fill={GOLD} />
      {/* Crown jewels */}
      <circle cx="24" cy="18" r="1.2" fill={c.primary} />
      <circle cx="30" cy="18" r="1.2" fill={c.primary} />
      <circle cx="36" cy="18" r="1.2" fill={c.primary} />
      {/* Scepter (right side) */}
      <line x1="45" y1="30" x2="45" y2="80" stroke={GOLD_DARK} strokeWidth="2" />
      <circle cx="45" cy="28" r="4" fill={GOLD} />
      <circle cx="45" cy="28" r="2" fill={c.primary} />
    </svg>
  );
}

function QueenSvg({ c }: { c: typeof COLORS.red }) {
  return (
    <svg viewBox="0 0 60 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Dress / body */}
      <path d="M10,48 L15,90 L45,90 L50,48 Q40,55 30,52 Q20,55 10,48Z" fill={c.robe} />
      <path d="M15,50 L18,90 L42,90 L45,50 Q38,56 30,53 Q22,56 15,50Z" fill={c.robeLight} opacity="0.3" />
      {/* Gold necklace */}
      <path d="M22,44 Q26,48 30,48 Q34,48 38,44" stroke={GOLD} strokeWidth="2" fill="none" />
      <circle cx="30" cy="49" r="2" fill={GOLD} />
      {/* Face */}
      <ellipse cx="30" cy="28" rx="11" ry="13" fill={SKIN} />
      <ellipse cx="30" cy="30" rx="10" ry="9" fill={SKIN_SHADOW} opacity="0.2" />
      {/* Hair */}
      <path d="M19,28 Q17,14 22,12 Q24,22 30,10 Q36,22 38,12 Q43,14 41,28" fill={c.secondary} opacity="0.7" />
      {/* Eyes */}
      <ellipse cx="25" cy="27" rx="1.5" ry="2" fill={c.primary} />
      <ellipse cx="35" cy="27" rx="1.5" ry="2" fill={c.primary} />
      {/* Eyelashes */}
      <path d="M23,25 L22,23" stroke={c.primary} strokeWidth="0.5" />
      <path d="M37,25 L38,23" stroke={c.primary} strokeWidth="0.5" />
      {/* Lips */}
      <path d="M27,34 Q30,37 33,34" stroke="#e57373" strokeWidth="1.2" fill="#e57373" opacity="0.7" />
      {/* Crown */}
      <path d="M19,16 L21,8 L25,14 L30,4 L35,14 L39,8 L41,16Z" fill={GOLD} />
      <rect x="19" y="15" width="22" height="3" rx="1" fill={GOLD} />
      <circle cx="25" cy="16" r="1" fill={c.primary} />
      <circle cx="30" cy="16" r="1.3" fill="#e57373" />
      <circle cx="35" cy="16" r="1" fill={c.primary} />
      {/* Flower (left side) */}
      <line x1="14" y1="50" x2="14" y2="80" stroke="#388e3c" strokeWidth="1.5" />
      <circle cx="14" cy="47" r="4" fill={c.primary} opacity="0.6" />
      <circle cx="14" cy="47" r="2" fill={GOLD} />
    </svg>
  );
}

function JackSvg({ c }: { c: typeof COLORS.red }) {
  return (
    <svg viewBox="0 0 60 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Tunic / body */}
      <rect x="12" y="46" width="36" height="44" rx="3" fill={c.robe} />
      <rect x="17" y="46" width="26" height="44" rx="2" fill={c.robeLight} opacity="0.35" />
      {/* Belt */}
      <rect x="12" y="56" width="36" height="4" rx="1" fill={GOLD_DARK} />
      <rect x="26" y="55" width="8" height="6" rx="1.5" fill={GOLD} />
      {/* Collar */}
      <polygon points="20,46 30,40 40,46" fill={GOLD} opacity="0.8" />
      {/* Face */}
      <ellipse cx="30" cy="28" rx="11" ry="13" fill={SKIN} />
      <ellipse cx="30" cy="30" rx="10" ry="9" fill={SKIN_SHADOW} opacity="0.2" />
      {/* Hair */}
      <path d="M19,24 Q18,14 24,13 L24,20 Q26,12 30,11 Q34,12 36,20 L36,13 Q42,14 41,24" fill={c.secondary} opacity="0.7" />
      {/* Eyes */}
      <ellipse cx="25" cy="27" rx="1.5" ry="2" fill={c.primary} />
      <ellipse cx="35" cy="27" rx="1.5" ry="2" fill={c.primary} />
      {/* Mouth */}
      <path d="M27,34 Q30,36 33,34" stroke={c.primary} strokeWidth="0.8" fill="none" />
      {/* Hat / beret */}
      <ellipse cx="30" cy="16" rx="14" ry="6" fill={c.robe} />
      <ellipse cx="30" cy="15" rx="12" ry="5" fill={c.robeLight} opacity="0.4" />
      <circle cx="30" cy="10" r="2.5" fill={GOLD} />
      {/* Feather on hat */}
      <path d="M32,10 Q40,2 44,6 Q38,6 34,10" fill={c.primary} opacity="0.5" />
      {/* Weapon/staff (right side) */}
      <line x1="46" y1="35" x2="46" y2="85" stroke={GOLD_DARK} strokeWidth="2" />
      <polygon points="43,35 46,25 49,35" fill={c.primary} opacity="0.7" />
    </svg>
  );
}

export const FaceCardArt = React.memo(function FaceCardArt({ rank, cardColor }: FaceCardArtProps) {
  const c = COLORS[cardColor];

  // Render the top half — the bottom is a CSS mirror
  const SvgComponent = rank === 'K' ? KingSvg : rank === 'Q' ? QueenSvg : JackSvg;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ top: '16%', bottom: '16%', left: '15%', right: '15%' }}>
      {/* Top half */}
      <div className="flex-1 overflow-hidden">
        <SvgComponent c={c} />
      </div>
      {/* Divider */}
      <div className="h-px w-full" style={{ backgroundColor: c.primary, opacity: 0.15 }} />
      {/* Bottom half (mirrored) */}
      <div className="flex-1 overflow-hidden" style={{ transform: 'rotate(180deg)' }}>
        <SvgComponent c={c} />
      </div>
    </div>
  );
});
