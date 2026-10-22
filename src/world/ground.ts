import * as THREE from 'three/webgpu';
import { Batch, M } from '../engine/mat';
import { waterNormalTex, yardFloorTex } from '../engine/tex';
import type { Built, Collider } from './types';

/**
 * Terrain + water + tide. One analytic height field: the yard slab sits at 0,
 * the beach breathes down to the sea in the south-west, two slipways run into
 * the water, and the overlook rises in the north-west.
 */

export const WATER_BASE = -3.0;

/** analytic ground height */
export function groundHeight(x: number, z: number): number {
  let h = 0;
  // beach: west edge falls toward the sea
  const bx = 1 - smooth(-150, -85, x);        // 0 at x=-85 → 1 at x=-150
  const bz = smooth(-20, 48, z);              // 0 inland → 1 seaward
  h -= bx * bz * 3.4;
  // slipway corridors continue under water
  if (z > 58) {
    const w1 = Math.abs(x + 40) < 7;
    const w2 = Math.abs(x + 5) < 7;
    if (w1 || w2) h = Math.max(h, -(z - 58) * 0.22);
    else h = Math.min(h, -6);
  }
  // overlook mound
  const dx = x + 125, dz = z + 138;
  h = Math.max(h, 17 * Math.exp(-(dx * dx + dz * dz) / (2 * 40 * 40)));
  return h;
}

function smooth(a: number, b: number, v: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** tide: slow compressed breathing, 6 real minutes full cycle */
export function waterLevel(simSec: number): number {
  return WATER_BASE + 0.55 * Math.sin((simSec / 360) * Math.PI * 2);
}

export function buildGround(): GroundBuilt {
  let floorMatOut: THREE.MeshStandardMaterial;
  const group = new THREE.Group();
  const b = new Batch();

  // main slab: one painted plane — the yard's own signage
  {
    const floorMat = new THREE.MeshStandardMaterial({
      map: yardFloorTex(), roughness: 0.94, metalness: 0,
    });
    (floorMat.map as THREE.Texture).anisotropy = 8;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(380, 120), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.001, -2);
    floor.receiveShadow = true;
    floor.name = 'yardfloor';
    group.add(floor);
    // structural slab underneath (keeps the lip at the quay)
    b.box(M.concrete, 380, 1, 120, 0, -0.51, -2);
    b.box(M.concrete, 380, 1, 4, 0, -0.51, -64);
    floorMatOut = floorMat;
  }

  // beach — custom mesh following the height field (west region)
  const geo = beachMesh(-190, -85, -30, 70, 44, 30);
  b.geo(M.sand, geo);

  // slipway slabs: sloping concrete lanes
  for (const cx of [-40, -5]) {
    const lane = new THREE.BufferGeometry();
    const hw = 5.5;
    const z0 = 40, z1 = 80, y0 = 0, y1 = -(80 - 58) * 0.22;
    // simple quad strip down the slope
    const v = new Float32Array([
      cx - hw, y0, z0, cx + hw, y0, z0, cx + hw, y1, z1,
      cx - hw, y0, z0, cx + hw, y1, z1, cx - hw, y1, z1,
    ]);
    const uvs = new Float32Array([0, 0, 8, 0, 8, 8, 0, 0, 8, 8, 0, 8]);
    lane.setAttribute('position', new THREE.BufferAttribute(v, 3));
    lane.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    lane.computeVertexNormals();
    b.geo(M.concrete, lane);
  }

  // quay wall (visual) with notches at the two ways
  const wallSegs: [number, number][] = [[-85, -47], [-33, -12], [2, 190]];
  for (const [x0, x1] of wallSegs) {
    b.box(M.concrete, x1 - x0, 4.6, 1.2, (x0 + x1) / 2, -2.1, 58.6);
    b.box(M.concrete, x1 - x0, 0.5, 0.5, (x0 + x1) / 2, 0.2, 58.4); // lip coping
  }
  // sea wall west edge of the yard slab (between yard and beach start)
  b.box(M.concrete, 1.2, 2.4, 92, -84.5, -1.1, 12);

  b.build(group);

  const colliders: Collider[] = [
    { x0: -190, x1: -183, z0: -180, z1: 60 },   // west fence line (behind ELIN)
    { x0: 183, x1: 190, z0: -180, z1: 58 },     // east fence
    { x0: -183, x1: 183, z0: -186, z1: -178 },  // north fence behind overlook
  ];

  // water
  const waterGeo = new THREE.PlaneGeometry(1600, 1100, 1, 1);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x39444c, roughness: 0.52, metalness: 0.12,
    normalMap: waterNormal(), normalScale: new THREE.Vector2(0.24, 0.24),
  });
  (waterMat.normalMap as THREE.Texture).repeat.set(15, 10);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, WATER_BASE, 260);
  water.receiveShadow = false;
  water.name = 'water';
  group.add(water);

  const update = (simSec: number): void => {
    water.position.y = waterLevel(simSec);
    const nm = waterMat.normalMap!;
    nm.offset.x = simSec * 0.008;
    nm.offset.y = simSec * 0.0055;
  };

  return { group, colliders, water, waterMat, floorMat: floorMatOut, update };
}

export interface GroundBuilt extends Built {
  colliders: Collider[];
  water: THREE.Mesh;
  waterMat: THREE.MeshStandardMaterial;
  floorMat: THREE.MeshStandardMaterial;
  update: (simSec: number) => void;
}

let _wn: THREE.Texture | null = null;
function waterNormal(): THREE.Texture {
  if (!_wn) _wn = waterNormalTex();
  return _wn;
}

function beachMesh(x0: number, x1: number, z0: number, z1: number, nx: number, nz: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const pos: number[] = []; const uv: number[] = []; const idx: number[] = [];
  for (let iz = 0; iz <= nz; iz++) {
    for (let ix = 0; ix <= nx; ix++) {
      const x = x0 + ((x1 - x0) * ix) / nx;
      const z = z0 + ((z1 - z0) * iz) / nz;
      pos.push(x, groundHeight(x, z) - 0.15, z);
      uv.push(ix * 4, iz * 4);
    }
  }
  const W = nx + 1;
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      const a = iz * W + ix, bq = a + 1, c = a + W, d = c + 1;
      idx.push(a, c, bq, bq, c, d);
    }
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
