import React, { useEffect, useRef } from 'react';
import { AD_ENABLED } from '../utils/adConfig';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Persistent bottom banner ad.
 *
 * Fixed to the bottom of the viewport so it stays visible while the
 * user scrolls the tableau.  The Board component adds matching bottom
 * padding so content isn't hidden behind it.
 */
export const AdBanner = React.memo(function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (adRef.current && !pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense not loaded or blocked
      }
    }
  }, []);

  if (!AD_ENABLED) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9000]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: '#1b5e20',
      }}
    >
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0252848696122291"
        data-ad-slot="7277828243"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
});
