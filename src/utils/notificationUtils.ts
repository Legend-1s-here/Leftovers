import { soundPlayer } from './soundUtils';
import { MODEL_CONFIGS } from '../constants/models';
import { Subscription } from '../types';

class NotificationManager {
  private notifiedSet = new Set<string>();

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
   * Triggers sound + desktop notification + optional callback
   */
  notifyQuotaReady(sub: Subscription, onToast?: (msg: string) => void) {
    const meta = MODEL_CONFIGS[sub.model] || MODEL_CONFIGS.custom;
    const modelName = sub.model === 'custom' && sub.customModelName ? sub.customModelName : meta.name;
    const title = `⚡ ${modelName} Quota Ready!`;
    const body = `${modelName} (${sub.account}) quota has refreshed! Ready for coding.`;

    // 1. Play anime chime
    soundPlayer.playAnimeChime();

    // 2. Browser Desktop Notification (works when tab is minimized or in background)
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `quota-reset-${sub.id}-${sub.sessionResetAt}`,
          requireInteraction: false,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Notification error:', e);
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
