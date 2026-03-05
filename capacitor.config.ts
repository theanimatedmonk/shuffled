import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shuffled.cards',
  appName: 'Shuffled',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
