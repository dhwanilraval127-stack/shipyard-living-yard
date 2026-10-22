import * as THREE from 'three/webgpu';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);

/**
 * Accumulates primitive geometry per material and merges on build.
 * A shipyard worth of steel, a handful of draw calls.
 */
export class Batch {
  private parts = new Map<THREE.Material, THREE.BufferGeometry[]>();

  private push(mat: THREE.Material, geo: THREE.BufferGeometry, m: THREE.Matrix4): void {
    const g = geo.clone().applyMatrix4(m).toNonIndexed();
    geo.dispose();
    const arr = this.parts.get(mat);
    if (arr) arr.push(g); else this.parts.set(mat, [g]);
  }

  private xform(x: number, y: number, z: number, ry: number, rx: number, rz: number, sx: number, sy: number, sz: number): THREE.Matrix4 {
    _e.set(rx, ry, rz, 'YXZ');
    _q.setFromEuler(_e);
    _p.set(x, y, z);
    _s.set(sx, sy, sz);
    return _m.compose(_p, _q, _s);
  }

  box(mat: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number,
      ry = 0, rx = 0, rz = 0, sy = 1): void {
    const g = new THREE.BoxGeometry(w, h * sy, d);
    this.push(mat, g, this.xform(x, y, z, ry, rx, rz, 1, 1, 1));
  }

  cyl(mat: THREE.Material, rt: number, rb: number, h: number, x: number, y: number, z: number,
      seg = 10, rx = 0, rz = 0, ry = 0): void {
    const g = new THREE.CylinderGeometry(rt, rb, h, seg);
    this.push(mat, g, this.xform(x, y, z, ry, rx, rz, 1, 1, 1));
  }

  /** cylinder from point a to point b (railings, struts, cables) */
  strut(mat: THREE.Material, ax: number, ay: number, az: number, bx: number, by: number, bz: number, r: number, seg = 6): void {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len = Math.hypot(dx, dy, dz);
    if (len < 1e-4) return;
    const g = new THREE.CylinderGeometry(r, r, len, seg);
    _q.setFromUnitVectors(UP, _s.set(dx / len, dy / len, dz / len).clone().normalize());
    _p.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
    _s.set(1, 1, 1);
    this.push(mat, g, _m.compose(_p, _q, _s));
  }

  geo(mat: THREE.Material, geo: THREE.BufferGeometry, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0): void {
    this.push(mat, geo, this.xform(x, y, z, ry, rx, rz, 1, 1, 1));
  }

  /** merge everything into meshes on `group`; per-material meshes, shadows on */
  build(group: THREE.Group): void {
    for (const [mat, geos] of this.parts) {
      let posN = 0;
      for (const g of geos) posN += g.attributes.position.count;
      const pos = new Float32Array(posN * 3);
      const nor = new Float32Array(posN * 3);
      const uv = new Float32Array(posN * 2);
      let o3 = 0, o2 = 0;
      for (const g of geos) {
        if (g.attributes.position) {
          pos.set(g.attributes.position.array as Float32Array, o3);
          nor.set(g.attributes.normal.array as Float32Array, o3);
          if (g.attributes.uv) uv.set(g.attributes.uv.array as Float32Array, o2);
          o3 += g.attributes.position.array.length;
          o2 += (g.attributes.uv ? g.attributes.uv.array.length : (g.attributes.position.count / 3) * 2);
        }
        g.dispose();
      }
      const merged = new THREE.BufferGeometry();
      merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      merged.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      merged.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      merged.computeBoundingSphere();
      const mesh = new THREE.Mesh(merged, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      group.add(mesh);
    }
    this.parts.clear();
  }
}
