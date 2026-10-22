/** Fixed-step simulation (30 Hz) + per-frame render. The yard's heartbeat. */

export class Loop {
  private raf = 0;
  private last = 0;
  private acc = 0;
  private static readonly STEP = 1 / 30;

  fps = 60;
  ms = 16.6;
  running = false;
  static reported = false;

  constructor(
    private readonly onSim: (dt: number) => void,
    private readonly onFrame: (dt: number, now: number) => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      this.raf = requestAnimationFrame(tick);
      const dtRaw = (now - this.last) / 1000;
      this.last = now;
      const dt = Math.min(dtRaw, 0.1); // a stalled tab is not a time machine
      this.acc += dt;
      const step = Loop.STEP;
      let n = 0;
      while (this.acc >= step && n < 4) {
        try { this.onSim(step); } catch (e) {
          if (!Loop.reported) { Loop.reported = true; console.error('sim fault (once):', e); }
        }
        this.acc -= step; n++;
      }
      if (n === 4) this.acc = 0; // give up catching up; the next frame is what matters
      this.onFrame(dt, now);
      this.ms += (dtRaw * 1000 - this.ms) * 0.05;
      this.fps = 1000 / Math.max(this.ms, 0.01);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
}
