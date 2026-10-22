/** Tiny persistent state: settings + narrative records. Versioned; corrupt data falls back cleanly. */

export interface Settings {
  amb: number; sfx: number; mute: boolean;
  captions: boolean; capSize: 's' | 'm' | 'l';
  reducedMotion: boolean; sens: number;
  quality: 'auto' | 'ultra' | 'high' | 'medium' | 'low';
  highContrast: boolean;
}

export interface NarrativeState {
  /** material-record ids the surveyor has rubbed */
  records: string[];
  /** ids of readable documents opened */
  docs: string[];
  /** work-order ids logged */
  orders: string[];
  /** zone ids visited */
  zones: string[];
  /** the connection has been recognised */
  connected: boolean;
  /** total real seconds in the yard */
  seconds: number;
  day: number;
}

const KEY = 'jernvik.v1';

export const defaultSettings = (): Settings => ({
  amb: 0.8, sfx: 0.9, mute: false,
  captions: true, capSize: 'm',
  reducedMotion: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  sens: 1,
  quality: 'auto',
  highContrast: false,
});

export const defaultNarrative = (): NarrativeState => ({
  records: [], docs: [], orders: [], zones: [], connected: false, seconds: 0, day: 1,
});

type Area = 'settings' | 'narrative';
const listeners = new Set<(area: Area) => void>();

function load(): { settings: Settings; narrative: NarrativeState } {
  const out = { settings: defaultSettings(), narrative: defaultNarrative() };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return out;
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (p.settings && typeof p.settings === 'object') Object.assign(out.settings, p.settings);
    if (p.narrative && typeof p.narrative === 'object') Object.assign(out.narrative, p.narrative);
    if (!Array.isArray(out.narrative.records)) out.narrative.records = [];
  } catch { /* corrupt storage: clean induction */ }
  return out;
}

export const state = load();

export function save(): void {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage may be unavailable; in-memory is fine */ }
}

export function onChange(fn: (area: Area) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function emit(area: Area): void { listeners.forEach((f) => f(area)); }
