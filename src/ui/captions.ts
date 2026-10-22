/** Captions are content, not subtitles of content. Everything the yard says, written down. */
export interface CapOpts { who?: string; sfx?: boolean; dur?: number; }

export class Captions {
  private rows: HTMLElement[] = [];
  private timers: number[] = [];
  private lastText = '';
  private lastAt = 0;

  constructor(private root: HTMLElement) {}

  push(text: string, opts: CapOpts = {}): void {
    if (!text) return;
    const now = performance.now();
    if (text === this.lastText && now - this.lastAt < 4000) return; // the yard does not repeat itself
    this.lastText = text; this.lastAt = now;

    const el = document.createElement('div');
    el.className = 'cap' + (opts.sfx ? ' cap--sfx' : '');
    if (opts.who) {
      const who = document.createElement('span');
      who.className = 'cap__who';
      who.textContent = opts.who;
      el.appendChild(who);
    }
    el.appendChild(document.createTextNode(text));
    this.root.appendChild(el);
    this.rows.push(el);
    requestAnimationFrame(() => el.classList.add('cap--on'));
    while (this.rows.length > 2) {
      const old = this.rows.shift()!;
      this.dismiss(old);
    }
    const dur = (opts.dur ?? (opts.sfx ? 3.4 : 5.6)) * 1000;
    this.timers.push(window.setTimeout(() => {
      this.dismiss(el);
      this.rows = this.rows.filter((r) => r !== el);
    }, dur));
  }

  private dismiss(el: HTMLElement): void {
    el.classList.remove('cap--on');
    window.setTimeout(() => el.remove(), 500);
  }

  pa(text: string): void {
    this.push(text, { who: 'PA — YARD ANNOUNCE', dur: 7 });
  }

  sfx(text: string): void {
    this.push(text, { sfx: true });
  }
}
