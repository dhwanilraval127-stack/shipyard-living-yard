import * as THREE from 'three/webgpu';
import { Batch, M, std, registry } from '../engine/mat';
import { stencilTex, signTex, primerTex } from '../engine/tex';
import type { Built, Collider, Interactable, AmbientPoint, Hooks } from './types';

/**
 * HULL 44 — the new life. Keel laid this spring on No.1 way, red-oxide plates
 * going on strake by strake, frames forward still open to the sky.
 * Aft: plated and clean. Forward: ribs. Between them: the surveyor's stamp.
 */

export const WAY1_X = -40;
const keelY = (z: number): number => 3.6 - (z - 16) / 16; // way incline 1:16
const SLOPE = Math.atan(1 / 16);

export function buildHull44(hooks: Hooks): Built {
  const group = new THREE.Group();
  const b = new Batch();

  const primerMat = std('h44-primer', { map: primerTex(), color: 0xd88a6e, roughness: 0.7, metalness: 0.22 });
  const plateMat = std('h44-plate', { color: 0xa88876, roughness: 0.7, metalness: 0.25 });
  /** plate hinged at its bottom edge: (xBottom, yBottom), height h, outward lean */
  const strake = (mat: THREE.Material, s: 1 | -1, xb: number, yb: number, h: number, lean: number, z0: number, len: number, thick = 0.14): void => {
    const ang = Math.atan2(lean, h);
    const cx = WAY1_X + s * (xb + (Math.sin(ang) * h) / 2);
    const cy = yb + (Math.cos(ang) * h) / 2;
    b.box(mat, thick, h, len, cx, cy, z0 + len / 2, 0, -SLOPE, -s * ang);
  };

  // keel plate + flat bottom, following the way
  b.box(M.steelFresh, 1.0, 0.16, 40, WAY1_X, keelY(36) + 0.06, 36, 0, -SLOPE);
  for (const dx of [-2.1, 2.1]) {
    b.box(primerMat, 3.1, 0.13, 40, WAY1_X + dx, keelY(36) + 0.02, 36, 0, -SLOPE);
  }
  // plating: flat bottom → bilge → topside, hinged at the bottom edge so the
  // shell is continuous. Aft half only (z 16..40); forward is open frames.
  for (const s of [-1, 1] as const) {
    strake(primerMat, s, 3.6, 0.1, 2.2, 0.42, 16, 24);          // bilge strake S-2
    strake(primerMat, s, 4.02, 2.3, 1.9, 0.18, 16, 24);         // topside strake S-4
    strake(plateMat, s, 4.06, 4.2, 0.5, 0.05, 16, 24, 0.1);     // sheer strake (grey steel)
    b.box(M.steelFresh, 0.06, 0.06, 24, WAY1_X + s * 4.0, 2.32, 28);   // seam line
    b.box(M.steelFresh, 0.06, 0.06, 24, WAY1_X + s * 4.08, 4.22, 28);  // seam line
  }
  // aft bulkhead + deck edge strip at 4.7
  b.box(primerMat, 8.0, 4.6, 0.16, WAY1_X, keelY(16.2) + 2.3, 16.2, 0, -SLOPE);
  b.box(M.steelFresh, 8.0, 0.12, 0.4, WAY1_X, keelY(40) + 4.72, 40, 0, -SLOPE);

  // open frames forward (z 41..55): the rib cage
  for (let z = 41.5; z <= 55; z += 1.9) {
    const ky = keelY(z);
    b.box(plateMat, 7.4, 0.16, 0.5, WAY1_X, ky + 0.1, z, 0, -SLOPE);         // floor
    for (const s of [-1, 1]) {
      b.box(plateMat, 0.16, 4.3, 0.42, WAY1_X + s * 3.78, ky + 2.2, z, 0, -SLOPE, -s * 0.16); // web to deck edge
      b.box(plateMat, 0.5, 0.14, 0.42, WAY1_X + s * 3.5, ky + 4.28, z, 0, -SLOPE);            // flange at deck
      b.box(M.steelFresh, 2.2, 0.1, 0.3, WAY1_X + s * 2.4, ky + 3.0, z, 0, -SLOPE);           // stringer stub
    }
    b.box(plateMat, 0.16, 1.4, 0.42, WAY1_X, ky + 0.9, z);                   // center vertical
  }

  // weld seams: fresh bright lines where plates meet
  for (let z = 20; z <= 40; z += 4) {
    for (const s of [-1, 1]) b.box(M.steelFresh, 0.05, 1.9, 0.06, WAY1_X + s * 4.3, keelY(z) + 3.2, z, 0, -SLOPE);
  }

  // hero plate: S-4, slightly proud on the walkway face
  const heroZ = 37, heroY = keelY(heroZ) + 3.15;
  b.box(primerMat, 0.22, 1.8, 3.6, WAY1_X - 4.22, heroY, heroZ, 0, -SLOPE);

  // cradle: keel blocks + timber caps + shores
  for (let z = 17; z <= 55; z += 2.6) {
    const ky = keelY(z);
    b.box(M.concrete, 1.5, 0.9, 1.1, WAY1_X, 0.45, z);
    b.box(M.timber, 1.7, 0.28, 1.2, WAY1_X, 1.02, z, 0, -SLOPE);
    b.box(M.timber, 1.4, 0.24, 1.0, WAY1_X, ky - 0.28, z, 0, -SLOPE);
    if (z % 7.8 < 2.6) {
      for (const s of [-1, 1]) {
        b.strut(M.timber, WAY1_X + s * 2.4, 0.6, z, WAY1_X + s * 3.5, ky + 1.1, z, 0.09);
      }
    }
  }

  // scaffold towers on the walkway side (west)
  const towerAt = (tz: number, h: number): void => {
    const w = 1.1, tx = WAY1_X - 6.2;
    for (const [lx, lz] of [[-w, -w], [w, -w], [-w, w], [w, w]] as const) {
      b.strut(M.steelFresh, tx + lx, 0, tz + lz, tx + lx, h, tz + lz, 0.05);
    }
    for (let y = 2; y <= h; y += 2) {
      b.box(M.steelFresh, w * 2 + 0.1, 0.07, 0.07, tx, y, tz - w);
      b.box(M.steelFresh, 0.07, 0.07, w * 2 + 0.1, tx - w, y, tz);
      b.box(M.steelFresh, 0.07, 0.07, w * 2 + 0.1, tx + w, y, tz);
      b.strut(M.steelFresh, tx - w, y - 2, tz - w, tx + w, y, tz + w, 0.03);
    }
    b.box(M.timber, w * 2 + 0.3, 0.06, w * 2 + 0.3, tx, 3.0, tz);
    b.box(M.timber, w * 2 + 0.3, 0.06, w * 2 + 0.3, tx, 5.4, tz);
  };
  towerAt(30, 6.5);
  towerAt(46, 5.5);

  // plate stacks on trestles on the WORKING side of the way (tomorrow's strakes)
  for (let i = 0; i < 3; i++) {
    const px = WAY1_X + 9.5, pz = 22 + i * 9;
    b.box(M.timber, 0.3, 0.9, 0.3, px - 2.4, 0.45, pz);
    b.box(M.timber, 0.3, 0.9, 0.3, px + 2.4, 0.45, pz);
    for (let k = 0; k < 3; k++) b.box(plateMat, 6.4, 0.09, 2.3, px, 1.0 + k * 0.11, pz);
  }

  b.build(group);

  // --- decals ---
  const stampMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['61204 B', 'SLAB 7']), transparent: true, alphaTest: 0.05, roughness: 0.85,
  });
  const stamp = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.9), stampMat);
  stamp.position.set(WAY1_X - 4.45, heroY + 0.2, heroZ - 0.4);
  stamp.rotation.y = -Math.PI / 2;
  stamp.updateMatrixWorld(true);
  group.add(stamp);

  const chalkMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['S-4', 'PL 118'], 'rgba(240,236,226,0.85)'), transparent: true, alphaTest: 0.05, roughness: 0.85,
  });
  const chalk = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), chalkMat);
  chalk.position.set(WAY1_X - 4.45, heroY - 1.35, heroZ + 0.9);
  chalk.rotation.y = -Math.PI / 2;
  group.add(chalk);

  const hullNoMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['HULL 44'], 'rgba(233,228,216,0.92)'), transparent: true, alphaTest: 0.05, roughness: 0.85,
  });
  const hullNo = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.0), hullNoMat);
  hullNo.position.set(WAY1_X - 4.35, keelY(22) + 3.4, 22);
  hullNo.rotation.y = -Math.PI / 2;
  group.add(hullNo);

  // way board sign at the foot of the way
  const boardMat = new THREE.MeshStandardMaterial({ map: signTex(['WAY 1 — HULL 44'], { bg: '#7a2e22', size: 40, w: 640 }), roughness: 0.8 });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.0), boardMat);
  board.position.set(WAY1_X - 8.4, 2.0, 18);
  board.rotation.y = Math.PI / 2;
  group.add(board);
  for (const dx of [-1.9, 1.9]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), M.timber);
    post.position.set(WAY1_X - 8.4 + dx, 1.2, 18.05);
    group.add(post);
  }

  // weld arc marker (emissive plate at the working seam; light handled by systems)
  const arcPlate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.5), M.weldArc);
  arcPlate.position.set(WAY1_X - 4.35, keelY(30) + 2.9, 30);
  group.add(arcPlate);
  registry.welds.push(arcPlate.material as THREE.MeshStandardMaterial);

  // --- interactables ---
  const interactables: Interactable[] = [
    {
      id: 'stamp:h44-s4',
      pos: new THREE.Vector3(WAY1_X - 5.2, heroY + 0.2, heroZ),
      radius: 5.4,
      label: 'RUB PLATE STAMP — STRAKE S-4',
      act: () => hooks.stamp('h44-s4'),
    },
    {
      id: 'doc:h44-board',
      pos: new THREE.Vector3(WAY1_X - 8.4, 2.0, 18),
      radius: 3.6,
      label: 'READ WAY BOARD — HULL 44',
      act: () => hooks.doc('h44-board'),
    },
    {
      id: 'stamp:h44-keel',
      pos: new THREE.Vector3(WAY1_X - 2.4, 1.9, 20),
      radius: 3.8,
      label: 'RUB PLATE STAMP — KEEL PLATE',
      act: () => hooks.stamp('h44-keel'),
    },
  ];
  // keel stamp decal near the aft keel
  const keelStampMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['58117 B'], 'rgba(240,236,226,0.85)'), transparent: true, alphaTest: 0.05, roughness: 0.85,
  });
  const keelStamp = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.55), keelStampMat);
  keelStamp.position.set(WAY1_X - 2.6, 2.35, 20);
  keelStamp.rotation.y = -Math.PI / 2;
  keelStamp.rotation.z = -SLOPE;
  group.add(keelStamp);

  const points: AmbientPoint[] = [
    { id: 'h44-weld', kind: 'weld', pos: new THREE.Vector3(WAY1_X - 3.9, keelY(30) + 2.2, 30) },
  ];

  const colliders: Collider[] = [
    { x0: WAY1_X - 4.6, x1: WAY1_X + 4.6, z0: 15.4, z1: 56 },
    { x0: WAY1_X + 6.8, x1: WAY1_X + 12.2, z0: 20, z1: 42 }, // plate stacks
  ];

  return { group, colliders, interactables, points };
}
