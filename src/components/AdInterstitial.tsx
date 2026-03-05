import { useCallback, useRef } from 'react';
import { AD_ENABLED } from '../utils/adConfig';

const GAMES_BETWEEN_ADS = 3;

/**
 * Interstitial ad hook — shows an ad every Nth new game.
 *
 * Call `onNewGame()` instead of calling `newGame()` directly.
 * It increments the counter; on every 3rd game it fires the interstitial
 * *before* starting the new game.
 *
 * To integrate real ads:
 *   1. `npm install @capacitor-community/admob`
 *   2. Replace the placeholder log with:
 *      ```
 *      await AdMob.prepareInterstitial({ adId: AD_UNIT_IDS.interstitial });
 *      await AdMob.showInterstitial();
 *      ```
 */
export function useInterstitialAd() {
  const gameCount = useRef(0);

  const maybeShowInterstitial = useCallback(async () => {
    if (!AD_ENABLED) return;

    gameCount.current += 1;

    if (gameCount.current % GAMES_BETWEEN_ADS === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `[Ad] Interstitial triggered (game #${gameCount.current}) — replace with AdMob call`,
      );
      // TODO: replace with real AdMob interstitial
      // await AdMob.prepareInterstitial({ adId: AD_UNIT_IDS.interstitial });
      // await AdMob.showInterstitial();
    }
  }, []);

  return { maybeShowInterstitial };
}
