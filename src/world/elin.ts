import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { hullTex, nameTex, cuttingPlanTex, stencilTex } from '../engine/tex';
import { hullGeometry, mergeGeos } from './hull';
import type { Built, Collider, Interactable, AmbientPoint, Hooks } from './types';

/**
 * MV ELIN — the old life. A 56 m coaster, laid down 1961, delivered to the
 * beach under her own steam. Cut open amidships, strake B coming out to stock.
 * Aged, scarred, actively worked on. Not abandoned. Never abandoned.
 */

export const ELIN_POS = { x: -134, y: -2.7, z: 38, yaw: 0.28, pitch: -0.028 }; // bow south, to the sea

export function buildElin(hooks: Hooks): Built {
  const group = new THREE.Group();
  const ship = new THREE.Group();
  group.add(ship);

  const hullMat = std('elin-hull', {
    map: hullTex({
      topside: '#63382a', boot: '#241d18', bottom: '#4a2620',
      rust: 0.85, scum: true, draft: true,
    }),
    color: 0xd8d2ca, roughness: 0.9, metalness: 0.18,
  });
  (hullMat.map as THREE.Texture).wrapS = THREE.RepeatWrapping;

  const b = new Batch();

  // two lofted sections with the cut gap between (local z: 2..6 is open)
  const aft = hullGeometry({ L: 30, B: 9.4, D: 4.6, sheer: 0.08, bowLen: 0.10, sternLen: 0.16, transomW: 0.42 });
  const fore = hullGeometry({ L: 20, B: 9.4, D: 4.6, sheer: 0.12, bowLen: 0.42, sternLen: 0.04, transomW: 0.42 });
  // shift sections so the gap sits at local z 2..6
  const aftShift = aft.clone(); aftShift.translate(0, 0, -13);  // stern at -28 → +2
  const foreShift = fore.clone(); foreShift.translate(0, 0, 16); // → +6..+26
  aft.dispose(); fore.dispose();
  b.geo(hullMat, mergeGeos([aftShift, foreShift]));

  // cut framing in the gap
  const frameXs = [-3.4, 3.4];
  for (const zz of [2.6, 4.0, 5.4]) {
    b.box(M.steelDark, 7.2, 0.16, 0.45, 0, 0.15, zz);              // bottom transverse
    for (const fx of frameXs) {
      b.box(M.steelDark, 0.2, 3.9, 0.4, fx, 2.1, zz);              // side webs
      b.box(M.steelDark, 0.55, 0.14, 0.4, fx, 4.15, zz);           // top flange
    }
    b.box(M.steelDark, 0.2, 0.35, 0.4, 0, 2.1, zz);                // center vertical
  }
  b.box(M.steelDark, 8.4, 0.14, 4.2, 0, 4.32, 4);                  // open deck strip across gap

  // bright cut edges at both cut planes
  for (const zz of [2.02, 5.98]) {
    for (const fx of [-3.48, 3.48]) b.box(M.cutEdge, 0.14, 4.1, 0.12, fx, 2.05, zz);
    b.box(M.cutEdge, 7.0, 0.12, 0.12, 0, 4.14, zz);
    b.box(M.cutEdge, 7.0, 0.1, 0.12, 0, 0.06, zz);
  }

  // rubbing strake + deck fittings
  for (const s of [-1, 1]) {
    b.box(M.steelDark, 0.3, 0.34, 47, s * 4.05, 2.55, -1);
  }
  b.box(M.steelDark, 12, 1.0, 7.4, 0, 4.85, -7);                   // hatch coaming
  b.box(M.steelDark, 12.6, 0.2, 8, 0, 5.4, -7);                    // hatch covers (parked open as plates)
  // kingpost + derricks
  b.cyl(M.steelDark, 0.22, 0.26, 9.5, 0, 8.9, -2, 8);
  b.strut(M.steelDark, 0, 12.4, -2, 0, 6.4, 8, 0.12);              // derrick over the cut
  b.strut(M.steelDark, 0, 12.4, -2, 2.8, 5.2, -12, 0.12);          // derrick stowed aft
  b.strut(M.rust, 0, 6.4, 8, 0, 4.4, 4.4, 0.02);                   // falling wire to the cut
  // winch
  b.box(M.rust, 1.6, 1.2, 2.2, 0, 5.0, -12.5);

  // stern superstructure
  const houseMat = std('elin-house', { color: 0xa8aaa4, roughness: 0.75, metalness: 0.25 });
  b.box(houseMat, 8.6, 3.0, 6.8, 0, 6.0, -21.5);
  b.box(houseMat, 6.4, 2.6, 5.0, 0, 8.8, -22.5);
  // windows: dark glass bands + one lit at night
  b.box(M.glassDark, 6.5, 0.8, 5.06, 0, 9.3, -22.5);
  for (const s of [-1, 1]) b.box(M.glassDark, 0.06, 0.8, 4.4, s * 3.26, 9.3, -22.5);
  b.box(M.glassDark, 8.66, 0.9, 6.86, 0, 6.6, -21.5);
  // funnel + vents
  b.cyl(std('elin-funnel', { color: 0x54443a, roughness: 0.85, metalness: 0.2 }), 0.75, 0.9, 2.8, 0, 8.9, -17, 10);
  for (const dx of [-1.6, 1.6]) b.cyl(M.rust, 0.28, 0.34, 0.9, dx, 4.75, -14.5, 8);
  // mast on wheelhouse
  b.cyl(M.steelDark, 0.09, 0.12, 9, 0, 14.4, -22.5, 6);
  b.strut(M.steelDark, 0, 17.5, -22.5, 2.2, 16.4, -22.5, 0.05);
  b.strut(M.steelDark, 0, 17.5, -22.5, -2.2, 16.4, -22.5, 0.05);

  // keel line visible along the beach
  b.box(M.rust, 0.9, 0.5, 52, 0, -0.15, -1);

  b.build(ship);

  // --- decals (own meshes) ---
  const nameMat = new THREE.MeshStandardMaterial({
    map: nameTex('ELIN', 'JERNVIK'), transparent: true, alphaTest: 0.06, roughness: 0.8, metalness: 0.1,
  });
  for (const s of [-1, 1]) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), nameMat);
    d.position.set(s * 4.44, 3.15, -13);
    d.rotation.y = (s * Math.PI) / 2 - Math.PI / 2;
    ship.add(d);
  }
  const stampMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['61204 B', 'PL 118']), transparent: true, alphaTest: 0.05, roughness: 0.9,
  });
  const stampDecal = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.1), stampMat);
  stampDecal.position.set(4.18, 2.6, 4.6);
  stampDecal.rotation.y = Math.PI / 2;
  stampDecal.rotation.z = -0.05;
  ship.add(stampDecal);
  // chalk marks on the plate next to the cut
  const chalkMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['KEEP', 'STAMP'], 'rgba(230,225,214,0.8)'), transparent: true, alphaTest: 0.05, roughness: 0.9,
  });
  const chalk = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), chalkMat);
  chalk.position.set(4.18, 1.4, 3.0);
  chalk.rotation.y = Math.PI / 2;
  ship.add(chalk);

  // place the ship on the beach
  ship.position.set(ELIN_POS.x, ELIN_POS.y, ELIN_POS.z);
  ship.rotation.set(ELIN_POS.pitch, ELIN_POS.yaw, 0, 'YXZ');
  ship.updateMatrixWorld(true);

  // --- scaffolding around the cut (beach-side, world space) ---
  const sb = new Batch();
  const towerAt = (tx: number, tz: number, h: number): void => {
    const w = 1.1;
    const legs: [number, number][] = [[-w, -w], [w, -w], [-w, w], [w, w]];
    for (const [lx, lz] of legs) sb.strut(M.steelFresh, tx + lx, 0, tz + lz, tx + lx, h, tz + lz, 0.05);
    for (let y = 2; y <= h; y += 2) {
      sb.box(M.steelFresh, w * 2 + 0.1, 0.07, 0.07, tx, y, tz - w);
      sb.box(M.steelFresh, w * 2 + 0.1, 0.07, 0.07, tx, y, tz + w);
      sb.box(M.steelFresh, 0.07, 0.07, w * 2 + 0.1, tx - w, y, tz);
      sb.box(M.steelFresh, 0.07, 0.07, w * 2 + 0.1, tx + w, y, tz);
      sb.strut(M.steelFresh, tx - w, y - 2, tz - w, tx + w, y, tz + w, 0.03);
    }
    sb.box(M.timber, w * 2 + 0.3, 0.06, w * 2 + 0.3, tx, 3.0, tz);
    sb.box(M.timber, w * 2 + 0.3, 0.06, w * 2 + 0.3, tx, 5.6, tz);
  };
  towerAt(ELIN_POS.x + 7.5, ELIN_POS.z + 2, 6.5);
  towerAt(ELIN_POS.x + 7.5, ELIN_POS.z + 12, 5);
  // work platform bridging to the hull
  sb.strut(M.steelFresh, ELIN_POS.x + 7.5, 5.6, ELIN_POS.z + 7, ELIN_POS.x + 4.4, 5.2, ELIN_POS.z + 7, 0.05);
  sb.box(M.timber, 3.4, 0.07, 1.6, ELIN_POS.x + 6.2, 5.55, ELIN_POS.z + 7);
  // gas bottles + hoses at the towers
  for (let i = 0; i < 3; i++) {
    sb.cyl(std('gasbottle', { color: 0x4c5844, roughness: 0.6, metalness: 0.5 }), 0.17, 0.17, 1.3,
      ELIN_POS.x + 9.5, 0.65, ELIN_POS.z + 15.5 + i * 0.8, 8);
  }
  sb.build(group);

  // --- the cutting plan board (world space, facing the walkway) ---
  const board = new THREE.Group();
  const planMat = new THREE.MeshStandardMaterial({ map: cuttingPlanTex(), roughness: 0.85 });
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.25), planMat);
  plan.position.y = 2.2;
  board.add(plan);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.55, 0.08), M.steelDark);
  frame.position.set(0, 2.2, -0.05);
  board.add(frame);
  for (const px of [-1.2, 1.2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.2, 0.12), M.timber);
    post.position.set(px, 2.1, -0.05);
    board.add(post);
  }
  board.position.set(-114, 0, 12);
  board.rotation.y = 0.5;
  board.updateMatrixWorld(true);
  group.add(board);

  // --- gangway up to the deck, local space, port side (the yard side) ---
  const gw = new Batch();
  gw.strut(M.timber, 7.6, 0.2, 16, 4.4, 4.6, 23, 0.09);
  gw.strut(M.timber, 6.8, 0.2, 15.4, 3.6, 4.6, 22.4, 0.09);
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    const x = THREE.MathUtils.lerp(7.2, 4.0, t);
    const y = THREE.MathUtils.lerp(0.5, 4.8, t);
    const z = THREE.MathUtils.lerp(15.6, 22.6, t);
    gw.strut(M.steelFresh, x, y, z, x, y, z, 0.001); // rung pair below
    gw.strut(M.steelFresh, x, y, z, x + 0.001, y + 0.001, z + 0.001, 0.03);
  }
  gw.build(ship);

  // --- interactables (world coords from the placed transform) ---
  const interactables: Interactable[] = [];
  const p = (v: THREE.Vector3) => ship.localToWorld(v.clone());

  interactables.push({
    id: 'stamp:elin-b',
    pos: p(new THREE.Vector3(4.6, 2.6, 4.6)),
    radius: 5.2,
    label: 'RUB PLATE STAMP — CUT EDGE',
    act: () => hooks.stamp('elin-b'),
  });
  interactables.push({
    id: 'doc:elin-plan',
    pos: new THREE.Vector3(-114, 1.8, 12),
    radius: 3.6,
    label: 'READ — CUTTING PLAN, MV ELIN',
    act: () => hooks.doc('elin-plan'),
  });
  interactables.push({
    id: 'doc:elin-bow',
    pos: p(new THREE.Vector3(0, 3.2, 25.2)),
    radius: 4.5,
    label: 'READ NAME BOARD — MV ELIN',
    act: () => hooks.doc('elin-bow'),
  });

  // --- ambient activity anchors ---
  const points: AmbientPoint[] = [
    { id: 'elin-grinder', kind: 'grinder', pos: p(new THREE.Vector3(4.2, 2.8, 4.2)) },
    { id: 'elin-torch', kind: 'torch', pos: p(new THREE.Vector3(4.2, 1.6, 4.2)) },
  ];

  // --- colliders: three boxes along the hull ---
  const c = (z0: number, z1: number): Collider => ({ x0: ELIN_POS.x - 5.4, x1: ELIN_POS.x + 5.4, z0, z1 });
  const colliders: Collider[] = [c(ELIN_POS.z - 26, ELIN_POS.z - 4), c(ELIN_POS.z - 4, ELIN_POS.z + 14), c(ELIN_POS.z + 14, ELIN_POS.z + 27)];

  return { group, colliders, interactables, points };
}
