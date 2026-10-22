/** Minimal HUD: a clock chip, a place, a prompt, a hint. Nothing else. */
export class Hud {
  private clocktime: HTMLElement;
  private clockday: HTMLElement;
  private loc: HTMLElement;
  private promptEl: HTMLElement;
  private promptLabel: HTMLElement;
  private hintEl: HTMLElement;
  private locTimer = 0;
  private curLoc = '';

  constructor() {
    this.clocktime = document.getElementById('clocktime')!;
    this.clockday = document.getElementById('clockday')!;
    this.loc = document.getElementById('locchip')!;
    this.promptEl = document.getElementById('prompt')!;
    this.promptLabel = document.getElementById('promptlabel')!;
    this.hintEl = document.getElementById('hint')!;
  }

  show(): void { (document.getElementById('hud') as HTMLElement).hidden = false; }

  clock(hhmm: string, day: number): void {
    this.clocktime.textContent = `YARD TIME ${hhmm}`;
    this.clockday.textContent = `DAY ${day}`;
  }

  place(name: string): void {
    if (name === this.curLoc) return;
    this.curLoc = name;
    this.loc.textContent = name;
    this.loc.classList.add('loc--on');
    window.clearTimeout(this.locTimer);
    this.locTimer = window.setTimeout(() => this.loc.classList.remove('loc--on'), 4200);
  }

  prompt(label: string | null): void {
    if (label === null) { this.promptEl.hidden = true; return; }
    this.promptLabel.textContent = label;
    this.promptEl.hidden = false;
  }

  hint(text: string | null): void {
    if (text === null) { this.hintEl.hidden = true; return; }
    this.hintEl.textContent = text;
    this.hintEl.hidden = false;
  }
}
