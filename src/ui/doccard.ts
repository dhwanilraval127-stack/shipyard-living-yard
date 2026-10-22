import type { YardDoc } from '../content/records';

/** The Certificate-of-Survey card. Yard paper, stamped, closable with the same key. */
export class DocCard {
  private root: HTMLElement;
  private titleEl: HTMLElement;
  private refEl: HTMLElement;
  private rowsEl: HTMLElement;
  private bodyEl: HTMLElement;
  private stampEl: HTMLElement;
  onClosed: (() => void) | null = null;

  constructor() {
    this.root = document.getElementById('doccard')!;
    this.titleEl = document.getElementById('doccard__title')!;
    this.refEl = document.getElementById('doccard__ref')!;
    this.rowsEl = document.getElementById('doccard__rows')!;
    this.bodyEl = document.getElementById('doccard__body')!;
    this.stampEl = document.getElementById('doccard__stamp')!;
    document.getElementById('doccard__close')!.addEventListener('click', () => this.close());
  }

  get open(): boolean { return !this.root.hidden; }

  show(doc: YardDoc): void {
    this.titleEl.textContent = doc.title;
    this.refEl.textContent = doc.ref;
    this.rowsEl.innerHTML = '';
    for (const [k, v] of doc.rows) {
      const row = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      row.append(dt, dd);
      this.rowsEl.appendChild(row);
    }
    this.bodyEl.textContent = doc.body;
    this.stampEl.textContent = doc.stamp ?? 'RECORDED';
    this.root.hidden = false;
  }

  close(): void {
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.onClosed?.();
  }
}
