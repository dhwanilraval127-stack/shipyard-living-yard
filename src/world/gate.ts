import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { signTex } from '../engine/tex';
import type { Built, Collider, Interactable, Hooks } from './types';

/** The gate. The only hard boundary the fiction needs, and it looks like one. */

export const GATE_LAMP = new THREE.Vector3(176, 3.4, -12);

export function buildGate(hooks: Hooks): Built {
  const group = new THREE.Group();
  const b = new Batch();

  // fence line east: posts + two rails, opening at z -20..-2
  const fenceRun = (z0: number, z1: number): void => {
    for (let z = z0; z <= z1; z += 3) {
      b.box(M.steelDark, 0.14, 2.2, 0.14, 176, 1.1, z);
    }
    b.box(M.steelDark, 0.08, 0.1, z1 - z0, 176, 1.7, (z0 + z1) / 2);
    b.box(M.steelDark, 0.08, 0.1, z1 - z0, 176, 0.9, (z0 + z1) / 2);
  };
  fenceRun(-60, -20.5);
  fenceRun(-1.5, 30);
  // north fence of the yard
  for (let x = -70; x <= 176; x += 4) {
    if (x > -152 && x < -96) continue; // overlook path gap
    b.box(M.steelDark, 0.14, 2.2, 0.14, x, 1.1, -90);
  }
  b.box(M.steelDark, 246, 0.08, 0.1, 53, 1.7, -90);
  b.box(M.steelDark, 246, 0.08, 0.1, 53, 0.9, -90);

  // gate pillars + beam
  b.box(M.oxide, 1.1, 4.6, 1.1, 176, 2.3, -20);
  b.box(M.oxide, 1.1, 4.6, 1.1, 176, 2.3, -2);
  b.box(M.concrete, 1.5, 0.5, 1.5, 176, 0.25, -20);
  b.box(M.concrete, 1.5, 0.5, 1.5, 176, 0.25, -2);
  b.build(group);

  // gate beam sign (both faces)
  const signMat = new THREE.MeshStandardMaterial({
    map: signTex(['JERNVIK', 'SHIPBUILDING & SALVAGE CO.'], { bg: '#23282c', fg: '#e9e4d8', w: 1024, size: 66, sub: ['EST. 1913'], border: 'none' }),
    roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.7, 18), signMat);
  beam.position.set(176, 5.2, -11);
  group.add(beam);

  // the quiet plaque under the beam
  const plaqueMat = new THREE.MeshStandardMaterial({
    map: signTex(['WE ONLY LAUNCH WHAT', 'WE CAN REMEMBER'], { bg: '#7a2e22', fg: '#e9e4d8', w: 512, size: 34, border: 'none' }),
    roughness: 0.7,
  });
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.05), plaqueMat);
  plaque.position.set(176.28, 3.6, -11);
  plaque.rotation.y = Math.PI / 2;
  group.add(plaque);

  // barrier arm (up, as ever for induction day)
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 6), std('barrier', { color: 0xc23b2a, roughness: 0.6 }));
  arm.position.set(176, 1.3, -8);
  arm.rotation.x = -1.25;
  group.add(arm);

  // timekeeper's office
  const oh = new Batch();
  const wall = std('office-wall', { color: 0x77746e, roughness: 0.85 });
  oh.box(M.concrete, 4.6, 0.25, 4.2, 172, 0.12, -11);
  oh.box(wall, 4.6, 3.0, 0.25, 172, 1.75, -13.0);
  oh.box(wall, 0.25, 3.0, 4.2, 169.8, 1.75, -11);
  oh.box(wall, 0.25, 3.0, 4.2, 174.2, 1.75, -11);
  oh.box(wall, 2.6, 3.0, 0.25, 170.7, 1.75, -9.0);   // south wall with door gap
  oh.box(M.steelDark, 4.8, 0.3, 4.4, 172, 3.4, -11); // roof
  oh.box(M.windowLit, 1.6, 1.0, 0.1, 172, 2.0, -12.9); // window, facing the yard
  oh.box(M.windowLit, 0.1, 1.0, 1.4, 174.15, 2.0, -11); // window, facing the gate
  oh.box(M.oxideDim, 0.9, 2.1, 0.1, 171.9, 1.05, -8.92); // door
  oh.build(group);

  // office + gate signs
  const offMat = new THREE.MeshStandardMaterial({
    map: signTex(['TIMEKEEPER'], { bg: '#7a2e22', fg: '#e9e4d8', w: 400, size: 40 }),
    roughness: 0.7,
  });
  const offSign = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.5), offMat);
  offSign.position.set(173.2, 2.9, -8.85);
  group.add(offSign);

  const visitorsMat = new THREE.MeshStandardMaterial({
    map: signTex(['ALL VISITORS REPORT', 'TO THE TIMEKEEPER'], { bg: '#23282c', fg: '#e9e4d8', w: 512, size: 34, border: 'none' }),
    roughness: 0.7,
  });
  const vSign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.15), visitorsMat);
  vSign.position.set(176.3, 2.3, -18.5);
  vSign.rotation.y = -Math.PI / 2;
  group.add(vSign);

  // gate lamp
  const lamp = new Batch();
  lamp.cyl(M.steelDark, 0.09, 0.12, 3.6, 173.5, 1.8, -6, 6);
  lamp.box(M.lampOn, 0.5, 0.3, 0.5, 173.5, 3.7, -6);
  lamp.build(group);

  const colliders: Collider[] = [
    { x0: 175.4, x1: 176.6, z0: -60, z1: -20.5 },
    { x0: 175.4, x1: 176.6, z0: -1.5, z1: 30 },
    { x0: 169.4, x1: 174.6, z0: -13.2, z1: -9.4 }, // office block (door is visual)
  ];

  const interactables: Interactable[] = [
    {
      id: 'doc:gate-plaque',
      pos: new THREE.Vector3(175.4, 3.4, -11),
      radius: 4.2,
      label: 'READ CAST PLAQUE — THE YARD MOTTO',
      act: () => hooks.doc('gate-plaque'),
    },
  ];

  return { group, colliders, interactables, points: [] };
}
