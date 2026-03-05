/**
 * Ad configuration — central place for all ad-related constants.
 *
 * Currently uses placeholder/test IDs.  When you're ready to go live:
 *   1. Replace the IDs below with your real AdMob unit IDs.
 *   2. Install @capacitor-community/admob and call its APIs from AdBanner /
 *      AdInterstitial instead of rendering placeholder DOM.
 */

// AdMob ad unit IDs
export const AD_UNIT_IDS = {
  banner: 'ca-app-pub-0252848696122291/9925739552',
  interstitial: 'ca-app-pub-0252848696122291/5701396427',
  rewarded: '',                                        // TODO: create a rewarded ad unit in AdMob console
} as const;

// AdMob App ID (used in AndroidManifest.xml, not in JS)
export const ADMOB_APP_ID = 'ca-app-pub-0252848696122291~4096670719';

/**
 * Whether ads should be displayed.
 *
 * In the browser (dev/preview) we hide ads so they don't clutter the
 * experience.  On a real Android device via Capacitor the flag flips to true.
 *
 * For now this always returns `true` so we can see the placeholders during
 * development.  When real AdMob is wired up, switch to:
 *
 *   import { Capacitor } from '@capacitor/core';
 *   export const AD_ENABLED = Capacitor.isNativePlatform();
 */
export const AD_ENABLED = true;
