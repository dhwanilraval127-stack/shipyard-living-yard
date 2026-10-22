import * as THREE from 'three/webgpu';
import type { KirstenBuilt } from '../world/kirsten';
import { WAY2_X } from '../world/kirsten';
import type { Cues, Pos } from '../engine/audio/cues';
import { PA_LINES } from '../content/lines';
import { clamp, damp } from '../utils/math';

/**
 * The launch. HULL 43 goes down No.2 way at 13:15, one yard day in twenty
 * real minutes. Odd days she sails; even days she is held at the mark and
 * winched back — a rehearsal. The yard's life does not require your presence.
 */

const keelY = (z: number): number => 3.4 - (z - 12) / 16;
const START_Z = 37;
const RUN_Z = 27;          // distance down the ways before the water takes her
const SLOPE = Math.atan(1 / 16);

type Mode = 'idle' | 'run' | 'drift' | 'hold' | 'return';

interface Spray { x: number; y: number; z: number; vx: number; vy: number; vz: number; }

export class LaunchSystem {
  mode: Mode = 'idle';
  private d = 0;
  private v = 0;
  private holdT = 0;
  private settleV = 0;
  private launchNo = 0;
  private spray: Spray[] = [];
  private pts: THREE.Points;
  private ptsPos: Float32Array;
  private foam: THREE.Mesh;
  private foamT = -1;

  constructor(
    private readonly k: KirstenBuilt,
    private readonly cues: Cues,
    private readonly say: (text: string) => void,
    scene: THREE.Scene,
  ) {
    // spray particles
    const N = 90;
    this.ptsPos = new Float32Array(N * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.ptsPos, 3));
    const m = new THREE.PointsMaterial({
      color: 0xe8f0f4, size: 0.55, transparent: true, opacity: 0.9,
      depthWrite: false, sizeAttenuation: true,
    });
    this.pts = new THREE.Points(g, m);
    this.pts.frustumCulled = false;
    this.pts.visible = false;
    scene.add(this.pts);
    // foam ring
    this.foam = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 1.25, 40),
      new THREE.MeshBasicMaterial({ color: 0xdfe8ec, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    this.foam.rotation.x = -Math.PI / 2;
    this.foam.visible = false;
    scene.add(this.foam);
  }

  private burst(x: number, y: number, z: number): void {
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * Math.PI * 2;
      const sp = 3 + Math.random() * 9;
      this.spray.push({
        x, y, z,
        vx: Math.cos(a) * sp * 0.5,
        vy: 6 + Math.random() * 10,
        vz: Math.sin(a) * sp * 0.5,
      });
    }
    this.foam.position.set(x, y + 0.1, z);
    this.foamT = 0;
  }

  private stepSpray(dt: number, waterY: number): void {
    let n = 0;
    for (let i = this.spray.length - 1; i >= 0; i--) {
      const s = this.spray[i];
      s.vy -= 16 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
      if (s.y < waterY - 0.5) { this.spray.splice(i, 1); continue; }
      if (n < 90) {
        this.ptsPos[n * 3] = s.x; this.ptsPos[n * 3 + 1] = s.y; this.ptsPos[n * 3 + 2] = s.z;
        n++;
      }
    }
    (this.pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    this.pts.geometry.setDrawRange(0, n);
    this.pts.visible = n > 0;
    if (this.foamT >= 0) {
      this.foamT += dt;
      const k = Math.min(1, this.foamT / 2.6);
      this.foam.scale.setScalar(1 + k * 14);
      (this.foam.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - k);
      this.foam.visible = k < 1;
      if (k >= 1) this.foamT = -1;
    }
  }

  private get isLaunch(): boolean { return this.launchNo % 2 === 0; }

  onEvent(id: string, yardSec: number): void {
    switch (id) {
      case 'launch-t30':
        this.cues.siren();
        break;
      case 'launch-go': {
        this.launchNo++;
        this.mode = 'run';
        this.v = 0;
        this.cues.siren();
        this.cues.rumble(9);
        this.cues.waysGroan(7);
        break;
      }
      case 'launch-recradle': {
        if (this.mode === 'idle' && this.d > 0.01) this.mode = 'return';
        break;
      }
      default: break;
    }
    void yardSec;
  }

  update(dt: number, waterY: number): void {
    const hull = this.k.hullGroup;
    const cradle = this.k.cradleGroup;
    this.stepSpray(dt, waterY);

    switch (this.mode) {
      case 'run': {
        this.v = Math.min(this.v + 1.15 * dt, 3.7);
        this.d += this.v * dt;
        if (this.d >= RUN_Z) {
          this.d = RUN_Z;
          const pos: Pos = { x: WAY2_X, y: waterY + 1, z: hull.position.z + 8 };
          this.cues.splash(pos);
          this.burst(WAY2_X, waterY + 0.3, hull.position.z + 12);
          if (this.isLaunch) {
            window.setTimeout(() => this.cues.hornChorus(), 900);
            window.setTimeout(() => this.say(PA_LINES['launch-go-launch']), 2400);
            this.mode = 'drift';
            this.settleV = 0;
          } else {
            window.setTimeout(() => this.say(PA_LINES['launch-go-rehearsal']), 2000);
            this.mode = 'hold';
            this.holdT = 0;
          }
        }
        break;
      }
      case 'hold': {
        this.v = damp(this.v, 0, 3, dt);
        this.d += this.v * dt;
        this.holdT += dt;
        if (this.holdT > 22) this.mode = 'return';
        break;
      }
      case 'return': {
        this.v = damp(this.v, -1.1, 2, dt);
        this.d += this.v * dt;
        if (this.d <= 0) { this.d = 0; this.v = 0; this.mode = 'idle'; }
        break;
      }
      case 'drift': {
        this.v = damp(this.v, 0, 0.35, dt);
        this.d += this.v * dt;              // she carries her way into the harbor
        hull.position.z = START_Z + this.d;
        break;
      }
      case 'idle':
        break;
    }

    const cradleD = Math.min(this.d, RUN_Z);
    cradle.position.z = START_Z + cradleD;

    if (this.mode === 'drift') {
      // settle into buoyancy with a bow rise and a decaying bob
      const floatY = waterY - 1.5; // light-ship draft
      this.settleV += (floatY - hull.position.y) * 3.2 * dt;
      this.settleV *= Math.exp(-1.6 * dt);
      hull.position.y += this.settleV * dt;
      hull.rotation.x = damp(hull.rotation.x, Math.sin(this.d * 7) * 0.02, 2.4, dt);
    } else {
      hull.position.z = START_Z + this.d;
      hull.position.y = keelY(START_Z + this.d) + 0.15;
      hull.rotation.x = -SLOPE;
    }
    hull.position.x = WAY2_X;
    void clamp;
  }
}
