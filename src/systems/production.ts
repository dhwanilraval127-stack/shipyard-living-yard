import * as THREE from 'three/webgpu';
import { M } from '../engine/mat';
import type { AmbientPoint } from '../world/types';
import type { Cues, Pos } from '../engine/audio/cues';
import { Rng } from '../engine/rng';

/**
 * Production activity. One truth about what work is happening where — it drives
 * sound, light and sparks together, which is why the yard reads as coherent.
 * Tea break stops the hammering. That silence is content.
 */

const H = 3600;

interface PointState { next: number; dur: number; }

export class Production {
  private states = new Map<string, PointState>();
  private rng = new Rng(44);
  private simT = 0;
  private weldLight: THREE.PointLight;
  private sparks: THREE.Points;
  private sparkPos: Float32Array;
  private live: Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number }> = [];

  constructor(
    scene: THREE.Scene,
    private points: AmbientPoint[],
    private cues: Cues,
    private readonly onHammer?: (pos: { x: number; y: number; z: number }) => void,
  ) {
    this.weldLight = new THREE.PointLight(0xcfe4ff, 0, 34, 1.8);
    scene.add(this.weldLight);

    const N = 160;
    this.sparkPos = new Float32Array(N * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.sparkPos, 3));
    const m = new THREE.PointsMaterial({
      color: 0xffb066, size: 0.09, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    this.sparks = new THREE.Points(g, m);
    this.sparks.frustumCulled = false;
    scene.add(this.sparks);
  }

  private active(kind: string, yardSec: number, tea: boolean): boolean {
    const day = yardSec >= 8 * H && yardSec < 17 * H;
    const night = yardSec >= 18.5 * H || yardSec < 23 * H;
    switch (kind) {
      case 'hammer': case 'grinder': return day && !tea;
      case 'weld': return (day && !tea) || night;
      case 'torch': return night;
      default: return false;
    }
  }

  update(dt: number, yardSec: number, player: THREE.Vector3, tea: boolean): void {
    this.simT += dt;
    let bestLight: { p: AmbientPoint; d: number } | null = null;

    for (const pt of this.points) {
      const on = this.active(pt.kind, yardSec, tea);
      const dx = pt.pos.x - player.x, dz = pt.pos.z - player.z;
      const d2 = dx * dx + dz * dz;
      if (!on || d2 > 160 * 160) continue;

      if (pt.kind === 'weld' || pt.kind === 'torch') {
        const d = Math.sqrt(d2);
        if (!bestLight || d < bestLight.d) bestLight = { p: pt, d };
      }

      let st = this.states.get(pt.id);
      if (!st) { st = { next: this.simT + this.rng.range(0.5, 3), dur: 0 }; this.states.set(pt.id, st); }
      if (this.simT >= st.next) {
        const pos: Pos = { x: pt.pos.x, y: pt.pos.y, z: pt.pos.z };
        switch (pt.kind) {
          case 'hammer':
            this.cues.hammer(pos);
            this.onHammer?.(pos);
            st.next = this.simT + this.rng.range(0.65, 1.5);
            break;
          case 'grinder': {
            const dur = this.rng.range(3, 6.5);
            this.cues.grinder(pos, dur);
            this.burst(pt.pos, 26, 5);
            st.next = this.simT + dur + this.rng.range(4, 11);
            break;
          }
          case 'weld': {
            const dur = this.rng.range(2, 4.5);
            this.cues.weld(pos, dur);
            this.burst(pt.pos, 18, 3.2);
            st.next = this.simT + dur + this.rng.range(3.5, 9);
            break;
          }
          case 'torch': {
            const dur = this.rng.range(3, 6);
            this.cues.torch(pos, dur);
            this.burst(pt.pos, 30, 6);
            st.next = this.simT + dur + this.rng.range(4, 10);
            break;
          }
        }
      }
    }

    // weld/torch light: pooled to the nearest active point
    if (bestLight && bestLight.d < 110) {
      const p = bestLight.p;
      this.weldLight.position.set(p.pos.x, p.pos.y + 0.3, p.pos.z);
      const torch = p.kind === 'torch';
      this.weldLight.color.setHex(torch ? 0xffc07a : 0xcfe4ff);
      const flick = 0.72 + 0.28 * Math.abs(Math.sin(this.simT * (torch ? 9 : 17)) * Math.sin(this.simT * 3.1));
      this.weldLight.intensity = (torch ? 60 : 90) * flick * Math.max(0, 1 - bestLight.d / 110);
      M.weldArc.emissiveIntensity = flick * 3.2;
    } else {
      this.weldLight.intensity = 0;
      M.weldArc.emissiveIntensity = 0;
    }

    // sparks
    const sp = this.sparks.geometry.attributes.position as THREE.BufferAttribute;
    let n = 0;
    for (let i = this.live.length - 1; i >= 0; i--) {
      const s = this.live[i];
      s.life -= dt;
      if (s.life <= 0) { this.live.splice(i, 1); continue; }
      s.vy -= 14 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
      if (n < 160) {
        this.sparkPos[n * 3] = s.x; this.sparkPos[n * 3 + 1] = s.y; this.sparkPos[n * 3 + 2] = s.z;
        n++;
      }
    }
    sp.needsUpdate = true;
    this.sparks.geometry.setDrawRange(0, n);
    this.sparks.visible = n > 0;
  }

  private burst(at: THREE.Vector3, count: number, spread: number): void {
    const d = Math.hypot(at.x - 0, at.z - 0); // (position is absolute; pool is capped)
    void d;
    for (let i = 0; i < count && this.live.length < 160; i++) {
      const a = this.rng.range(0, Math.PI * 2);
      const up = this.rng.range(1, spread);
      this.live.push({
        x: at.x, y: at.y, z: at.z,
        vx: Math.cos(a) * this.rng.range(0.5, 3.4),
        vy: up,
        vz: Math.sin(a) * this.rng.range(0.5, 3.4),
        life: this.rng.range(0.25, 0.6),
      });
    }
  }
}
