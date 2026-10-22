import type { AudioEngine } from '../engine/audio/engine';
import { Cues } from '../engine/audio/cues';
import { Rng } from '../engine/rng';
import { damp } from '../utils/math';

/**
 * The audio director runs the beds and the clock-driven horn. Sound tells you
 * where you are before your eyes agree.
 */
export class AudioDirector {
  cues: Cues;
  private ocean: ReturnType<Cues['oceanBed']> | null = null;
  private wind: ReturnType<Cues['windBed']> | null = null;
  private rain: ReturnType<Cues['rainBed']> | null = null;
  private torben: ReturnType<Cues['torbenIdle']> | null = null;
  private rng = new Rng(7);
  private nextGull = 6;
  private simT = 0;

  constructor(private e: AudioEngine) {
    this.cues = new Cues(e);
  }

  /** called once audio context exists */
  startBeds(torbenPos: { x: number; y: number; z: number }): void {
    if (!this.e.ctx || this.ocean) return;
    this.ocean = this.cues.oceanBed();
    this.wind = this.cues.windBed();
    this.rain = this.cues.rainBed();
    this.torben = this.cues.torbenIdle(torbenPos);
  }

  step(): void { if (this.e.ctx) this.cues.step(); }

  hornFar(): void { if (this.e.ctx) this.cues.foghorn('far'); }

  update(dt: number, p: { x: number; y: number; z: number }, weather: { rain: number; windKt: number }, _foghornHour: number | null): void {
    if (!this.e.ctx) return;
    this.simT += dt;

    // listener follows the camera (position updated by main each frame)
    // beds by geography + weather
    const shore = Math.max(0, 1 - Math.max(0, (p.z - 10)) / 60) + Math.max(0, 1 - Math.max(0, (-85 - p.x)) / -60);
    const oceanG = 0.34 * Math.min(1.4, shore) + weather.rain * 0.06;
    this.ocean?.set(oceanG, weather.rain);
    const exposed = p.y > 6 ? 1.35 : 1;
    this.wind?.set(0.05 + (weather.windKt / 26) * 0.16 * exposed, weather.windKt / 26);
    this.rain?.set(weather.rain);
    const dTorben = Math.hypot(p.x - 70, p.z - 26);
    this.torben?.set(Math.max(0, 1 - dTorben / 60));

    // gulls near water
    this.nextGull -= dt;
    if (this.nextGull <= 0) {
      this.nextGull = this.rng.range(14, 42);
      const nearWater = p.z > 18 || p.x < -95 || p.y > 8;
      if (nearWater) this.cues.gull({ x: p.x + this.rng.range(-30, 30), y: p.y + this.rng.range(8, 18), z: p.z + this.rng.range(-20, 10) });
    }

    void damp;
  }
}
