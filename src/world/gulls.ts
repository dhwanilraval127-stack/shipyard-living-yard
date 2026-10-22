import * as THREE from 'three/webgpu';
import { Rng } from '../engine/rng';

/** Gulls: six dark checks against the sky. Gone at night — that is when the yard belongs to the floods. */
export class Gulls {
  private im: THREE.InstancedMesh;
  private birds: Array<{ cx: number; cz: number; r: number; y: number; a: number; sp: number; bank: number }> = [];
  private rng = new Rng(55);

  constructor(scene: THREE.Scene) {
    // a simple check-mark: two swept wing boxes
    const g = new THREE.BoxGeometry(1.6, 0.04, 0.34);
    g.translate(0.8, 0, 0);
    const g2 = g.clone(); g2.rotateY(0.5);
    const g3 = g.clone(); g3.rotateY(Math.PI - 0.5); g3.translate(0, 0.06, 0);
    const merged = mergeSimple([g, g2, g3]);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2e3236, roughness: 0.9 });
    this.im = new THREE.InstancedMesh(merged, mat, 7);
    this.im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.im.frustumCulled = false;
    scene.add(this.im);
    for (let i = 0; i < 7; i++) {
      this.birds.push({
        cx: this.rng.range(-140, 140),
        cz: this.rng.range(66, 130),
        r: this.rng.range(14, 42),
        y: this.rng.range(16, 34),
        a: this.rng.range(0, Math.PI * 2),
        sp: this.rng.range(0.15, 0.35) * (this.rng.chance(0.8) ? 1 : -1),
        bank: 0,
      });
    }
  }

  update(dt: number, t: number, day: boolean): void {
    this.im.visible = day;
    if (!day) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const eu = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    this.birds.forEach((b, i) => {
      b.a += b.sp * dt;
      const x = b.cx + Math.cos(b.a) * b.r;
      const z = b.cz + Math.sin(b.a) * b.r;
      const y = b.y + Math.sin(t * 0.7 + i) * 1.6;
      eu.set(Math.sin(t * 9 + i) * 0.18, -b.a + (b.sp > 0 ? Math.PI / 2 : -Math.PI / 2), Math.sin(t * 5 + i) * 0.12);
      q.setFromEuler(eu);
      p.set(x, y, z);
      s.set(1, 1, 1);
      m.compose(p, q, s);
      this.im.setMatrixAt(i, m);
    });
    this.im.instanceMatrix.needsUpdate = true;
  }
}

function mergeSimple(gs: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const parts = gs.map((g) => (g.index ? g.toNonIndexed() : g));
  let total = 0;
  for (const g of parts) total += g.attributes.position.count;
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  let o = 0;
  for (const g of parts) {
    pos.set(g.attributes.position.array as Float32Array, o);
    nor.set(g.attributes.normal.array as Float32Array, o);
    o += g.attributes.position.count * 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.computeBoundingSphere();
  return out;
}
