// Notification Sound Player: Plays custom /quota_ready.mp3 with synthesized anime chime fallback

class NotificationSoundPlayer {
  private audioCtx: AudioContext | null = null;

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
   * Plays the custom SFX audio (/quota_ready.mp3) with synthesized anime sparkle chime fallback
   */
  playAnimeChime() {
    try {
      const audio = new Audio('/quota_ready.mp3');
      audio.volume = 0.95;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((err) => {
          console.warn('Audio play fallback to synthesized chime:', err);
          this.synthesizeAnimeChime();
        });
      }
    } catch {
      this.synthesizeAnimeChime();
    }
  }

  private synthesizeAnimeChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Magical anime ascending pentatonic arpeggio frequencies (Hz)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

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
      console.warn('Audio synthesis error:', e);
    }
  }
}

export const soundPlayer = new NotificationSoundPlayer();
