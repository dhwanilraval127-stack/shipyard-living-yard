import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { hullTex, nameTex, stencilTex } from '../engine/tex';
import { hullGeometry } from './hull';
import type { Built, Collider } from './types';

/**
 * HULL 43 — completed, painted, ready, doing the only thing left to her:
 * waiting for 13:15. Launched (or rehearsed) from No.2 way.
 * Her group moves; the cradle follows until the water takes over.
 */

export const WAY2_X = -5;
const keelY = (z: number): number => 3.4 - (z - 12) / 16;
const SLOPE = Math.atan(1 / 16);

export interface KirstenBuilt extends Built {
  hullGroup: THREE.Group;
  cradleGroup: THREE.Group;
  /** meters the hull sits below its cradle rest when afloat */
  floatDrop: number;
}

export function buildKirsten(): KirstenBuilt {
  const group = new THREE.Group();
  const hullGroup = new THREE.Group();
  const cradleGroup = new THREE.Group();
  group.add(hullGroup, cradleGroup);

  const hullMat = std('k43-hull', {
    map: hullTex({ topside: '#23282c', boot: '#5c2320', bottom: '#3a2a28', rust: 0.06, scum: false, draft: true }),
    color: 0xd4d7d9, roughness: 0.45, metalness: 0.3,
  });
  const b = new Batch();
  b.geo(hullMat, hullGeometry({ L: 46, B: 10, D: 4.4, sheer: 0.1, bowLen: 0.3, sternLen: 0.13, transomW: 0.4 }));

  const houseMat = std('k43-house', { color: 0xc9c7c0, roughness: 0.5, metalness: 0.3 });
  b.box(houseMat, 7.6, 2.9, 6.2, 0, 5.85, -15.5);
  b.box(houseMat, 5.6, 2.5, 4.4, 0, 8.5, -16.5);
  b.box(M.glassDark, 5.7, 0.75, 4.46, 0, 8.95, -16.5);
  for (const s of [-1, 1]) b.box(M.glassDark, 0.06, 0.75, 3.9, s * 2.86, 8.95, -16.5);
  b.cyl(M.steelDark, 0.08, 0.11, 8.5, 0, 13.4, -16.5, 6);
  b.strut(M.steelDark, 0, 16.2, -16.5, 1.9, 15.2, -16.5, 0.05);
  b.strut(M.steelDark, 0, 16.2, -16.5, -1.9, 15.2, -16.5, 0.05);
  b.box(M.steelDark, 11, 0.9, 6.6, 0, 4.85, -2);      // hatch coaming
  b.box(M.steelDark, 11.6, 0.18, 7.2, 0, 5.35, -2);   // hatches
  b.box(M.steelFresh, 0.9, 0.4, 46, 0, -0.1, 0);      // keel
  b.build(hullGroup);

  // name boards
  const nameMat = new THREE.MeshStandardMaterial({
    map: nameTex('KIRSTEN', 'JERNVIK'), transparent: true, alphaTest: 0.06, roughness: 0.5, metalness: 0.3,
  });
  for (const s of [-1, 1]) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 1.25), nameMat);
    d.position.set(s * 4.58, 3.0, 8);
    d.rotation.y = (s * Math.PI) / 2 - Math.PI / 2;
    hullGroup.add(d);
  }
  const noMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['HULL 43'], 'rgba(233,228,216,0.9)'), transparent: true, alphaTest: 0.05, roughness: 0.5,
  });
  const no = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), noMat);
  no.position.set(0, 5.1, 20.8);
  hullGroup.add(no);

  // cradle under the hull
  const cb = new Batch();
  for (let z = 14; z <= 60; z += 2.9) {
    const ky = keelY(z);
    cb.box(M.concrete, 1.6, 0.9, 1.2, 0, 0.45, z);
    cb.box(M.timber, 1.8, 0.3, 1.3, 0, 1.05, z, 0, -SLOPE);
    cb.box(M.timber, 1.5, 0.26, 1.1, 0, ky - 0.3, z, 0, -SLOPE);
    if (z % 8.7 < 2.9) {
      for (const s of [-1, 1]) cb.strut(M.timber, s * 2.6, 0.6, z, s * 4.1, ky + 1.0, z, 0.1);
    }
  }
  // launching trigger column at the head of the way
  cb.box(M.oxideDim, 0.4, 1.2, 0.4, 3.2, 0.6, 63);
  cb.build(cradleGroup);

  hullGroup.position.set(WAY2_X, keelY(37) + 0.15, 37);
  hullGroup.rotation.x = -SLOPE;
  cradleGroup.position.set(WAY2_X, 0, 37);

  const colliders: Collider[] = [{ x0: WAY2_X - 6.4, x1: WAY2_X + 6.4, z0: 12, z1: 62 }];

  return {
    group, colliders, hullGroup, cradleGroup,
    interactables: [], points: [],
    floatDrop: 2.6,
  };
}
