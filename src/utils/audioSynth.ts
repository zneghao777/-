import { AmbientSoundType } from '../types';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'off';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private timerInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSound(type: AmbientSoundType, volume = 0.3) {
    this.stop();
    this.currentType = type;

    if (type === 'off') return;

    this.initContext();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'whitenoise') {
      this.playWhiteNoise();
    } else if (type === 'rain') {
      this.playRain();
    } else if (type === 'breeze') {
      this.playBreeze();
    } else if (type === 'chime') {
      this.playMeditationChime();
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Soft lowpass filter to make it gentle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();
    this.noiseNode = source;
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter simulating rain droplets
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Subtle LFO for rainfall intensity variation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();

    this.noiseNode = source;
    this.filterNode = filter;
    this.lfoNode = lfo;
    this.lfoGain = lfoGain;
  }

  private playBreeze() {
    if (!this.ctx || !this.gainNode) return;
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // Slow moving gentle breeze swell
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();

    this.noiseNode = source;
    this.filterNode = filter;
    this.lfoNode = lfo;
    this.lfoGain = lfoGain;
  }

  private playMeditationChime() {
    if (!this.ctx || !this.gainNode) return;

    const chimeStrike = () => {
      if (!this.ctx || !this.gainNode) return;
      const fundamental = 396; // Solfeggio liberation frequency
      const harmonics = [1, 2.01, 3.02, 4.2];
      const gains = [0.4, 0.25, 0.12, 0.05];

      harmonics.forEach((h, idx) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * h, this.ctx.currentTime);

        const attack = 0.02;
        const decay = 5.5;
        const now = this.ctx.currentTime;
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(gains[idx], now + attack);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(oscGain);
        oscGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + decay);
      });
    };

    // First strike immediately
    chimeStrike();

    // Occasional gentle strike every 12 seconds
    this.timerInterval = window.setInterval(chimeStrike, 12000);
  }

  public stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.lfoNode) {
      try { this.lfoNode.stop(); } catch {}
      this.lfoNode.disconnect();
      this.lfoNode = null;
    }
    if (this.noiseNode) {
      try { (this.noiseNode as AudioScheduledSourceNode).stop(); } catch {}
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.currentType = 'off';
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }
}

export const soundEngine = new SoundscapeEngine();
