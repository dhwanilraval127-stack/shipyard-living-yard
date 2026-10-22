import * as THREE from 'three/webgpu';

/**
 * Lofted hull generator. Cross-sections are evaluated from a half-beam curve
 * along the length and a section shape curve from keel to deck edge.
 * Local frame: bow at +Z, keel at y=0, deck edge at y≈D (with sheer at the bow).
 * UVs: u along length (scaled by L/B), v from keel (0) to deck edge (1).
 */

export interface HullSpec {
  L: number;   // length overall of this lofted section
  B: number;   // beam
  D: number;   // depth to deck edge
  sheer?: number;      // bow sheer rise as fraction of D
  bowLen?: number;     // fraction of L given to bow taper
  sternLen?: number;   // fraction of L given to stern taper
  transomW?: number;   // transom half-width fraction of B/2
}

export function hullGeometry(s: HullSpec): THREE.BufferGeometry {
  const { L, B, D } = s;
  const sheer = s.sheer ?? 0.10;
  const bowLen = s.bowLen ?? 0.32;
  const sternLen = s.sternLen ?? 0.14;
  const transomW = s.transomW ?? 0.38;
  const N = 40;   // stations
  const M = 12;   // rings keel→deck

  const halfBeam = (t: number): number => {
    let hb = B / 2;
    if (t < sternLen) {
      const u = t / sternLen;
      hb *= transomW + (1 - transomW) * Math.pow(Math.sin((u * Math.PI) / 2), 0.85);
    }
    if (t > 1 - bowLen) {
      const u = (t - (1 - bowLen)) / bowLen;
      hb *= 1 - Math.pow(u, 2.3);
    }
    return Math.max(hb, 0);
  };

  const deckY = (t: number): number =>
    D * (1 + sheer * Math.pow(Math.max(0, (t - 0.55) / 0.45), 2));

  // section: x offset from centerline for ring parameter v in [0,1]
  const sect = (v: number, hb: number, t: number): { x: number; y: number } => {
    const f = Math.pow(Math.sin(v * 1.45), 0.62);   // flat floor → rounded bilge → topside
    const flare = 1 + 0.06 * Math.pow(Math.max(0, t - 0.7) / 0.3, 2) * v;
    return { x: hb * (0.16 + 0.84 * f) * flare, y: v * deckY(t) };
  };

  const buildSide = (side: 1 | -1): THREE.BufferGeometry => {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const z = -L / 2 + t * L;
      const hb = halfBeam(t);
      for (let j = 0; j <= M; j++) {
        const v = j / M;
        const p = sect(v, hb, t);
        pos.push(side * p.x, p.y, z);
        uv.push(t * (L / B) * 0.8, v);
      }
    }
    const W = M + 1;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const a = i * W + j, b = a + W;
        if (side > 0) idx.push(a, b, a + 1, a + 1, b, b + 1);
        else idx.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };

  const geos: THREE.BufferGeometry[] = [buildSide(1), buildSide(-1)];

  // deck (slight camber)
  {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    const K = 6;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const z = -L / 2 + t * L;
      const hb = halfBeam(t);
      const dy = deckY(t);
      for (let j = 0; j <= K; j++) {
        const u = (j / K) * 2 - 1;
        pos.push(u * hb * 0.985, dy + (1 - Math.abs(u)) * D * 0.015, z);
        uv.push(t * (L / B) * 0.8, u * 0.5 + 0.5);
      }
    }
    const W = K + 1;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < K; j++) {
        const a = i * W + j, b = a + W;
        idx.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    geos.push(g);
  }

  // transom (stern cap)
  {
    const t = 0, z = -L / 2, hb = halfBeam(t) * 0.995;
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    const K = 10;
    for (let j = 0; j <= K; j++) {
      const v = j / K;
      const y = v * deckY(t);
      pos.push(-hb * (0.16 + 0.84 * Math.pow(Math.sin(v * 1.45), 0.62)), y, z);
      uv.push(v, 0);
    }
    for (let j = 0; j < K; j++) idx.push(j, j + 1, K); // fan (single strip → triangle fan)
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    geos.push(g);
  }

  return mergeGeos(geos);
}

/** minimal merge for same-attribute geometries (position/normal/uv, non-indexed output) */
export function mergeGeos(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let total = 0;
  for (const g of parts) total += g.attributes.position.count;
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const uv = new Float32Array(total * 2);
  let o3 = 0, o2 = 0;
  for (const g of parts) {
    const n = g.attributes.position.count;
    pos.set((g.attributes.position as THREE.BufferAttribute).array as Float32Array, o3);
    if (g.attributes.normal) nor.set((g.attributes.normal as THREE.BufferAttribute).array as Float32Array, o3);
    if (g.attributes.uv) uv.set((g.attributes.uv as THREE.BufferAttribute).array as Float32Array, o2);
    o3 += n * 3; o2 += n * 2;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.computeBoundingSphere();
  return out;
}
