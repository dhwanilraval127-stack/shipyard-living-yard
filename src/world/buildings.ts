import * as THREE from 'three/webgpu';
import { Batch, M, std } from '../engine/mat';
import { signTex, stencilTex } from '../engine/tex';
import type { Built, Collider, AmbientPoint } from './types';

/** Fabrication shed + steel storage. Interiors carry the densest craft per m². */

export const WORKSHOP_DOOR = new THREE.Vector3(22, 0, -50);

export function buildBuildings(): Built {
  const group = new THREE.Group();

  /* ---------- fabrication shed: x -8..52, z -78..-50, door south ---------- */
  const shed = new Batch();
  const wall = M.corrugated('shed-wall', '#838a8e');
  const frame = M.oxideDim;
  // slab
  shed.box(M.concrete, 62, 0.3, 30, 22, 0.15, -64);
  // walls (south wall segmented around the 9m door at x 17..26)
  shed.box(wall, 62, 9, 0.3, 22, 4.5, -78.2);
  shed.box(wall, 0.3, 9, 28, -8.2, 4.5, -64);
  shed.box(wall, 0.3, 9, 28, 52.2, 4.5, -64);
  shed.box(wall, 25, 9, 0.3, 4.4, 4.5, -49.8);     // south, west of door
  shed.box(wall, 26, 9, 0.3, 39.1, 4.5, -49.8);    // south, east of door
  // door lintel + frame
  shed.box(frame, 10.4, 1.2, 0.5, 21.5, 8.5, -49.8);
  shed.box(frame, 0.4, 9, 0.5, 16.8, 4.5, -49.8);
  shed.box(frame, 0.4, 9, 0.5, 26.2, 4.5, -49.8);
  // roof: two slopes
  const roof = std('shed-roof', { color: 0x4d5357, roughness: 0.8, metalness: 0.45 });
  shed.box(roof, 63.5, 0.4, 17.5, 22, 10.6, -71.2, 0, 0.32);
  shed.box(roof, 63.5, 0.4, 17.5, 22, 10.6, -56.8, 0, -0.32);
  // gable infills
  shed.box(wall, 62, 2.2, 0.3, 22, 9.6, -78.2);
  // ridge beam + interior frames
  shed.box(frame, 63, 0.5, 0.5, 22, 11.6, -64);
  for (let x = -6; x <= 50; x += 7) {
    shed.box(frame, 0.4, 9.2, 0.3, x, 4.6, -77.6);
    shed.box(frame, 0.4, 9.2, 0.3, x, 4.6, -50.4);
    shed.strut(frame, x, 8.8, -77.6, x + 0.01, 9.2, -64, 0.14);
    shed.strut(frame, x, 8.8, -50.4, x + 0.01, 9.2, -64, 0.14);
  }
  // interior: work zone (plates on trestles, welding bench)
  const benchMat = M.steelDark;
  for (const [bx, bz] of [[10, -70], [30, -70], [30, -58]] as const) {
    shed.box(benchMat, 7, 0.2, 2.4, bx, 1.05, bz);
    for (const lx of [-3, 3]) shed.box(benchMat, 0.2, 1.0, 2.2, bx + lx, 0.5, bz);
  }
  shed.box(M.steel, 4.4, 0.14, 2.2, 10, 1.16, -70); // plate being worked
  // gas bottles + cables + drum
  for (let i = 0; i < 4; i++) {
    shed.cyl(std('bottle', { color: 0x39413a, roughness: 0.55, metalness: 0.5 }), 0.16, 0.16, 1.4, 46, 0.7, -74 + i * 0.7, 8);
  }
  shed.cyl(M.rust, 0.9, 0.9, 1.4, -4, 0.7, -53, 12);
  // interior lamp strip (emissive)
  shed.box(M.lampOn, 40, 0.12, 0.5, 22, 9.0, -64);
  shed.box(M.lampOn, 40, 0.12, 0.5, 22, 9.0, -58);
  shed.build(group);

  // shed sign
  const shedSignMat = new THREE.MeshStandardMaterial({
    map: signTex(['FABRICATION SHED — No.1'], { bg: '#23282c', fg: '#e9e4d8', w: 760, size: 40, border: 'none' }),
    roughness: 0.7,
  });
  const shedSign = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.72), shedSignMat);
  shedSign.position.set(14.5, 7.6, -49.6);
  group.add(shedSign);

  /* ---------- steel storage: x 60..126, z -78..-50 ---------- */
  const st = new Batch();
  const plateRust = M.rust;
  const plateGrey = std('store-plate', { color: 0x6f7478, roughness: 0.8, metalness: 0.4 });
  // rows of plate stacks with timber bearers
  const stack = (x: number, z: number, n: number, mat: THREE.Material, ry = 0): void => {
    st.box(M.timber, 0.35, 0.5, 0.35, x - 2.6, 0.25, z + 1.0);
    st.box(M.timber, 0.35, 0.5, 0.35, x + 2.6, 0.25, z + 1.0);
    st.box(M.timber, 0.35, 0.5, 0.35, x - 2.6, 0.25, z - 1.0);
    st.box(M.timber, 0.35, 0.5, 0.35, x + 2.6, 0.25, z - 1.0);
    for (let i = 0; i < n; i++) st.box(mat, 6.4, 0.1, 2.3, x, 0.58 + i * 0.12, z, ry);
  };
  stack(68, -72, 5, plateRust); stack(68, -66, 3, plateGrey); stack(68, -58, 4, plateRust);
  stack(84, -72, 4, plateGrey); stack(84, -64, 6, plateRust); stack(84, -56, 3, plateGrey);
  stack(100, -70, 5, plateRust); stack(100, -62, 4, plateGrey);
  stack(116, -72, 3, plateRust); stack(116, -64, 5, plateGrey);
  // a few plates on edge in A-frames
  for (const [x, z] of [[76, -54], [92, -54], [108, -56]] as const) {
    st.strut(M.timber, x - 1.8, 0, z, x, 3.0, z, 0.12);
    st.strut(M.timber, x + 1.8, 0, z, x, 3.0, z, 0.12);
    for (let i = 0; i < 3; i++) st.box(plateGrey, 0.12, 2.6, 2.2, x - 0.25 + i * 0.25, 1.3, z, 0, 0, -0.12);
  }
  // pipe racks
  for (const [x, z] of [[70, -52], [104, -52]] as const) {
    for (const dx of [-3, 0, 3]) {
      st.strut(M.steelDark, x + dx - 0.9, 0, z, x + dx, 1.6, z, 0.08);
      st.strut(M.steelDark, x + dx + 0.9, 0, z, x + dx, 1.6, z, 0.08);
    }
    for (let i = 0; i < 5; i++) {
      st.cyl(M.steel, 0.14, 0.14, 9.5, x, 1.75 + (i % 2) * 0.3, z - 1.8 + i * 0.34, 8, Math.PI / 2);
    }
  }
  st.build(group);

  // storage sign + chalk stencil on a stock plate end
  const stSignMat = new THREE.MeshStandardMaterial({
    map: signTex(['STEEL STORAGE', 'YARD STOCK'], { bg: '#7a2e22', fg: '#e9e4d8', w: 560, size: 44 }),
    roughness: 0.75,
  });
  const stSign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.9), stSignMat);
  stSign.position.set(92, 3.4, -49.7);
  group.add(stSign);
  for (const dx of [-2.0, 2.0]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 0.12), M.timber);
    post.position.set(92 + dx, 1.8, -49.8);
    group.add(post);
  }
  const stockMat = new THREE.MeshStandardMaterial({
    map: stencilTex(['YARD STOCK'], 'rgba(235,230,220,0.85)'), transparent: true, alphaTest: 0.05, roughness: 0.9,
  });
  const stock = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.1), stockMat);
  stock.position.set(100, 1.0, -61.2);
  stock.rotation.x = Math.PI / 2;
  stock.rotation.z = Math.PI;
  group.add(stock);

  const colliders: Collider[] = [
    // shed walls (door gap x 17..26 at z=-49.8 open)
    { x0: -8.5, x1: 52.5, z0: -79, z1: -77.8 },
    { x0: -8.5, x1: -7.9, z0: -78, z1: -50 },
    { x0: 51.9, x1: 52.5, z0: -78, z1: -50 },
    { x0: -8.5, x1: 16.7, z0: -50.2, z1: -49.4 },
    { x0: 26.3, x1: 52.5, z0: -50.2, z1: -49.4 },
    // steel storage clusters
    { x0: 64, x1: 88, z0: -74, z1: -60 },
    { x0: 96, x1: 120, z0: -74, z1: -60 },
    { x0: 74, x1: 110, z0: -56, z1: -51 },
  ];

  const points: AmbientPoint[] = [
    { id: 'shed-hammer', kind: 'hammer', pos: new THREE.Vector3(30, 1.3, -69) },
  ];

  return { group, colliders, interactables: [], points };
}
