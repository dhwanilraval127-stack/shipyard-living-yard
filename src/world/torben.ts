import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { stencilTex } from '../engine/tex';
import type { Built, Collider, Interactable, Hooks } from './types';

/**
 * TORBEN — the yard tractor, T-1. He exists to communicate weight and
 * willingness. In this slice he is parked by the quay with his engine ticking
 * over and his beacon turning; his driving day comes in a later phase.
 */

export function buildTorben(hooks: Hooks): Built & { update: (ctx: { t: number }) => void } {
  const group = new THREE.Group();
  const body = new Batch();

  const paint = std('torben-paint', { color: 0xc47f1f, roughness: 0.55, metalness: 0.35 }); // worn yard orange
  body.box(M.steelDark, 3.4, 0.5, 1.9, 0, 0.55, 0);                 // chassis
  body.box(paint, 1.5, 1.0, 1.7, -1.0, 1.25, 0);                    // hood
  body.box(paint, 1.3, 0.16, 1.7, 0.35, 1.05, 0);                   // floor
  body.box(M.rubber, 0.6, 0.14, 1.5, 0.35, 1.14, 0);               // seat
  body.box(M.rubber, 0.16, 0.7, 1.5, 0.95, 1.5, 0);                // seat back
  // roll frame
  for (const [fx, fz] of [[1.0, 0.75], [1.0, -0.75], [-0.15, 0.75], [-0.15, -0.75]] as const) {
    body.strut(M.steelDark, fx, 1.1, fz, fx, 2.6, fz, 0.05);
  }
  body.box(M.steelDark, 1.3, 0.08, 1.6, 0.42, 2.62, 0);
  // wheels
  body.cyl(M.rubber, 0.52, 0.52, 0.4, -1.05, 0.52, 0.95, 12, 0, Math.PI / 2);
  body.cyl(M.rubber, 0.52, 0.52, 0.4, -1.05, 0.52, -0.95, 12, 0, Math.PI / 2);
  body.cyl(M.rubber, 0.38, 0.38, 0.32, 1.15, 0.38, 0.85, 10, 0, Math.PI / 2);
  body.cyl(M.rubber, 0.38, 0.38, 0.32, 1.15, 0.38, -0.85, 10, 0, Math.PI / 2);
  // beacon
  body.cyl(std('torben-beacon', { color: 0x7a3a10, roughness: 0.4, emissive: 0xe8641b, emissiveIntensity: 0.6 }),
    0.11, 0.13, 0.22, -0.15, 2.75, 0, 8);
  // hitch
  body.box(M.steelDark, 0.3, 0.3, 0.5, -1.85, 0.55, 0);
  body.build(group);

  const side = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 0.5),
    new THREE.MeshStandardMaterial({
      map: stencilTex(['T-1 TORBEN'], 'rgba(240,236,226,0.9)'), transparent: true, alphaTest: 0.05, roughness: 0.7,
    }),
  );
  side.position.set(-1.0, 1.3, 0.86);
  group.add(side);

  group.position.set(70, 0, 26);
  group.rotation.y = 2.4;
  group.updateMatrixWorld(true);

  const interactables: Interactable[] = [
    {
      id: 'torben-horn',
      pos: new THREE.Vector3(70, 1.2, 26),
      radius: 3.4,
      label: 'SOUND THE HORN — TORBEN T-1',
      act: () => hooks.torbenHorn(),
    },
  ];
  const colliders: Collider[] = [{ x0: 67.8, x1: 72.2, z0: 23.8, z1: 28.2 }];

  const beacon = std('torben-beacon');
  const update = (ctx: { t: number }): void => {
    beacon.emissiveIntensity = 0.35 + 0.45 * (Math.sin(ctx.t * 4.2) > 0.2 ? 1 : 0.1);
  };

  return { group, colliders, interactables, points: [], update };
}
