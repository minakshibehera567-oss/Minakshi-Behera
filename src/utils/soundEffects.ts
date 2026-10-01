/**
 * Disney Cartoon Sound Effects Engine
 * Generates whimsical, authentic cartoon and magical sounds using Web Audio API
 * Customized for Moana, Elsa, Anna, and Olaf with full scientific operators.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private speechEnabled: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public getSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  /**
   * Play whimsical cartoon / magical crystal note for numbers 0-9
   */
  public playNumber(num: number, theme: 'elsa' | 'anna' | 'moana' | 'olaf' = 'elsa') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Musical scale tuned to happy fairytale intervals
    const freqs: Record<number, number> = {
      0: 261.63, // C4
      1: 293.66, // D4
      2: 329.63, // E4
      3: 349.23, // F4
      4: 392.0, // G4
      5: 440.0, // A4
      6: 493.88, // B4
      7: 523.25, // C5
      8: 587.33, // D5
      9: 659.25, // E5
    };

    const baseFreq = freqs[num] ?? 440;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    if (theme === 'elsa') {
      // Shimmering Ice Crystal Glockenspiel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 2, now); // crystalline high octave
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.01, now + 0.1);

      const overtone = this.ctx.createOscillator();
      const overGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(baseFreq * 4.2, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      overGain.gain.setValueAtTime(0.15, now);
      overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      overtone.connect(overGain);
      gain.connect(masterGain);
      overGain.connect(masterGain);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.38);
      overtone.stop(now + 0.15);
    } else if (theme === 'moana') {
      // Warm Polynesian log drum & ocean marimba pop
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.12);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (theme === 'anna') {
      // Arendelle Village Festival Bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.32);
    } else {
      // Olaf comical bouncy woodblock
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.05);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    if (this.speechEnabled) {
      this.speakText(num.toString());
    }
  }

  /**
   * Sound effects for all operations (Scientific, Trig, Modulus, Powers, etc.)
   */
  public playOperator(op: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    // Standard Math Operators
    if (op === '+') {
      // Ascending Fairytale Slide Whistle / Sparkle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (op === '-') {
      // Descending Slide Whistle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (op === '×' || op === '*') {
      // Cartoon Spring Boing
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.35);

      lfo.frequency.setValueAtTime(22, now);
      lfoGain.gain.setValueAtTime(28, now);
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(gain);
      gain.connect(masterGain);
      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 0.38);
      osc.stop(now + 0.38);
    } else if (op === '÷' || op === '/') {
      // Ocean Wave Splash / Crisp Drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (op === 'mod' || op === '%') {
      // Modulus - Polynesian Log Drum Pop / Double Click
      [220, 330].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const start = now + i * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, start + 0.08);

        g.gain.setValueAtTime(0.4, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

        osc.connect(g);
        g.connect(masterGain);
        osc.start(start);
        osc.stop(start + 0.12);
      });
    }

    // Trigonometric Operators (Sine, Cosine, Tangent)
    else if (op === 'sin' || op === 'asin') {
      // Elsa Ice Beam High Sine Wave Swell
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.linearRampToValueAtTime(1046.5, now + 0.15); // C6
      osc.frequency.linearRampToValueAtTime(783.99, now + 0.3); // G5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (op === 'cos' || op === 'acos') {
      // Moana Ocean Tide Resonance (deep, smooth swell)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.0, now); // G4
      osc.frequency.linearRampToValueAtTime(659.25, now + 0.14); // E5
      osc.frequency.linearRampToValueAtTime(523.25, now + 0.3); // C5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (op === 'tan' || op === 'atan') {
      // Magical Fairytale Triplet Sparkle
      [659.25, 880.0, 1174.66].forEach((f, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const s = now + idx * 0.05;

        o.type = 'sine';
        o.frequency.setValueAtTime(f, s);
        g.gain.setValueAtTime(0, s);
        g.gain.linearRampToValueAtTime(0.3, s + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, s + 0.2);

        o.connect(g);
        g.connect(masterGain);
        o.start(s);
        o.stop(s + 0.22);
      });
    }

    // Power, Root, Logarithms
    else if (op === '^' || op === 'xʸ' || op === 'x²' || op === 'x³') {
      // Ascending magical power blast (whooooosh-ting!)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (op === '√' || op === '∛') {
      // Ice crystal freeze ping
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.2);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.27);
    } else if (op === 'log' || op === 'ln') {
      // Deep mystic cave echo
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(390, now + 0.1);
      osc.frequency.linearRampToValueAtTime(320, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (op === 'π' || op === 'e') {
      // Golden Fairytale Star Chime
      [1046.5, 1318.51].forEach((f, i) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const start = now + i * 0.08;

        o.type = 'sine';
        o.frequency.setValueAtTime(f, start);
        g.gain.setValueAtTime(0.3, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        o.connect(g);
        g.connect(masterGain);
        o.start(start);
        o.stop(start + 0.38);
      });
    } else if (op === '(' || op === ')') {
      // Bubble pop
      this.playBackspace();
    } else {
      this.playChime(587.33);
    }

    if (this.speechEnabled) {
      const speechMap: Record<string, string> = {
        '+': 'Plus',
        '-': 'Minus',
        '×': 'Times',
        '*': 'Times',
        '÷': 'Divided by',
        '/': 'Divided by',
        mod: 'Modulo',
        '%': 'Modulo',
        sin: 'Sine',
        cos: 'Cosine',
        tan: 'Tangent',
        asin: 'Arc sine',
        acos: 'Arc cosine',
        atan: 'Arc tangent',
        '^': 'To the power of',
        '√': 'Square root',
        '∛': 'Cube root',
        log: 'Log',
        ln: 'Natural log',
        π: 'Pi',
        e: 'Euler',
        '!': 'Factorial',
      };
      if (speechMap[op]) {
        this.speakText(speechMap[op]);
      }
    }
  }

  /**
   * Grand Disney Fairytale Fanfare for Equals (=)
   */
  public playEquals() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    // "Let It Go / How Far I'll Go" Triumphant 5-note arpeggio: C5 -> E5 -> G5 -> C6 -> E6
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      if (idx >= 3) {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, startTime + 0.2);
      }

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(idx === 4 ? 0.45 : 0.25, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });

    if (this.speechEnabled) {
      setTimeout(() => {
        this.speakText('Equals');
      }, 250);
    }
  }

  /**
   * Cartoon Deflation / Poof sound for Clear (AC)
   */
  public playClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.26);

    if (this.speechEnabled) {
      this.speakText('Clear!');
    }
  }

  /**
   * Cartoon Bubble Pop for Backspace
   */
  public playBackspace() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.03);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Waterdrop Ping for Decimal (.)
   */
  public playDecimal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1300, now);
    osc.frequency.exponentialRampToValueAtTime(1900, now + 0.03);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.14);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.18);

    if (this.speechEnabled) {
      this.speakText('Point');
    }
  }

  /**
   * Special Disney Fanfare when discovering Easter Eggs
   */
  public playEasterEggFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
    ];

    let t = now;
    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + n.d + 0.02);
      t += n.d * 0.8;
    });
  }

  private playChime(freq: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public speakText(text: string) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.25;
      utter.pitch = 1.6;
      utter.volume = this.volume;
      window.speechSynthesis.speak(utter);
    } catch {
      // Fallback
    }
  }
}

export const soundEffects = new SoundEngine();
