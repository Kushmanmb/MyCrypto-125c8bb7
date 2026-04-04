import { Network } from '@types';

const featureFlagName = 'MYC_EIP1559';

// Migration helper: reads from localStorage for backwards compatibility
// Returns the stored value and removes it from localStorage
// Note: This function should ideally be called only once during app initialization
// to avoid race conditions. The removal happens immediately to ensure clean state.
export const migrateEIP1559FlagFromLocalStorage = (): boolean | undefined => {
  const ls = localStorage.getItem(featureFlagName);
  if (ls !== null) {
    const value = ls !== 'false';
    // Remove immediately after reading to ensure single source of truth (Redux)
    localStorage.removeItem(featureFlagName);
    return value;
  }
  return undefined;
};

// Temporary fallback to localStorage for backwards compatibility
// This will be removed once all components use Redux store
const getLocalStorageFallback = () => {
  const ls = localStorage.getItem(featureFlagName);
  return ls !== 'false';
};

// Legacy function kept for backwards compatibility during migration
// @deprecated Use Redux store selector getIsEIP1559Enabled instead
export const getEIP1559FeatureFlag = getLocalStorageFallback;

// Legacy function kept for backwards compatibility during migration
// @deprecated Use Redux store action setEIP1559Enabled instead
export const setEIP1559FeatureFlag = (value: boolean) => {
  localStorage.setItem(featureFlagName, value.toString());
};

// Check if EIP1559 is supported and enabled
// @param network - The network to check for EIP1559 support
// @param isEnabled - Optional: whether EIP1559 is enabled in settings (null/undefined = check localStorage fallback, true/false = explicit override)
export const isEIP1559Supported = (network: Network, isEnabled?: boolean) => {
  // Use explicit value if provided, otherwise fall back to localStorage
  const enabled = isEnabled !== undefined ? isEnabled : getLocalStorageFallback();
  return enabled && network.supportsEIP1559;
};
