import { AudioEngine } from './engine';

/**
 * The yard's voice, synthesized. No samples, no music. Hammer cadence,
 * grinder pitch, the foghorn that is Jernvik's signature.
 */

export interface Pos { x: number; y: number; z: number; }

interface ToneOpts {
  freq: number; type?: OscillatorType; dur: number; gain?: number;
  attack?: number; release?: number; slideTo?: number; when?: number;
  filter?: { type: BiquadFilterType; freq: number; q?: number };
  bus?: GainNode; pos?: Pos | null; reverb?: number; detune?: number;
}

export class Cues {
  private active = 0;
  constructor(private readonly e: AudioEngine) {}

  private tone(o: ToneOpts): void {
    const e = this.e;
    if (!e.ctx) return;
    if (this.active > 40) return;
    this.active++;
    const ctx = e.ctx;
    const t0 = (o.when ?? ctx.currentTime);
    const osc = ctx.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.value = o.freq;
    if (o.detune) osc.detune.value = o.detune;
    const g = ctx.createGain();
    const a = o.attack ?? 0.008;
    const r = o.release ?? Math.max(0.05, o.dur * 0.4);
    const peak = o.gain ?? 0.2;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + a);
    if (o.slideTo) osc.frequency.linearRampToValueAtTime(o.slideTo, t0 + o.dur);
    g.gain.setValueAtTime(peak, t0 + Math.max(a, o.dur - r));
    g.gain.linearRampToValueAtTime(0.0001, t0 + o.dur);
    let head: AudioNode = osc;
    if (o.filter) {
      const f = ctx.createBiquadFilter();
      f.type = o.filter.type; f.frequency.value = o.filter.freq; f.Q.value = o.filter.q ?? 1;
      osc.connect(f); head = f;
    }
    const dest = o.bus ?? e.busSfx;
    const input = e.route(dest, o.pos ?? null, 8, o.reverb ?? 0.1);
    head.connect(g).connect(input);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.05);
    osc.onended = () => { this.active--; input.disconnect(); };
  }

  private noiseHit(o: {
    dur: number; gain?: number; when?: number; pos?: Pos | null;
    lp?: number; hp?: number; bp?: number; q?: number; brown?: boolean; rate?: number; bus?: GainNode; reverb?: number;
    attack?: number;
  }): void {
    const e = this.e;
    if (!e.ctx) return;
    const ctx = e.ctx;
    const t0 = o.when ?? ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = e.noise(o.brown ?? false);
    src.loop = true;
    if (o.rate) src.playbackRate.value = o.rate;
    const g = ctx.createGain();
    const a = o.attack ?? 0.004;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(o.gain ?? 0.2, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    let head: AudioNode = src;
    if (o.bp) {
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = o.bp; f.Q.value = o.q ?? 1.2;
      head.connect(f); head = f;
    }
    if (o.lp) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = o.lp;
      head.connect(f); head = f;
    }
    if (o.hp) {
      const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = o.hp;
      head.connect(f); head = f;
    }
    const input = e.route(o.bus ?? e.busSfx, o.pos ?? null, 8, o.reverb ?? 0.12);
    head.connect(g).connect(input);
    src.start(t0);
    src.stop(t0 + o.dur + 0.1);
    src.onended = () => input.disconnect();
  }

  /* ---------- persistent beds (called by the director) ---------- */

  oceanBed(): { set: (gain: number, surf: number) => void } {
    const e = this.e, ctx = e.ctx!;
    const g = ctx.createGain(); g.gain.value = 0;
    const swell = ctx.createGain(); swell.gain.value = 0.7;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340; lp.Q.value = 0.6;
    const s1 = ctx.createBufferSource(); s1.buffer = e.noise(true); s1.loop = true;
    s1.connect(lp).connect(swell).connect(g).connect(e.busAmb);
    // surf hiss layer
    const surfG = ctx.createGain(); surfG.gain.value = 0.12;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 0.5;
    const s2 = ctx.createBufferSource(); s2.buffer = e.noise(false); s2.loop = true; s2.playbackRate.value = 0.8;
    s2.connect(bp).connect(surfG).connect(g);
    // slow swell LFO
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.32;
    lfo.connect(lfoG).connect(swell.gain);
    s1.start(); s2.start(); lfo.start();
    return { set: (gain: number, surf: number) => {
      g.gain.setTargetAtTime(gain, e.t, 0.4);
      surfG.gain.setTargetAtTime(0.1 + surf * 0.2, e.t, 0.4);
    } };
  }

  windBed(): { set: (gain: number, gust: number) => void } {
    const e = this.e, ctx = e.ctx!;
    const g = ctx.createGain(); g.gain.value = 0;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 480; bp.Q.value = 0.7;
    const s = ctx.createBufferSource(); s.buffer = e.noise(false); s.loop = true; s.playbackRate.value = 0.6;
    s.connect(bp).connect(g).connect(e.busAmb);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
    const lfoG = ctx.createGain(); lfoG.gain.value = 260;
    lfo.connect(lfoG).connect(bp.frequency);
    s.start(); lfo.start();
    return { set: (gain: number, gust: number) => {
      g.gain.setTargetAtTime(gain, e.t, 0.6);
      lfoG.gain.setTargetAtTime(200 + gust * 380, e.t, 0.6);
    } };
  }

  rainBed(): { set: (on: number) => void } {
    const e = this.e, ctx = e.ctx!;
    const g = ctx.createGain(); g.gain.value = 0;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 8500;
    const s = ctx.createBufferSource(); s.buffer = e.noise(false); s.loop = true;
    s.connect(hp).connect(lp).connect(g).connect(e.busAmb);
    s.start();
    return { set: (on: number) => g.gain.setTargetAtTime(on * 0.16, e.t, 0.8) };
  }

  /** Torben's engine, ticking over — quiet diesel heartbeat near the quay */
  torbenIdle(pos: Pos): { set: (gain: number) => void } {
    const e = this.e, ctx = e.ctx!;
    const input = e.route(e.busAmb, pos, 6, 0.08);
    const g = ctx.createGain(); g.gain.value = 0;
    g.connect(input);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140; lp.Q.value = 1.4;
    lp.connect(g);
    // periodic firing pulses
    const fire = (): void => {
      if (!this.e.ctx) return;
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.value = 42 + Math.random() * 8;
      const eg = ctx.createGain();
      const t0 = ctx.currentTime;
      eg.gain.setValueAtTime(0.5, t0);
      eg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
      o.connect(eg).connect(lp);
      o.start(); o.stop(t0 + 0.2);
      window.setTimeout(fire, 260 + Math.random() * 60);
    };
    fire();
    return { set: (gain: number) => g.gain.setTargetAtTime(gain * 0.5, e.t, 0.5) };
  }

  /* ---------- one-shot cues ---------- */

  foghorn(kind: 'near' | 'far', when?: number): void {
    const g = kind === 'near' ? 0.5 : 0.16;
    const lp = kind === 'near' ? 240 : 130;
    const rev = kind === 'near' ? 0.22 : 0.4;
    const t = when ?? this.e.t;
    this.tone({ freq: 64, type: 'sawtooth', dur: 3.6, gain: g, attack: 0.7, release: 1.4, when: t, filter: { type: 'lowpass', freq: lp, q: 0.8 }, reverb: rev, pos: null });
    this.tone({ freq: 64.7, type: 'sawtooth', dur: 3.6, gain: g * 0.8, attack: 0.7, release: 1.4, when: t, filter: { type: 'lowpass', freq: lp * 1.1, q: 0.8 }, reverb: rev, pos: null });
    this.tone({ freq: 32, type: 'sine', dur: 3.6, gain: g * 0.5, attack: 0.7, release: 1.4, when: t, pos: null, reverb: rev });
  }

  twoTone(pos: Pos | null): void {
    this.tone({ freq: 392, type: 'sawtooth', dur: 0.34, gain: 0.14, attack: 0.02, filter: { type: 'lowpass', freq: 1400 }, pos, reverb: 0.2 });
    this.tone({ freq: 311, type: 'sawtooth', dur: 0.5, gain: 0.14, attack: 0.02, when: this.e.t + 0.36, filter: { type: 'lowpass', freq: 1200 }, pos, reverb: 0.2 });
  }

  shiftWhistle(): void {
    for (let i = 0; i < 3; i++) {
      this.tone({ freq: 830, type: 'square', dur: 0.34, gain: 0.06, attack: 0.015, when: this.e.t + i * 0.55, filter: { type: 'bandpass', freq: 830, q: 3 }, reverb: 0.3, pos: null });
    }
  }

  paChime(): void {
    this.tone({ freq: 659, type: 'sine', dur: 0.5, gain: 0.1, attack: 0.005, bus: this.e.busUi, pos: null, reverb: 0.15 });
    this.tone({ freq: 523, type: 'sine', dur: 0.7, gain: 0.1, attack: 0.005, when: this.e.t + 0.28, bus: this.e.busUi, pos: null, reverb: 0.15 });
  }

  siren(when?: number): void {
    const t = when ?? this.e.t;
    this.tone({ freq: 560, type: 'triangle', dur: 1.6, gain: 0.07, attack: 0.05, slideTo: 840, when: t, reverb: 0.3, pos: null });
    this.tone({ freq: 840, type: 'triangle', dur: 1.6, gain: 0.06, attack: 0.05, slideTo: 560, when: t + 1.6, reverb: 0.3, pos: null });
  }

  hammer(pos: Pos): void {
    this.noiseHit({ dur: 0.06, gain: 0.3, pos, lp: 900, reverb: 0.18 });
    const f = 700 + Math.random() * 1600;
    this.tone({ freq: f, type: 'sine', dur: 0.18, gain: 0.08, pos, filter: { type: 'bandpass', freq: f, q: 8 }, reverb: 0.2 });
    this.tone({ freq: f * 1.51, type: 'sine', dur: 0.1, gain: 0.04, pos, filter: { type: 'bandpass', freq: f * 1.51, q: 9 }, reverb: 0.2 });
  }

  grinder(pos: Pos, dur: number): void {
    if (!this.e.ctx) return;
    const ctx = this.e.ctx;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.e.noise(false); src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2800; bp.Q.value = 1.6;
    // wobble the wheel against the plate
    const wob = ctx.createOscillator(); wob.frequency.value = 7 + Math.random() * 5;
    const wobG = ctx.createGain(); wobG.gain.value = 900;
    wob.connect(wobG).connect(bp.frequency);
    const saw = ctx.createOscillator(); saw.type = 'sawtooth'; saw.frequency.value = 88;
    const sawG = ctx.createGain(); sawG.gain.value = 0.05;
    const slp = ctx.createBiquadFilter(); slp.type = 'lowpass'; slp.frequency.value = 500;
    saw.connect(slp).connect(sawG);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.16, t0 + 0.4);
    g.gain.setValueAtTime(0.16, t0 + dur - 0.5);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    const input = this.e.route(this.e.busSfx, pos, 10, 0.16);
    src.connect(bp).connect(g);
    sawG.connect(g);
    g.connect(input);
    src.start(); saw.start(); wob.start();
    src.stop(t0 + dur + 0.1); saw.stop(t0 + dur + 0.1); wob.stop(t0 + dur + 0.1);
    src.onended = () => input.disconnect();
  }

  weld(pos: Pos, dur: number): void {
    if (!this.e.ctx) return;
    // crackle: a scattering of tiny ticks inside a sizzle envelope
    const ctx = this.e.ctx;
    const t0 = ctx.currentTime;
    const n = Math.floor(dur * 22);
    for (let i = 0; i < n; i++) {
      if (Math.random() < 0.6) {
        this.noiseHit({ dur: 0.02 + Math.random() * 0.03, gain: 0.05 + Math.random() * 0.09, when: t0 + Math.random() * dur, pos, bp: 3200 + Math.random() * 2600, q: 2, reverb: 0.12 });
      }
    }
    this.noiseHit({ dur, gain: 0.035, attack: 0.3, pos, bp: 5200, q: 0.7, reverb: 0.1 });
    this.tone({ freq: 58, type: 'sine', dur, gain: 0.03, attack: 0.4, pos, reverb: 0.1 });
  }

  torch(pos: Pos, dur: number): void {
    if (!this.e.ctx) return;
    const ctx = this.e.ctx;
    const t0 = ctx.currentTime;
    this.noiseHit({ dur, gain: 0.075, attack: 0.25, pos, bp: 1700, q: 0.8, reverb: 0.12 });
    for (let i = 0; i < dur * 8; i++) {
      this.noiseHit({ dur: 0.03, gain: 0.03 + Math.random() * 0.05, when: t0 + Math.random() * dur, pos, bp: 900 + Math.random() * 2000, q: 2 });
    }
  }

  gull(pos: Pos | null): void {
    const base = 1150 + Math.random() * 350;
    const t = this.e.t;
    for (let c = 0; c < 2 + Math.floor(Math.random() * 2); c++) {
      this.tone({ freq: base, type: 'sawtooth', dur: 0.16, gain: 0.028, attack: 0.02, slideTo: base * 0.72, when: t + c * 0.24, filter: { type: 'bandpass', freq: base * 0.9, q: 2.4 }, pos, reverb: 0.2 });
    }
  }

  splash(pos: Pos, when?: number): void {
    const t = when ?? this.e.t;
    this.noiseHit({ dur: 2.4, gain: 0.5, when: t, pos, lp: 2400, attack: 0.02, reverb: 0.24 });
    this.noiseHit({ dur: 4.5, gain: 0.2, when: t + 0.3, pos, lp: 700, attack: 0.4, reverb: 0.3 });
  }

  rumble(dur: number, when?: number): void {
    const t = when ?? this.e.t;
    this.noiseHit({ dur, gain: 0.4, when: t, brown: true, lp: 130, attack: Math.min(2, dur * 0.25), reverb: 0.2, pos: null });
    this.tone({ freq: 30, type: 'sawtooth', dur, gain: 0.14, attack: 1.2, when: t, filter: { type: 'lowpass', freq: 90 }, pos: null, reverb: 0.25 });
  }

  waysGroan(dur: number, when?: number): void {
    const t = when ?? this.e.t;
    this.tone({ freq: 44, type: 'sawtooth', dur, gain: 0.1, attack: 0.8, when: t, slideTo: 37, filter: { type: 'lowpass', freq: 130, q: 4 }, pos: null, reverb: 0.3 });
    this.tone({ freq: 66, type: 'sawtooth', dur: dur * 0.8, gain: 0.05, attack: 1.1, when: t + 0.8, slideTo: 60, filter: { type: 'lowpass', freq: 150, q: 5 }, pos: null, reverb: 0.3 });
  }

  hornChorus(when?: number): void {
    const t = when ?? this.e.t;
    this.foghorn('near', t);
    this.tone({ freq: 96, type: 'sawtooth', dur: 3.0, gain: 0.12, attack: 0.6, release: 1.2, when: t + 0.5, filter: { type: 'lowpass', freq: 320 }, pos: null, reverb: 0.3 });
    this.tone({ freq: 48, type: 'sawtooth', dur: 3.4, gain: 0.16, attack: 0.7, release: 1.5, when: t + 0.9, filter: { type: 'lowpass', freq: 200 }, pos: null, reverb: 0.35 });
  }

  step(): void {
    this.noiseHit({ dur: 0.055, gain: 0.028 + Math.random() * 0.02, lp: 480 + Math.random() * 260, reverb: 0.04 });
  }

  /** the overlook: a hammer strike returns as a note. The yard becomes the score. */
  pluck(freq: number, pos: Pos): void {
    this.tone({ freq, type: 'sine', dur: 2.8, gain: 0.055, attack: 0.006, pos, reverb: 0.55 });
    this.tone({ freq: freq * 2.01, type: 'triangle', dur: 1.6, gain: 0.02, attack: 0.004, pos, reverb: 0.55 });
  }
}
