// PIN authentication service for 1-click unlock on trusted devices

const PIN_KEY = 'quotaverse_pin_hash_v1';
const PIN_ENABLED_KEY = 'quotaverse_pin_enabled_v1';
const PIN_LOCKED_KEY = 'quotaverse_pin_is_locked_v1';

// Simple fast client hash with salt
function hashPin(pin: string): string {
  let hash = 5381;
  const salted = `qv_salt_2026_${pin}`;
  for (let i = 0; i < salted.length; i++) {
    hash = (hash * 33) ^ salted.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

export const pinService = {
  isPinSet(): boolean {
    if (typeof window === 'undefined') return false;
    const hasHash = Boolean(localStorage.getItem(PIN_KEY));
    const isEnabled = localStorage.getItem(PIN_ENABLED_KEY) === 'true';
    return hasHash && isEnabled;
  },

  setPin(pin: string): boolean {
    if (!pin || pin.length < 4) return false;
    try {
      localStorage.setItem(PIN_KEY, hashPin(pin));
      localStorage.setItem(PIN_ENABLED_KEY, 'true');
      localStorage.setItem(PIN_LOCKED_KEY, 'false');
      return true;
    } catch {
      return false;
    }
  },

  verifyPin(pin: string): boolean {
    try {
      const stored = localStorage.getItem(PIN_KEY);
      if (!stored) return false;
      const isValid = hashPin(pin) === stored;
      if (isValid) {
        localStorage.setItem(PIN_LOCKED_KEY, 'false');
      }
      return isValid;
    } catch {
      return false;
    }
  },

  removePin(): void {
    localStorage.removeItem(PIN_KEY);
    localStorage.removeItem(PIN_ENABLED_KEY);
    localStorage.removeItem(PIN_LOCKED_KEY);
  },

  isCurrentlyLocked(): boolean {
    if (!this.isPinSet()) return false;
    return localStorage.getItem(PIN_LOCKED_KEY) === 'true';
  },

  lock(): void {
    if (this.isPinSet()) {
      localStorage.setItem(PIN_LOCKED_KEY, 'true');
    }
  },

  unlock(): void {
    localStorage.setItem(PIN_LOCKED_KEY, 'false');
  }
};
