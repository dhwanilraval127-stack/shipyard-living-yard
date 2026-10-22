import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { signTex, hazardTex } from '../engine/tex';
import type { Built, Collider } from './types';
import { easeInOut } from '../utils/math';

/**
 * GOLIATH — 600 t gantry straddling both ways. She travels when the clock
 * tells her to (10:00 out, 15:00 home), otherwise she stands and holds the
 * skyline. The yard's vertical exclamation mark. The only one.
 */

const RAIL_Z = [2, 22];
const H = 30;

export interface CraneBuilt extends Built {
  x: number;
  goliathUpdate: (ctx: { yardSec: number }) => void;
}

export function buildCrane(): CraneBuilt {
  const group = new THREE.Group();
  const gantry = new THREE.Group();
  group.add(gantry);

  // rails
  const b = new Batch();
  for (const z of RAIL_Z) {
    b.box(M.steelDark, 112, 0.5, 0.9, -25, 0.45, z);
    for (let x = -78; x <= 28; x += 6) b.box(M.timber, 0.5, 0.35, 2.6, x, 0.17, z);
  }
  b.build(group);

  const g = new Batch();
  const HAZ = std('crane-hazard', { map: hazardTex(), color: 0xcabf9d, roughness: 0.75 });
  // columns on both rails (two chords each, latticed)
  for (const z of RAIL_Z) {
    for (const dx of [-1.6, 1.6]) g.box(M.oxide, 0.9, H, 0.9, dx, H / 2, z);
    // lattice between chords
    for (let y = 3; y < H; y += 3.4) {
      g.strut(M.oxide, -1.6, y, z, 1.6, y + 3.4, z, 0.06);
      g.strut(M.oxide, 1.6, y + 3.4, z, -1.6, y + 3.4 - 3.4, z, 0.06);
    }
    // bogies
    for (const dx of [-1.6, 1.6]) {
      g.box(M.steelDark, 2.4, 1.0, 3.4, dx, 0.5, z);
      for (const wz of [-1.0, 1.0]) g.cyl(M.rubber, 0.45, 0.45, 0.4, dx, 0.45, z + wz, 10, 0, Math.PI / 2);
    }
    g.box(HAZ, 3.2, 2.2, 0.3, 0, 1.3, z + (z > 12 ? 1.85 : -1.85));
  }
  // cross beam + ties
  g.box(M.oxide, 3.4, 2.6, 26, 0, H + 0.6, 12);
  g.strut(M.oxide, -1.2, 6, 2, -1.2, H - 1, 2, 0.14);
  g.strut(M.oxide, 1.2, 6, 2, 1.2, H - 1, 2, 0.14);
  g.strut(M.oxide, -1.2, 6, 22, -1.2, H - 1, 22, 0.14);
  g.strut(M.oxide, 1.2, 6, 22, 1.2, H - 1, 22, 0.14);
  // machinery house + cab
  g.box(std('crane-house', { color: 0x6e7377, roughness: 0.6, metalness: 0.5 }), 4.6, 3.2, 5.2, 0, H + 3.5, 18);
  g.box(std('crane-cab', { color: 0x62686c, roughness: 0.55, metalness: 0.5 }), 2.4, 2.2, 2.6, 1.9, H - 2.4, 4.4);
  g.box(M.glassDark, 2.5, 1.0, 2.7, 1.9, H - 2.2, 4.4);
  // trolley + hook over way 2
  g.box(M.steelDark, 2.8, 1.8, 2.2, 0, H - 0.7, 12);
  g.cyl(M.rubber, 0.5, 0.5, 0.3, 0, H - 1.8, 12, 10, Math.PI / 2, 0);
  // hook line
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 12, 4), M.steelDark);
  line.position.set(0, H - 7.2, 12);
  gantry.add(line);
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.09, 6, 12), M.steelDark);
  hook.position.set(0, H - 13.3, 12);
  hook.rotation.y = Math.PI / 2;
  gantry.add(hook);
  g.build(gantry);

  // GOLIATH name boards
  const nameM = new THREE.MeshStandardMaterial({
    map: signTex(['GOLIATH', '600 t'], { bg: '#23282c', fg: '#e9e4d8', w: 700, size: 58, border: 'none' }),
    roughness: 0.6, metalness: 0.4, side: THREE.DoubleSide,
  });
  for (const s of [-1, 1]) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 2.4), nameM);
    d.position.set(s * 1.78, H + 0.7, 12);
    d.rotation.y = (s * Math.PI) / 2;
    gantry.add(d);
  }

  gantry.position.set(-18, 0, 0);

  const colliders: Collider[] = [
    { x0: -21.5, x1: -14.5, z0: -1.5, z1: 5.5 },
    { x0: -21.5, x1: -14.5, z0: 18.5, z1: 25.5 },
  ];

  const update = (ctx: { yardSec: number }): void => {
    const t = ctx.yardSec;
    const dayT = t % 86400;
    // out at 10:00, home at 15:00 — 140 s of travel each way
    const T = 140;
    const run = (start: number): number => {
      if (dayT < start) return 0;
      if (dayT > start + T) return 1;
      return easeInOut((dayT - start) / T);
    };
    const out = run(10 * 3600);
    const back = run(15 * 3600);
    const x = -18 + out * 26 - back * 26;
    gantry.position.x = x;
    // slow breathing sway of the hook line
    line.rotation.z = Math.sin(t * 0.7) * 0.012;
    hook.position.x = Math.sin(t * 0.7) * 0.14;
  };

  return { group, colliders, x: -18, interactables: [], points: [], goliathUpdate: update };
}
