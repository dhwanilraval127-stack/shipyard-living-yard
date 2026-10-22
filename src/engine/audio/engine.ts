/**
 * The audio engine. Everything is synthesized — the yard has no soundtrack
 * and no audio files. WebAudio graph: buses → master → compressor out,
 * with one shared convolution send for the spaces that have one.
 */

export class AudioEngine {
  ctx: AudioContext | null = null;
  master!: GainNode;
  busAmb!: GainNode;
  busSfx!: GainNode;
  busUi!: GainNode;
  reverbSend!: GainNode;
  private _noiseWhite!: AudioBuffer;
  private _noiseBrown!: AudioBuffer;
  private volumes = { amb: 0.8, sfx: 0.9, mute: false };

  get ready(): boolean { return this.ctx !== null; }
  get t(): number { return this.ctx ? this.ctx.currentTime : 0; }

  ensure(): void {
    if (this.ctx) { void this.ctx.resume(); return; }
    const ctx = new AudioContext();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 3;
    comp.attack.value = 0.004;
    comp.release.value = 0.24;
    this.master.connect(comp).connect(ctx.destination);

    this.busAmb = ctx.createGain();
    this.busSfx = ctx.createGain();
    this.busUi = ctx.createGain();
    for (const b of [this.busAmb, this.busSfx, this.busUi]) b.connect(this.master);

    // one shared space: a steel-and-concrete hall, generated
    const conv = ctx.createConvolver();
    conv.buffer = this.makeIr(2.4, 3.2);
    this.reverbSend = ctx.createGain();
    this.reverbSend.gain.value = 1;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    this.reverbSend.connect(conv).connect(wet).connect(this.master);

    this._noiseWhite = this.makeNoise(2.5, false);
    this._noiseBrown = this.makeNoise(3.5, true);
    this.applyVolumes();
  }

  setVolumes(v: { amb: number; sfx: number; mute: boolean }): void {
    this.volumes = v;
    this.applyVolumes();
  }

  private applyVolumes(): void {
    if (!this.ctx) return;
    const m = this.volumes.mute ? 0 : 1;
    this.busAmb.gain.value = this.volumes.amb * 0.85 * m;
    this.busSfx.gain.value = this.volumes.sfx * m;
    this.busUi.gain.value = 0.7 * m;
    this.master.gain.value = this.volumes.mute ? 0 : 0.9;
  }

  private makeNoise(seconds: number, brown: boolean): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
        else d[i] = w;
      }
    }
    return buf;
  }

  /** generated impulse response — exponential decay, darkened over time */
  private makeIr(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / len;
        const env = Math.pow(1 - t, decay);
        lp += (Math.random() * 2 - 1 - lp) * 0.28; // darkening one-pole
        d[i] = lp * env * 0.5;
      }
    }
    return buf;
  }

  noise(brown = false): AudioBuffer {
    return brown ? this._noiseBrown : this._noiseWhite;
  }

  /** positional router: returns an input gain feeding a panner on `bus` */
  route(bus: GainNode, pos: { x: number; y: number; z: number } | null, refDist = 8, reverb = 0.12): GainNode {
    const ctx = this.ctx!;
    const input = ctx.createGain();
    if (pos) {
      const p = ctx.createPanner();
      p.panningModel = 'equalpower';
      p.distanceModel = 'inverse';
      p.refDistance = refDist;
      p.rolloffFactor = 1.1;
      p.maxDistance = 600;
      p.positionX.value = pos.x;
      p.positionY.value = pos.y;
      p.positionZ.value = pos.z;
      input.connect(p).connect(bus);
      if (reverb > 0) {
        const send = ctx.createGain();
        send.gain.value = reverb;
        input.connect(send).connect(this.reverbSend);
      }
    } else {
      input.connect(bus);
      if (reverb > 0) {
        const send = ctx.createGain();
        send.gain.value = reverb;
        input.connect(send).connect(this.reverbSend);
      }
    }
    return input;
  }

  updateListener(px: number, py: number, pz: number, fx: number, fy: number, fz: number): void {
    const l = this.ctx?.listener;
    if (!l) return;
    if (l.positionX) {
      const t = this.ctx!.currentTime;
      l.positionX.linearRampToValueAtTime(px, t + 0.05);
      l.positionY.linearRampToValueAtTime(py, t + 0.05);
      l.positionZ.linearRampToValueAtTime(pz, t + 0.05);
      l.forwardX.linearRampToValueAtTime(fx, t + 0.05);
      l.forwardY.linearRampToValueAtTime(fy, t + 0.05);
      l.forwardZ.linearRampToValueAtTime(fz, t + 0.05);
      l.upX.value = 0; l.upY.value = 1; l.upZ.value = 0;
    } else {
      const ll = l as unknown as {
        setPosition(x: number, y: number, z: number): void;
        setOrientation(fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
      };
      ll.setPosition(px, py, pz);
      ll.setOrientation(fx, fy, fz, 0, 1, 0);
    }
  }
}
