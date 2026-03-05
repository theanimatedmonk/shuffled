import React from 'react';
import { AD_ENABLED } from '../utils/adConfig';

/**
 * Persistent bottom banner ad placeholder.
 *
 * Fixed to the bottom of the viewport so it stays visible while the
 * user scrolls the tableau.  The Board component adds matching bottom
 * padding so content isn't hidden behind it.
 *
 * Replace the placeholder `<div>` with a real AdMob BannerAd call when
 * integrating `@capacitor-community/admob`.
 */
export const AdBanner = React.memo(function AdBanner() {
  if (!AD_ENABLED) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      style={{
        height: 'var(--ad-banner-height, 50px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        className="flex items-center justify-center border-2 border-dashed border-white/20 rounded-md bg-black/20 text-white/40 select-none"
        style={{
          width: 320,
          height: 50,
          fontSize: 12,
          letterSpacing: '0.05em',
        }}
      >
        AD PLACEHOLDER
      </div>
    </div>
  );
});
