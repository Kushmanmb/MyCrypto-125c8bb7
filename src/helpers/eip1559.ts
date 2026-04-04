import { Network } from '@types';

const featureFlagName = 'MYC_EIP1559';

// Migration helper: reads from localStorage for backwards compatibility
// Returns true if feature should be enabled by default
export const migrateEIP1559FlagFromLocalStorage = (): boolean | undefined => {
  const ls = localStorage.getItem(featureFlagName);
  if (ls !== null) {
    // Clean up old localStorage value
    const value = ls !== 'false';
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
// @param isEnabled - Optional: whether EIP1559 is enabled in settings (defaults to localStorage check)
export const isEIP1559Supported = (network: Network, isEnabled?: boolean) => {
  const enabled = isEnabled !== undefined ? isEnabled : getLocalStorageFallback();
  return enabled && network.supportsEIP1559;
};
