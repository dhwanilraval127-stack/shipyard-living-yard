import * as THREE from 'three/webgpu';
import { groundHeight } from './ground';

/**
 * The crew. Fourteen figures, four baked poses, one draw call per pose.
 * They are placed by the same truth that drives the sound: where work
 * happens, someone is doing it. No faces at this distance. That is honesty.
 * Tea break moves them to the office. The yard exhales; so do they.
 */

type Pose = 'stand' | 'bend' | 'crouch' | 'walk';

const VEST = new THREE.Color(0xb8622a);
const ARMS = new THREE.Color(0x2e3440);
const LEGS = new THREE.Color(0x33383e);
const SKIN = new THREE.Color(0x6b5a4c);
const HAT = new THREE.Color(0xe3e1d8);

interface BoxDef { w: number; h: number; d: number; x: number; y: number; z: number; c: THREE.Color; }

function poseBoxes(pose: Pose): BoxDef[] {
  const legs: BoxDef[] = pose === 'walk'
    ? [
        { w: 0.17, h: 0.8, d: 0.2, x: -0.11, y: 0.4, z: 0.16, c: LEGS },
        { w: 0.17, h: 0.8, d: 0.2, x: 0.11, y: 0.4, z: -0.14, c: LEGS },
      ]
    : [
        { w: 0.17, h: 0.8, d: 0.2, x: -0.11, y: 0.4, z: 0, c: LEGS },
        { w: 0.17, h: 0.8, d: 0.2, x: 0.11, y: 0.4, z: 0, c: LEGS },
      ];
  const boots: BoxDef[] = pose === 'walk'
    ? [
        { w: 0.18, h: 0.12, d: 0.28, x: -0.11, y: 0.06, z: 0.22, c: LEGS.clone().multiplyScalar(0.55) },
        { w: 0.18, h: 0.12, d: 0.28, x: 0.11, y: 0.06, z: -0.2, c: LEGS.clone().multiplyScalar(0.55) },
      ]
    : [
        { w: 0.18, h: 0.12, d: 0.28, x: -0.11, y: 0.06, z: 0.03, c: LEGS.clone().multiplyScalar(0.55) },
        { w: 0.18, h: 0.12, d: 0.28, x: 0.11, y: 0.06, z: 0.03, c: LEGS.clone().multiplyScalar(0.55) },
      ];
  if (pose === 'crouch') {
    return [
      { w: 0.2, h: 0.42, d: 0.22, x: -0.14, y: 0.21, z: 0.02, c: LEGS },
      { w: 0.2, h: 0.42, d: 0.22, x: 0.14, y: 0.21, z: 0.02, c: LEGS },
      ...boots,
      { w: 0.46, h: 0.56, d: 0.3, x: 0, y: 0.72, z: 0.1, c: VEST },
      { w: 0.13, h: 0.4, d: 0.15, x: -0.24, y: 0.85, z: 0.3, c: ARMS },
      { w: 0.13, h: 0.4, d: 0.15, x: 0.24, y: 0.85, z: 0.3, c: ARMS },
      { w: 0.2, h: 0.2, d: 0.22, x: 0, y: 1.1, z: 0.14, c: SKIN },
      { w: 0.26, h: 0.11, d: 0.28, x: 0, y: 1.23, z: 0.14, c: HAT },
      { w: 0.3, h: 0.03, d: 0.34, x: 0, y: 1.18, z: 0.18, c: HAT },
    ];
  }
  if (pose === 'bend') {
    return [
      ...legs, ...boots,
      { w: 0.46, h: 0.58, d: 0.28, x: 0, y: 1.02, z: 0.17, c: VEST },
      { w: 0.13, h: 0.5, d: 0.15, x: -0.27, y: 0.98, z: 0.32, c: ARMS },
      { w: 0.13, h: 0.5, d: 0.15, x: 0.27, y: 0.98, z: 0.32, c: ARMS },
      { w: 0.2, h: 0.2, d: 0.22, x: 0, y: 1.38, z: 0.3, c: SKIN },
      { w: 0.26, h: 0.11, d: 0.28, x: 0, y: 1.51, z: 0.32, c: HAT },
      { w: 0.3, h: 0.03, d: 0.34, x: 0, y: 1.46, z: 0.34, c: HAT },
    ];
  }
  return [
    ...legs, ...boots,
    { w: 0.46, h: 0.62, d: 0.28, x: 0, y: 1.12, z: 0, c: VEST },
    { w: 0.13, h: 0.55, d: 0.15, x: -0.3, y: 1.1, z: pose === 'walk' ? 0.12 : 0, c: ARMS },
    { w: 0.13, h: 0.55, d: 0.15, x: 0.3, y: 1.1, z: pose === 'walk' ? -0.12 : 0, c: ARMS },
    { w: 0.2, h: 0.22, d: 0.22, x: 0, y: 1.56, z: 0, c: SKIN },
    { w: 0.26, h: 0.12, d: 0.28, x: 0, y: 1.71, z: 0, c: HAT },
    { w: 0.3, h: 0.03, d: 0.36, x: 0, y: 1.65, z: 0.04, c: HAT },
  ];
}

function workerGeometry(pose: Pose): THREE.BufferGeometry {
  const boxes = poseBoxes(pose);
  let count = 0;
  count += boxes.length * 36; // 12 tris * 3 per box
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  let o = 0;
  const pushFace = (v: number[][], c: THREE.Color): void => {
    for (const tri of [v[0], v[1], v[2], v[0], v[2], v[3]]) {
      pos[o] = tri[0]; nor[o] = tri[3]; col[o] = c.r; o++;
      pos[o] = tri[1]; nor[o] = tri[4]; col[o] = c.g; o++;
      pos[o] = tri[2]; nor[o] = tri[5]; col[o] = c.b; o++;
    }
  };
  for (const b of boxes) {
    const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2;
    const y0 = b.y - b.h / 2, y1 = b.y + b.h / 2;
    const z0 = b.z - b.d / 2, z1 = b.z + b.d / 2;
    const shade = (c: THREE.Color, k: number): THREE.Color => c.clone().multiplyScalar(k);
    pushFace([[x0, y0, z1, 0, 0, 1], [x1, y0, z1, 0, 0, 1], [x1, y1, z1, 0, 0, 1], [x0, y1, z1, 0, 0, 1]], shade(b.c, 1));
    pushFace([[x1, y0, z0, 0, 0, -1], [x0, y0, z0, 0, 0, -1], [x0, y1, z0, 0, 0, -1], [x1, y1, z0, 0, 0, -1]], shade(b.c, 0.8));
    pushFace([[x1, y0, z1, 1, 0, 0], [x1, y0, z0, 1, 0, 0], [x1, y1, z0, 1, 0, 0], [x1, y1, z1, 1, 0, 0]], shade(b.c, 0.9));
    pushFace([[x0, y0, z0, -1, 0, 0], [x0, y0, z1, -1, 0, 0], [x0, y1, z1, -1, 0, 0], [x0, y1, z0, -1, 0, 0]], shade(b.c, 0.7));
    pushFace([[x0, y1, z1, 0, 1, 0], [x1, y1, z1, 0, 1, 0], [x1, y1, z0, 0, 1, 0], [x0, y1, z0, 0, 1, 0]], shade(b.c, 1.1));
    pushFace([[x0, y0, z0, 0, -1, 0], [x1, y0, z0, 0, -1, 0], [x1, y0, z1, 0, -1, 0], [x0, y0, z1, 0, -1, 0]], shade(b.c, 0.5));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeBoundingSphere();
  return g;
}

interface WorkerDef {
  pose: Pose;
  work: { x: number; z: number; yaw: number }[];
  tea: { x: number; z: number; yaw: number }[];
  shifts: Array<[number, number]>; // yard-hour ranges
  path?: boolean;                   // walk the work points in a loop
  slot?: number;
  mesh?: THREE.InstancedMesh | null;
  idx?: number;
}

const H = 3600;
const ALL_DAY: Array<[number, number]> = [[6 * H, 17.2 * H]];
const NIGHT: Array<[number, number]> = [[18.5 * H, 23 * H]];

const CREW: WorkerDef[] = [
  // fabrication shed
  { pose: 'bend', work: [{ x: 30, z: -69.4, yaw: Math.PI }], tea: [{ x: 170, z: -16, yaw: 2.6 }], shifts: ALL_DAY },
  { pose: 'stand', work: [{ x: 10, z: -68.4, yaw: 0.4 }], tea: [{ x: 171.5, z: -14, yaw: 3.4 }], shifts: ALL_DAY },
  { pose: 'walk', path: true, work: [{ x: 18, z: -58, yaw: 0 }, { x: 40, z: -58, yaw: Math.PI }], tea: [{ x: 169, z: -12, yaw: 2.9 }], shifts: ALL_DAY },
  // hull 44
  { pose: 'crouch', work: [{ x: -43.6, z: 30.4, yaw: -1.8 }], tea: [{ x: 167, z: -15, yaw: 2.2 }], shifts: ALL_DAY },
  { pose: 'stand', work: [{ x: -46.4, z: 26, yaw: -1.2 }], tea: [{ x: 173, z: -17, yaw: 2.4 }], shifts: ALL_DAY },
  { pose: 'walk', path: true, work: [{ x: -48, z: 20, yaw: -0.4 }, { x: -36, z: 44, yaw: -2.2 }], tea: [{ x: 168, z: -18, yaw: 2.1 }], shifts: ALL_DAY },
  // the cut
  { pose: 'bend', work: [{ x: -126.6, z: 40, yaw: 2.9 }], tea: [{ x: 166, z: -13, yaw: 2.7 }], shifts: ALL_DAY },
  { pose: 'stand', work: [{ x: -120, z: 24, yaw: 3.0 }], tea: [{ x: 172, z: -12, yaw: 3.0 }], shifts: ALL_DAY },
  { pose: 'crouch', work: [{ x: -127.4, z: 50, yaw: 2.7 }], tea: [{ x: 174.5, z: -14, yaw: 2.8 }], shifts: ALL_DAY },
  // patrols
  { pose: 'walk', path: true, work: [{ x: 60, z: -8.5, yaw: Math.PI }, { x: 150, z: -8.5, yaw: 0 }], tea: [{ x: 170.5, z: -16.5, yaw: 2.5 }], shifts: ALL_DAY },
  { pose: 'walk', path: true, work: [{ x: 20, z: 48, yaw: Math.PI / 2 }, { x: 120, z: 48, yaw: -Math.PI / 2 }], tea: [{ x: 169.5, z: -10, yaw: 3.1 }], shifts: ALL_DAY },
  // gate + stores
  { pose: 'stand', work: [{ x: 171.5, z: -8.5, yaw: Math.PI / 2 }], tea: [{ x: 171.5, z: -8.5, yaw: Math.PI / 2 }], shifts: ALL_DAY },
  { pose: 'bend', work: [{ x: 84, z: -62, yaw: 1.2 }], tea: [{ x: 173.5, z: -16, yaw: 2.3 }], shifts: ALL_DAY },
  // ELIN night burning crew
  { pose: 'crouch', work: [{ x: -125.6, z: 42, yaw: 2.8 }], tea: [{ x: 167.5, z: -17, yaw: 2.0 }], shifts: NIGHT },
  { pose: 'stand', work: [{ x: -128.4, z: 46, yaw: 2.6 }], tea: [{ x: 170, z: -13, yaw: 2.9 }], shifts: NIGHT },
];

const SPEED = 1.1;

interface WorkerState { at: THREE.Vector2; to: number; moving: boolean; idx: number; }

export class Crew {
  private meshes = new Map<Pose, THREE.InstancedMesh>();
  private states: WorkerState[] = [];
  private tea = false;
  private prevTea = false;

  constructor(scene: THREE.Scene) {
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0.05 });
    const counts: Record<Pose, number> = { stand: 6, bend: 4, crouch: 4, walk: 4 };
    for (const pose of ['stand', 'bend', 'crouch', 'walk'] as Pose[]) {
      const im = new THREE.InstancedMesh(workerGeometry(pose), mat, counts[pose]);
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.count = counts[pose];
      im.castShadow = true;
      im.frustumCulled = false;
      scene.add(im);
      this.meshes.set(pose, im);
    }
    let i = 0;
    const byPose: Record<string, number> = { stand: 0, bend: 0, crouch: 0, walk: 0 };
    for (const def of CREW) {
      const w = def.work[0];
      this.states.push({ at: new THREE.Vector2(w.x, w.z), to: 0, moving: false, idx: i });
      def.idx = i;
      def.slot = byPose[def.pose]++;
      def.mesh = this.meshes.get(def.pose)!;
      i++;
    }
    this.writeMatrices(0);
  }

  private writeMatrices(t: number): void {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const eu = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    CREW.forEach((def, ci) => {
      const st = this.states[ci];
      const im = def.mesh!;
      const visible = this.onShift(def) || this.tea;
      if (!visible) {
        m.makeScale(0.0001, 0.0001, 0.0001);
        im.setMatrixAt(def.slot!, m);
        return;
      }
      const target = this.tea ? def.tea[0] : def.work[st.to];
      const bob = st.moving ? Math.abs(Math.sin(t * 6.4)) * 0.05 : 0;
      const sway = st.moving ? Math.sin(t * 6.4) * 0.04 : 0;
      eu.set(0, target.yaw + sway * 0.3, 0);
      q.setFromEuler(eu);
      const gh = groundHeight(st.at.x, st.at.y);
      p.set(st.at.x, gh + bob, st.at.y);
      s.set(1, 1, 1);
      m.compose(p, q, s);
      im.setMatrixAt(def.slot!, m);
    });
    for (const im of this.meshes.values()) im.instanceMatrix.needsUpdate = true;
  }

  private onShift(def: WorkerDef): boolean {
    const h = this.yardHour;
    return def.shifts.some(([a, b]) => h >= a && h < b);
  }

  private yardHour = 8 * H;

  update(dt: number, yardSec: number, tea: boolean): void {
    this.yardHour = yardSec;
    this.tea = tea;
    this.animT += dt;
    const t = this.animT;
    let anyMove = false;
    CREW.forEach((def, ci) => {
      const st = this.states[ci];
      if (!this.onShift(def) && !tea) { st.moving = false; return; }
      const target = this.tea ? def.tea[0] : (def.path ? def.work[st.to] : def.work[0]);
      const dx = target.x - st.at.x, dz = target.z - st.at.y;
      const d = Math.hypot(dx, dz);
      if (d > 0.5) {
        st.moving = true;
        const step = Math.min(d, SPEED * dt);
        st.at.x += (dx / d) * step;
        st.at.y += (dz / d) * step;
        anyMove = true;
      } else {
        st.moving = false;
        if (def.path && !this.tea) st.to = (st.to + 1) % def.work.length;
      }
    });
    // rewrite matrices when anything changed (or once a second as cheap heartbeat)
    this.accum += dt;
    if (anyMove || this.accum > 1 || this.tea !== this.prevTea) {
      this.accum = 0;
      this.prevTea = this.tea;
      this.writeMatrices(t);
    }
  }
  private accum = 0;
  private animT = 0;
}

