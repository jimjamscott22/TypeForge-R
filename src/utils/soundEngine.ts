import { SwitchSoundType } from '../types';

class MechanicalSoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.6;
  private currentSwitch: SwitchSoundType = 'clicky';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSwitch(switchType: SwitchSoundType) {
    this.currentSwitch = switchType;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public playKey(key: string, isError: boolean = false) {
    if (this.currentSwitch === 'mute' || this.volume <= 0.01) return;

    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (isError) {
      this.playErrorSound(now);
      return;
    }

    switch (this.currentSwitch) {
      case 'clicky':
        this.playClicky(now, key);
        break;
      case 'tactile':
        this.playTactile(now, key);
        break;
      case 'linear':
        this.playLinear(now, key);
        break;
      default:
        break;
    }
  }

  // Clicky (Cherry Blue style): Crisp leaf snap + housing bottom-out
  private playClicky(now: number, key: string) {
    if (!this.ctx) return;

    const isSpace = key === ' ' || key === 'Space';
    const isEnter = key === 'Enter';
    const baseFreq = isSpace ? 320 : isEnter ? 420 : 750 + Math.random() * 250;

    // 1. High-frequency click impulse
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(isSpace ? 2200 : 3800 + (Math.random() * 400 - 200), now);
    clickOsc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

    clickGain.gain.setValueAtTime(this.volume * 0.45, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // 2. Plastic housing bottom-out thud
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(baseFreq, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(120, now + (isSpace ? 0.06 : 0.04));

    bodyGain.gain.setValueAtTime(this.volume * 0.5, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.07 : 0.05));

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.ctx.destination);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.08);

    // 3. Noise burst for switch friction
    this.playNoise(now, isSpace ? 0.04 : 0.02, 1400, this.volume * 0.25);
  }

  // Tactile (Cherry Brown style): Softer bump, rounder clack
  private playTactile(now: number, key: string) {
    if (!this.ctx) return;

    const isSpace = key === ' ' || key === 'Space';
    const baseFreq = isSpace ? 260 : 480 + (Math.random() * 80 - 40);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.035);

    gain.gain.setValueAtTime(this.volume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    this.playNoise(now, 0.025, 900, this.volume * 0.2);
  }

  // Linear (Cherry Red style): Smooth, deep thock without the click
  private playLinear(now: number, key: string) {
    if (!this.ctx) return;

    const isSpace = key === ' ' || key === 'Space';
    const baseFreq = isSpace ? 180 : 280 + (Math.random() * 50 - 25);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.4, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.06 : 0.045));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    this.playNoise(now, 0.03, 600, this.volume * 0.15);
  }

  private playErrorSound(now: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  private playNoise(now: number, duration: number, cutoff: number, gainLevel: number) {
    if (!this.ctx) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, now);
    filter.Q.setValueAtTime(2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }
}

export const soundEngine = new MechanicalSoundEngine();
