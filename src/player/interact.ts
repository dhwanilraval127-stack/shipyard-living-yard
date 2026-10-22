import * as THREE from 'three/webgpu';
import type { Interactable } from '../world/types';

/** One affordance per view. Nearest engageable thing inside its radius and your cone. */
export class Interaction {
  focus: Interactable | null = null;
  private dir = new THREE.Vector3();

  constructor(private items: Interactable[]) {}

  update(camPos: THREE.Vector3, camDir: THREE.Vector3): Interactable | null {
    let best: Interactable | null = null;
    let bestScore = -1;
    for (const it of this.items) {
      if (it.enabled && !it.enabled()) continue;
      const dx = it.pos.x - camPos.x, dy = it.pos.y - camPos.y, dz = it.pos.z - camPos.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > it.radius) continue;
      this.dir.set(dx / d, dy / d, dz / d);
      const dot = this.dir.dot(camDir);
      if (dot < 0.55) continue;
      const score = dot * 2 - d / it.radius;
      if (score > bestScore) { bestScore = score; best = it; }
    }
    this.focus = best;
    return best;
  }

  trigger(): void {
    this.focus?.act();
  }

  /** add interactables discovered late (none today; the list is closed) */
  add = (it: Interactable): void => { this.items.push(it); };
  get all(): Interactable[] { return this.items; }
}
