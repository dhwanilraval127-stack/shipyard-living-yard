import { DAILY, YARD_DAY_REAL_SEC, YARD_START_SEC } from '../content/schedule';

/** The yard clock. 1 yard day = YARD_DAY_REAL_SEC real seconds. Deterministic. */
export class YardClock {
  simSec = 0;
  day: number;
  private fired = new Set<string>();
  private firedThisTick: string[] = [];
  private prev = 0;

  constructor(day = 1) {
    this.day = day;
    // start mid-day: earlier events are already gone
    const start = this.yardSec;
    for (const ev of DAILY) if (ev.at <= start) this.fired.add(ev.id);
    this.prev = start;
  }

  get rate(): number { return 86400 / YARD_DAY_REAL_SEC; }

  get yardSec(): number {
    return ((YARD_START_SEC + this.simSec * this.rate) % 86400 + 86400) % 86400;
  }

  hhmm(): string {
    const s = Math.floor(this.yardSec);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  update(dt: number): string[] {
    this.simSec += dt;
    this.firedThisTick.length = 0;
    const now = this.yardSec;
    if (now < this.prev) { // midnight rollover
      this.day++;
      this.fired.clear();
    }
    this.prev = now;
    for (const ev of DAILY) {
      if (!this.fired.has(ev.id) && ev.at <= now) {
        this.fired.add(ev.id);
        this.firedThisTick.push(ev.id);
      }
    }
    return this.firedThisTick;
  }

  /** debug: force the clock to a given yard time */
  force(hhmm: string): void {
    const [h, m] = hhmm.split(':').map(Number);
    const target = h * 3600 + m * 60;
    const cur = this.yardSec;
    this.simSec += (target - cur) / this.rate;
    this.fired.clear();
    for (const ev of DAILY) if (ev.at <= target) this.fired.add(ev.id);
  }
}
