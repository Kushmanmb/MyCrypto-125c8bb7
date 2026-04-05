import { TFiatTicker } from '@types';

export const defaultSettings = {
  fiatCurrency: 'USD' as TFiatTicker,
  darkMode: false,
  dashboardAccounts: [],
  excludedAssets: [],
  language: 'en',
  isDemoMode: false,
  canTrackProductAnalytics: true,
  analyticsUserID: '',
  // Default to true to enable EIP1559 by default for networks that support it
  // This matches the default in settings.slice.ts selector
  isEIP1559Enabled: true
};
