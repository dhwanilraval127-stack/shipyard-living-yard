import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { signTex, sitePlanTex } from '../engine/tex';
import { groundHeight } from './ground';
import { Rng } from '../engine/rng';
const rng2 = new Rng(2099);
const groundHeightAt = groundHeight;
import type { Built, Collider } from './types';

/**
 * The furniture of a working yard: bollards, lamps, flood masts, cones,
 * barrels, drums, the overlook bench, the quay jib crane. Density, not sprawl.
 */

export const LAMP_POS: THREE.Vector3[] = [];
export const FLOOD_MASTS: THREE.Vector3[] = [];

export function buildProps(): Built {
  const group = new THREE.Group();
  const b = new Batch();

  /* bollards + ladders + fenders along the quay */
  for (let x = 0; x <= 140; x += 14) {
    b.cyl(M.steelDark, 0.34, 0.42, 0.95, x, 0.47, 56.4, 10);
    b.cyl(M.steelDark, 0.5, 0.5, 0.22, x, 0.98, 56.4, 10);
    if (x % 42 === 0) {
      // ladder down the wall
      b.box(M.steel, 0.08, 3.2, 0.08, x + 0.3, -1.5, 57.9);
      b.box(M.steel, 0.08, 3.2, 0.08, x + 0.3, -1.5, 59.2);
      for (let y = -2.6; y <= 0.2; y += 0.4) b.box(M.steel, 0.06, 0.06, 1.2, x + 0.3, y, 58.55);
    }
  }
  // tire fenders on the quay wall
  for (let x = 6; x <= 140; x += 12) {
    b.cyl(M.rubber, 0.55, 0.55, 0.4, x, -1.0, 57.4, 12, Math.PI / 2, 0, 0);
  }

  /* lamp posts along the main road */
  for (let x = -60; x <= 170; x += 34) {
    b.cyl(M.steelDark, 0.09, 0.13, 7, x, 3.5, -16, 6);
    b.box(M.steelDark, 1.6, 0.1, 0.1, x + 0.7, 6.95, -16);
    b.box(M.lampOn, 0.55, 0.16, 0.3, x + 1.3, 6.85, -16);
    LAMP_POS.push(new THREE.Vector3(x + 1.3, 6.7, -16));
  }
  // quay lamps
  for (const x of [20, 90]) {
    b.cyl(M.steelDark, 0.09, 0.13, 6, x, 3, 50, 6);
    b.box(M.lampOn, 0.5, 0.16, 0.3, x, 6.05, 50);
    LAMP_POS.push(new THREE.Vector3(x, 5.9, 50));
  }

  /* flood masts */
  const mast = (x: number, z: number, y = 0): void => {
    const gy = y;
    b.cyl(M.steelDark, 0.16, 0.26, 16, x, gy + 8, z, 8);
    b.box(M.steelDark, 3.4, 0.24, 0.3, x, gy + 15.8, z);
    for (const dx of [-1.2, 0, 1.2]) b.box(M.floodHead, 0.55, 0.4, 0.35, x + dx, gy + 15.4, z + 0.25);
    b.box(M.concrete, 1.4, 0.6, 1.4, x, gy + 0.3, z);
    FLOOD_MASTS.push(new THREE.Vector3(x + 0.2, gy + 15.2, z + 1.4));
  };
  mast(-22, 12);          // the ways
  mast(-100, 6);          // the cut
  mast(60, 48);           // the quay
  mast(30, -44, 0);       // workshop apron

  /* traffic cones */
  const coneMat = std('cone', { color: 0xd4581c, roughness: 0.7 });
  const coneAt = (x: number, z: number): void => {
    b.cyl(coneMat, 0.05, 0.24, 0.75, x, 0.375, z, 8);
    b.box(coneMat, 0.5, 0.05, 0.5, x, 0.025, z);
  };
  for (let i = 0; i < 5; i++) coneAt(-88 + i * 2.2, 6 + (i % 2) * 2.4);
  coneAt(-30, 10); coneAt(-27, 12); coneAt(-33, 8);

  /* barrels & drums */
  const barrel = (x: number, z: number, m = M.rust): void => {
    b.cyl(m, 0.32, 0.32, 0.95, x, 0.475, z, 10);
    b.cyl(m, 0.34, 0.34, 0.06, x, 0.62, z, 10);
    b.cyl(m, 0.34, 0.34, 0.06, x, 0.3, z, 10);
  };
  for (let i = 0; i < 5; i++) barrel(54 + (i % 3) * 0.9, -48.5 + Math.floor(i / 3) * 0.9);
  barrel(-96, 14); barrel(-95.1, 14.4); barrel(-95.4, 13.3);
  barrel(60, 22); barrel(61, 22.8);

  /* cable drums */
  const drum = (x: number, z: number, r: number): void => {
    b.cyl(M.timber, r, r, r * 0.9, x, r, z, 14, Math.PI / 2, 0, 0);
    b.cyl(M.timber, r * 0.45, r * 0.45, r * 1.05, x, r, z, 12, Math.PI / 2, 0, 0);
  };
  drum(52, -44, 1.2); drum(55, -42, 0.9);

  /* scrap & girder pile between the ways and the cut */
  const girder = std('girder', { color: 0x5c5148, roughness: 0.85, metalness: 0.3 });
  for (let i = 0; i < 7; i++) {
    b.box(girder, 0.5, 0.5, 9 + (i % 3), -62 + i * 0.9, 0.35 + Math.floor(i / 2) * 0.55, 26 + (i % 4) * 1.8, (i % 3 - 1) * 0.14);
  }
  for (let i = 0; i < 4; i++) b.box(M.rust, 5.5, 0.1, 2.2, -68, 0.15 + i * 0.12, 38 + i * 0.1, 0.2);

  /* hazard tape line at the entrance to the Cut */
  const tapeMat = std('tape', { color: 0xe8641b, roughness: 0.8, side: THREE.DoubleSide });
  b.box(M.steelDark, 0.08, 1.1, 0.08, -89, 0.55, 4);
  b.box(M.steelDark, 0.08, 1.1, 0.08, -89, 0.55, 16);
  const tape = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 0.24), tapeMat);
  tape.position.set(-89, 0.98, 10);
  tape.rotation.y = Math.PI / 2;
  tape.rotation.x = 0.03;
  group.add(tape);
  const liveMat = new THREE.MeshStandardMaterial({
    map: signTex(['LIVE WORKS', 'PERMIT REQUIRED'], { bg: '#23282c', fg: '#e8641b', w: 380, size: 38 }),
    roughness: 0.7, side: THREE.DoubleSide,
  });
  const live = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.5), liveMat);
  live.position.set(-88.4, 1.5, 10);
  live.rotation.y = -Math.PI / 2;
  group.add(live);

  /* quay jib crane — KAI 3 */
  b.cyl(M.oxideDim, 0.5, 0.65, 9, 110, 4.5, 48, 10);
  b.box(M.oxide, 0.9, 0.9, 8.5, 110, 9.6, 51.5, 0, -0.18);
  b.strut(M.oxide, 110, 13.2, 48.5, 110, 12.6, 54.5, 0.09);
  b.box(M.steelDark, 1.4, 1.2, 1.6, 110, 8.4, 48.4);
  b.strut(M.steelDark, 110, 9.0, 54.8, 110, 1.0, 54.8, 0.03);
  b.cyl(M.steelDark, 0.3, 0.3, 0.3, 110, 0.4, 54.8, 8);
  b.build(group);
  const kaiMat = new THREE.MeshStandardMaterial({
    map: signTex(['KAI 3'], { bg: '#7a2e22', fg: '#e9e4d8', w: 300, size: 52, border: 'none' }),
    roughness: 0.7,
  });
  const kai = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), kaiMat);
  kai.position.set(109.4, 6.4, 48);
  kai.rotation.y = -Math.PI / 2;
  group.add(kai);

  /* ways head: winch house between the two ways + way-end furniture */
  const roofMat = std('props-roof', { color: 0x4d5357, roughness: 0.8, metalness: 0.45 });
  const winchWall = std('winch-wall', { color: 0x6a6f73, roughness: 0.8, metalness: 0.35 });
  b.box(winchWall, 4.5, 3.0, 3.4, -22.5, 1.5, 6);
  b.box(roofMat, 5.1, 0.25, 4.0, -22.5, 3.15, 6);
  b.box(M.glassDark, 0.1, 0.8, 1.4, -20.2, 1.9, 6);
  // winch drums exposed under the canopy
  b.cyl(M.steelDark, 0.5, 0.5, 2.6, -22.5, 0.8, 8.6, 10, 0, Math.PI / 2);
  // wire ropes running down the ways to the cradles
  b.strut(M.steelDark, -21.6, 0.8, 9.8, -39, 1.2, 15.5, 0.025);
  b.strut(M.steelDark, -23.4, 0.8, 9.8, -4, 1.2, 15.5, 0.025);
  // way-end bollards + grade posts
  for (const [bx, bz] of [[-47, 62], [-33, 62], [-12, 62], [2, 62]] as const) {
    b.cyl(M.steelDark, 0.26, 0.32, 0.9, bx, 0.45, bz, 10);
  }
  for (const [px2, pz2] of [[-52, 30], [-52, 46], [7, 30], [7, 46]] as const) {
    b.box(M.oxideDim, 0.14, 1.3, 0.14, px2, 0.65, pz2);
    b.box(M.paper, 0.16, 0.5, 0.16, px2, 1.1, pz2);
  }

  /* overlook: bench, plan board, marker, lamp */
  const ovY = 15.4; // approx mound height at the seat
  b.box(M.timber, 2.6, 0.12, 0.55, -125, ovY + 0.55, -128);
  b.box(M.timber, 2.6, 0.5, 0.1, -125, ovY + 0.95, -128.3);
  for (const dx of [-1.0, 1.0]) b.box(M.steelDark, 0.12, 0.55, 0.5, -125 + dx, ovY + 0.28, -128);
  b.cyl(M.steelDark, 0.09, 0.12, 4.5, -127.8, ovY + 2.25, -127.5, 6);
  b.box(M.lampOn, 0.45, 0.22, 0.3, -127.8, ovY + 4.55, -127.5);
  LAMP_POS.push(new THREE.Vector3(-127.8, ovY + 4.4, -127.5));
  b.build(group);

  const planMat = new THREE.MeshStandardMaterial({ map: sitePlanTex(), roughness: 0.8 });
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.3), planMat);
  plan.position.set(-121.5, ovY + 2.1, -126.8);
  plan.rotation.y = 0.28;
  group.add(plan);
  for (const dx of [-1.9, 1.9]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.4, 0.14), M.timber);
    post.position.set(-121.5 + dx, ovY + 1.55, -126.9);
    group.add(post);
  }
  const ovSignMat = new THREE.MeshStandardMaterial({
    map: signTex(['OVERLOOK'], { bg: '#23282c', fg: '#e9e4d8', w: 420, size: 46, border: 'none' }),
    roughness: 0.7,
  });
  const ovSign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.7), ovSignMat);
  ovSign.position.set(-121.5, ovY + 4.15, -126.7);
  ovSign.rotation.y = 0.28;
  group.add(ovSign);

  /* the old light — a skeletal beacon on the mound's crown */
  const lx = -112, lz = -146;
  const ovLampY = 15.4;
  // pad
  b.box(M.concrete, 5, 0.4, 5, lx, ovLampY + 0.2, lz);
  // four raking legs
  const legs: [number, number][] = [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]];
  for (const [dx, dz] of legs) {
    b.strut(M.oxideDim, lx + dx, ovLampY + 0.4, lz + dz, lx + dx * 0.45, ovLampY + 9.5, lz + dz * 0.45, 0.11);
  }
  // rings
  for (const h of [3.2, 6.4]) {
    for (let a = 0; a < 4; a++) {
      const ax = lx + Math.cos((a * Math.PI) / 2) * (1.6 - (h / 9.5) * 0.88);
      const az = lz + Math.sin((a * Math.PI) / 2) * (1.6 - (h / 9.5) * 0.88);
      const bx2 = lx + Math.cos(((a + 1) * Math.PI) / 2) * (1.6 - (h / 9.5) * 0.88);
      const bz2 = lz + Math.sin(((a + 1) * Math.PI) / 2) * (1.6 - (h / 9.5) * 0.88);
      b.strut(M.oxideDim, ax, ovLampY + h, az, bx2, ovLampY + h, bz2, 0.06);
      b.strut(M.oxideDim, ax, ovLampY + h, az, lx + Math.cos((a * Math.PI) / 2) * (1.6 - ((h + 3.2) / 9.5) * 0.88), ovLampY + h + 3.2, lz + Math.sin((a * Math.PI) / 2) * (1.6 - ((h + 3.2) / 9.5) * 0.88), 0.05);
    }
  }
  // lamp cage
  b.box(M.oxideDim, 1.5, 0.25, 1.5, lx, ovLampY + 9.8, lz);
  b.box(M.windowLit, 1.1, 1.0, 1.1, lx, ovLampY + 10.4, lz);
  b.box(M.oxideDim, 1.5, 0.2, 1.5, lx, ovLampY + 11.0, lz);
  // ladder
  for (const dx of [-0.25, 0.25]) b.strut(M.steelDark, lx + dx, ovLampY + 0.4, lz + 1.05, lx + dx, ovLampY + 9.6, lz + 1.05, 0.03);
  for (let y = 1; y < 9.5; y += 0.45) b.box(M.steelDark, 0.55, 0.04, 0.04, lx, ovLampY + y, lz + 1.05);
  LAMP_POS.push(new THREE.Vector3(lx, ovLampY + 10.4, lz));

  /* scrub on the mound: dark wind-cut patches */
  const scrubMat = std('scrub', { color: 0x4a4c40, roughness: 1, metalness: 0 });
  for (let i = 0; i < 26; i++) {
    const a = rng2.range(0, Math.PI * 2);
    const r = rng2.range(6, 34);
    const sx = -125 + Math.cos(a) * r;
    const sz = -138 + Math.sin(a) * r * 0.8;
    const sy = groundHeightAt(sx, sz);
    if (sy < 1.2) continue;
    b.box(scrubMat, rng2.range(1.2, 3.4), 0.25, rng2.range(1.2, 3.4), sx, sy + 0.08, sz, rng2.range(0, 3));
  }
  // path scar from the yard gate side up to the bench
  const pathMat = std('path', { color: 0x8a8274, roughness: 1, metalness: 0 });
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const px3 = -125 + t * 26;
    const pz3 = -128 + t * -14;
    const py3 = groundHeightAt(px3, pz3);
    b.box(pathMat, 2.6 - t * 1.2, 0.14, 2.2, px3, py3 + 0.05, pz3, 0.3 * Math.sin(t * 5));
  }

  const colliders: Collider[] = [
    { x0: 108.4, x1: 111.6, z0: 46.4, z1: 49.6 },   // KAI 3 column
    { x0: -127, x1: -124, z0: -129.5, z1: -126.5 }, // overlook bench
    { x0: -114.5, x1: -109.5, z0: -148.5, z1: -143.5 }, // light pad
  ];

  return { group, colliders, interactables: [], points: [] };
}
