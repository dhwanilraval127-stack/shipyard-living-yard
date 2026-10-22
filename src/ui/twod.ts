import { TWOD_COPY } from '../content/lines';
import { STAMPS } from '../content/records';
import { state } from '../state/store';

/** The same yard in words. Kept complete on purpose — it is also the fallback. */
export class Twod {
  private root: HTMLElement;
  private body: HTMLElement;
  constructor() {
    this.root = document.getElementById('twod')!;
    this.body = document.getElementById('twod__body')!;
    document.getElementById('twod__close')!.addEventListener('click', () => this.close());
  }
  get open(): boolean { return !this.root.hidden; }
  show(): void {
    this.render();
    this.root.hidden = false;
  }
  close(): void { this.root.hidden = true; }

  private render(): void {
    this.body.innerHTML = '';
    for (const sec of TWOD_COPY) {
      const h = document.createElement('h2');
      h.textContent = sec.title;
      const p = document.createElement('div');
      p.innerHTML = sec.html;
      this.body.append(h, p);
    }
    if (state.narrative.records.length > 0) {
      const h = document.createElement('h2');
      h.textContent = 'YOUR MATERIAL RECORDS';
      this.body.appendChild(h);
      const ul = document.createElement('ul');
      for (const id of state.narrative.records) {
        const def = STAMPS.find((s) => s.id === id);
        if (!def) continue;
        const li = document.createElement('li');
        li.innerHTML = `<div class="rec">${def.heat} — ${def.doc.rows[1][1]}. ${def.doc.rows[3][1]}.</div>`;
        ul.appendChild(li);
      }
      this.body.appendChild(ul);
    }
  }
}
