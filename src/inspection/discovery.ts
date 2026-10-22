import { STAMPS, DOCS } from '../content/records';
import { WORK_ORDERS } from '../content/orders';
import { state, save, emit } from '../state/store';
import { CONNECTION_CAPTION } from '../content/lines';
import type { Captions } from '../ui/captions';
import type { DocCard } from '../ui/doccard';
import type { Clipboard } from '../ui/clipboard';
import type { AudioDirector } from '../systems/audioDirector';

/**
 * CURIOSITY → CONFUSION → RECOGNITION → CONNECTION → UNDERSTANDING.
 * The experience never announces the connection. It records both halves of
 * HT-61204, waits, and lets the visitor's clipboard do the rest.
 */
export class Discovery {
  private connectionTimer = 0;

  constructor(
    private caps: Captions,
    private card: DocCard,
    private clipboard: Clipboard,
    private audio: AudioDirector,
  ) {}

  stamp(id: string): void {
    const def = STAMPS.find((s) => s.id === id);
    if (!def) return;
    if (!state.narrative.records.includes(id)) {
      state.narrative.records.push(id);
      save();
      emit('narrative');
    }
    this.card.show(def.doc);
    this.checkConnection();
    this.checkOrders();
  }

  doc(id: string): void {
    const def = DOCS.find((d) => d.id === id);
    if (!def) return;
    if (!state.narrative.docs.includes(id)) {
      state.narrative.docs.push(id);
      save();
    }
    this.card.show(def);
  }

  visit(zoneId: string): void {
    if (!state.narrative.zones.includes(zoneId)) {
      state.narrative.zones.push(zoneId);
      save();
      this.checkOrders();
    }
  }

  clockedIn(): void {
    if (!state.narrative.orders.includes('wo-1')) {
      state.narrative.orders.push('wo-1');
      save();
      emit('narrative');
    }
  }

  private checkConnection(): void {
    if (state.narrative.connected) return;
    const has = state.narrative.records.includes('h44-s4') && state.narrative.records.includes('elin-b');
    if (!has) return;
    state.narrative.connected = true;
    save();
    emit('narrative');
    // one held breath, then the yard answers, far off
    this.connectionTimer = window.setTimeout(() => {
      this.caps.push(CONNECTION_CAPTION, { dur: 8 });
      window.setTimeout(() => this.audio.hornFar(), 2600);
    }, 1600);
  }

  private checkOrders(): void {
    const n = state.narrative;
    const add = (id: string): boolean => {
      if (n.orders.includes(id)) return false;
      n.orders.push(id);
      return true;
    };
    let addedId: string | null = null;
    if (['ways', 'cut', 'overlook'].every((z) => n.zones.includes(z))) { if (add('wo-2')) addedId = 'wo-2'; }
    if (n.connected && ['h44-keel', 'h44-s4', 'elin-b'].every((r) => n.records.includes(r))) {
      if (add('wo-3')) addedId = 'wo-3';
    }
    if (addedId) {
      save();
      emit('narrative');
      const wo = WORK_ORDERS.find((w) => w.id === addedId);
      if (wo) this.caps.push(`${wo.no} LOGGED — ${wo.done}`, { dur: 5 });
      this.clipboard.refresh();
    }
  }

  dispose(): void {
    if (this.connectionTimer) window.clearTimeout(this.connectionTimer);
  }
}
