import { soundPlayer } from './soundUtils';
import { MODEL_CONFIGS } from '../constants/models';
import { Subscription } from '../types';

class NotificationManager {
  private notifiedSet = new Set<string>();

  constructor() {
    // Register Service Worker for reliable native Windows desktop notifications
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.warn('Service worker registration note:', err);
        });
      });
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Triggers sound + desktop notification + in-app toast
   */
  async notifyQuotaReady(sub: Subscription, onToast?: (msg: string) => void) {
    const meta = MODEL_CONFIGS[sub.model] || MODEL_CONFIGS.custom;
    const modelName = sub.model === 'custom' && sub.customModelName ? sub.customModelName : meta.name;
    const title = `⚡ ${modelName} Quota Ready!`;
    const body = `${modelName} (${sub.account}) quota has refreshed! Ready for coding.`;

    // 1. Play custom audio chime
    soundPlayer.playAnimeChime();

    // 2. Browser Desktop Notification (displays native Windows popup)
    if (this.isSupported()) {
      let perm = Notification.permission;
      if (perm === 'default') {
        perm = await Notification.requestPermission();
      }

      if (perm === 'granted') {
        const options: NotificationOptions = {
          body,
          tag: `quota-reset-${sub.id}-${Date.now()}`,
          requireInteraction: true, // Keeps it pinned on Windows screen until dismissed
        };

        // Try Service Worker notification first (best on Windows Chrome / Edge)
        if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(title, options);
          } catch {
            // Fallback to standard window Notification
            try {
              new Notification(title, options);
            } catch (e) {
              console.warn('Direct notification error:', e);
            }
          }
        } else {
          try {
            new Notification(title, options);
          } catch (e) {
            console.warn('Direct notification error:', e);
          }
        }
      }
    }

    // 3. In-app toast callback
    if (onToast) {
      onToast(`⚡ ${modelName} (${sub.account}) quota has refreshed! Ready for coding.`);
    }
  }

  /**
   * Checks all subscriptions and fires notification when a countdown hits 00:00:00
   */
  checkAndNotify(subscriptions: Subscription[], onToast?: (msg: string) => void) {
    const now = Date.now();

    subscriptions.forEach(sub => {
      if (!sub.sessionResetAt) return;

      const resetTime = new Date(sub.sessionResetAt).getTime();
      const diffMs = resetTime - now;
      const key = `${sub.id}_${sub.sessionResetAt}`;

      // If reset time reached within the last 60 seconds and hasn't been notified yet
      if (diffMs <= 0 && diffMs > -60000) {
        if (!this.notifiedSet.has(key)) {
          this.notifiedSet.add(key);
          this.notifyQuotaReady(sub, onToast);
        }
      }
    });
  }

  testNotification(onToast?: (msg: string) => void) {
    const dummySub: Subscription = {
      id: 'test_sub',
      account: 'priya.work@gmail.com',
      model: 'claude',
      plan: 'Claude Pro (Test)',
      cost: 20,
      billingCycle: 'monthly',
      renewalDate: new Date().toISOString(),
      autoRenew: true,
      createdAt: '',
      updatedAt: '',
    };
    this.notifyQuotaReady(dummySub, onToast);
  }
}

export const notificationManager = new NotificationManager();
