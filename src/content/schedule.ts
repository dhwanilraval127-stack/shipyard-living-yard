/**
 * The yard clock. One yard day passes in YARD_DAY_REAL_SEC real seconds.
 * All events are stated in yard-seconds since 00:00 and fire deterministically.
 */
export const YARD_DAY_REAL_SEC = 1200;           // 20 real minutes = 1 yard day
export const YARD_START_SEC = 7 * 3600 + 42 * 60; // induction day begins 07:42
export const LAUNCH_AT = 13 * 3600 + 15 * 60;     // hull 43 goes down the ways at 13:15

export interface SchedEvent { at: number; id: string; }

export const DAILY: SchedEvent[] = [
  { at: 6 * 3600, id: 'whistle-0600' },
  { at: 6 * 3600 + 240, id: 'pa-morning' },
  { at: 9 * 3600 + 30 * 60, id: 'tea-start' },
  { at: 9 * 3600 + 45 * 60, id: 'tea-end' },
  { at: 10 * 3600, id: 'crane-shift' },
  { at: 10 * 3600 + 30 * 60, id: 'rain-start' },
  { at: 11 * 3600 + 15 * 60, id: 'rain-end' },
  { at: 12 * 3600 + 45 * 60, id: 'launch-prep' },
  { at: LAUNCH_AT - 60, id: 'launch-t60' },
  { at: LAUNCH_AT - 30, id: 'launch-t30' },
  { at: LAUNCH_AT - 10, id: 'launch-t10' },
  { at: LAUNCH_AT - 5, id: 'launch-t5' },
  { at: LAUNCH_AT, id: 'launch-go' },
  { at: 14 * 3600, id: 'whistle-1400' },
  { at: 15 * 3600, id: 'crane-shift' },
  { at: 17 * 3600, id: 'daywork-end' },
  { at: 18 * 3600 + 30 * 60, id: 'floods-on' },
  { at: 22 * 3600, id: 'whistle-2200' },
  { at: 23 * 3600, id: 'pa-night' },
  { at: 3 * 3600 + 30 * 60, id: 'launch-recradle' },
  { at: 4 * 3600 + 30 * 60, id: 'dawn-watch' },
];
