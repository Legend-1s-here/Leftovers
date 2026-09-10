// Web Audio API anime-style chime synthesizer + audio file fallback

class NotificationSoundPlayer {
  private audioCtx: AudioContext | null = null;
  private customAudio: HTMLAudioElement | null = null;

  constructor() {
    // Check if custom sound file exists in public/
    try {
      this.customAudio = new Audio('/quota_ready.mp3');
    } catch {
      this.customAudio = null;
    }
  }

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a custom anime-style crystalline sparkle chime (C5 - E5 - G5 - C6 sparkle)
   * Designed using synthesized harmonic sine waves with reverb-like decay.
   */
  playAnimeChime() {
    try {
      // First try custom audio file if provided
      if (this.customAudio && this.customAudio.src) {
        this.customAudio.currentTime = 0;
        const playPromise = this.customAudio.play();
        if (playPromise) {
          playPromise.catch(() => {
            // If failed (e.g. file missing), fallback to synthesized anime chime
            this.synthesizeAnimeChime();
          });
          return;
        }
      }
      this.synthesizeAnimeChime();
    } catch {
      this.synthesizeAnimeChime();
    }
  }

  private synthesizeAnimeChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Magical anime ascending pentatonic arpeggio frequencies (Hz)
      // C5, E5, G5, B5, C6 with crystalline harmonics
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Primary tone: Sine wave for pure bell-like anime chime
        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        // Envelope: Instant attack, smooth exponential decay
        const startTime = now + index * 0.08;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.95);
      });
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  setCustomSoundUrl(url: string) {
    this.customAudio = new Audio(url);
  }
}

export const soundPlayer = new NotificationSoundPlayer();
