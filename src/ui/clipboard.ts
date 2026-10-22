import { WORK_ORDERS } from '../content/orders';
import { STAMPS } from '../content/records';
import { state, onChange } from '../state/store';
import { CONNECTION_NOTE } from '../content/lines';

/** The surveyor's clipboard: work orders and material records. The only menu. */
export class Clipboard {
  private root: HTMLElement;
  private ordersEl: HTMLElement;
  private recordsEl: HTMLElement;
  private noteEl: HTMLElement;

  constructor() {
    this.root = document.getElementById('clipboard')!;
    this.ordersEl = document.getElementById('cb__orders')!;
    this.recordsEl = document.getElementById('cb__records')!;
    this.noteEl = document.getElementById('cb__note')!;
    onChange(() => this.refresh());
    this.refresh();
  }

  get open(): boolean { return !this.root.hidden; }
  toggle(): void { this.root.hidden = !this.root.hidden; this.refresh(); }
  close(): void { this.root.hidden = true; }

  refresh(): void {
    this.ordersEl.innerHTML = '';
    for (const wo of WORK_ORDERS) {
      const li = document.createElement('li');
      const no = document.createElement('span');
      no.className = 'orders__no'; no.textContent = wo.no;
      const title = document.createElement('span');
      title.textContent = wo.title;
      const st = document.createElement('span');
      const done = state.narrative.orders.includes(wo.id);
      st.className = 'orders__state' + (done ? ' orders__state--done' : '');
      st.textContent = done ? 'LOGGED' : 'OPEN';
      li.append(no, title, st);
      this.ordersEl.appendChild(li);
    }
    this.recordsEl.innerHTML = '';
    if (state.narrative.records.length === 0) {
      const li = document.createElement('li');
      li.className = 'records__empty';
      li.textContent = 'None recorded yet. Plates carry heat numbers. Rub them.';
      this.recordsEl.appendChild(li);
    } else {
      for (const id of state.narrative.records) {
        const def = STAMPS.find((s) => s.id === id);
        if (!def) continue;
        const li = document.createElement('li');
        const heat = document.createElement('b');
        heat.textContent = def.heat;
        const label = document.createElement('span');
        label.textContent = def.doc.rows[1][1];
        const where = document.createElement('span');
        where.className = 'records__where';
        where.textContent = def.doc.rows[3][1];
        li.append(heat, label, where);
        this.recordsEl.appendChild(li);
      }
    }
    this.noteEl.hidden = !state.narrative.connected;
    this.noteEl.textContent = CONNECTION_NOTE;
  }
}
