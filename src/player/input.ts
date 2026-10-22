/** Keyboard + mouse. Rebindable later; honest now. */
export class Input {
  private keys = new Set<string>();
  dx = 0;
  dy = 0;
  locked = false;
  onInteract: (() => void) | null = null;
  onClipboard: (() => void) | null = null;
  onNotice: (() => void) | null = null;
  onStats: (() => void) | null = null;
  onAnyKey: (() => void) | null = null;
  onEscape: (() => void) | null = null;
  sens = 1;

  constructor(private canvas: HTMLCanvasElement) {
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
    document.addEventListener('pointerlockchange', this.plChange);
    document.addEventListener('mousemove', this.mmove);
    this.canvas.addEventListener('mousedown', this.take);
  }

  private keydown = (e: KeyboardEvent): void => {
    if (e.repeat) return;
    const k = e.code;
    this.keys.add(k);
    this.onAnyKey?.();
    if (k === 'Escape') this.onEscape?.();
    if (k === 'KeyE') this.onInteract?.();
    if (k === 'Tab') { e.preventDefault(); this.onClipboard?.(); }
    if (k === 'KeyN') this.onNotice?.();
    if (k === 'F3') { e.preventDefault(); this.onStats?.(); }
  };

  private keyup = (e: KeyboardEvent): void => { this.keys.delete(e.code); };

  private plChange = (): void => {
    this.locked = document.pointerLockElement === this.canvas;
  };

  private mmove = (e: MouseEvent): void => {
    if (!this.locked) return;
    this.dx += e.movementX;
    this.dy += e.movementY;
  };

  private take = (): void => {
    if (!this.locked && !document.querySelector('.board:not([hidden]), .doccard:not([hidden]), .twod:not([hidden])')) {
      void this.canvas.requestPointerLock();
    }
  };

  requestLock(): void { void this.canvas.requestPointerLock(); }
  releaseLock(): void { if (this.locked) document.exitPointerLock(); }

  axis(): { x: number; z: number } {
    let x = 0, z = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    const len = Math.hypot(x, z);
    return len > 1 ? { x: x / len, z: z / len } : { x, z };
  }

  consumeLook(): { dx: number; dy: number } {
    const out = { dx: this.dx, dy: this.dy };
    this.dx = 0; this.dy = 0;
    return out;
  }
}
