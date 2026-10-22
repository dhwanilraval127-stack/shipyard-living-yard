import * as THREE from 'three/webgpu';
import { skyTex, envEquirect } from '../engine/tex';
import { registry } from '../engine/mat';
import { damp, clamp, smoothstep } from '../utils/math';

/**
 * Four authored lights, not one simulation. DAWN / WORKDAY / GOLDEN / NIGHT,
 * crossfaded on the yard clock. The dome, the fog, the sun, the lamps and the
 * floodlights all answer to the same small table.
 */

export interface PresetP {
  sky: number; fog: number; fogDensity: number;
  sun: number; sunI: number; az: number; alt: number;
  hemiSky: number; hemiGround: number; hemiI: number;
  exposure: number; lamps: number; floods: number; env: number;
}

const DAWN: PresetP = {
  sky: 0x76808c, fog: 0xa9b2ba, fogDensity: 0.0046,
  sun: 0xffd2a8, sunI: 0.5, az: 112, alt: 9,
  hemiSky: 0x93a0ae, hemiGround: 0x3e4448, hemiI: 0.55,
  exposure: 0.8, lamps: 1, floods: 0, env: 0.22,
};
const WORKDAY: PresetP = {
  sky: 0x9fb0bd, fog: 0xb8bdc2, fogDensity: 0.0026,
  sun: 0xfff2e0, sunI: 1.7, az: 150, alt: 55,
  hemiSky: 0xaebbc6, hemiGround: 0x4a5054, hemiI: 0.8,
  exposure: 1.0, lamps: 0, floods: 0, env: 0.42,
};
const GOLDEN: PresetP = {
  sky: 0xd8c3a4, fog: 0xcfc2ab, fogDensity: 0.0034,
  sun: 0xff9f5e, sunI: 1.5, az: 250, alt: 11,
  hemiSky: 0xc0b2a0, hemiGround: 0x3c3a38, hemiI: 0.55,
  exposure: 1.08, lamps: 0.35, floods: 0, env: 0.5,
};
const NIGHT: PresetP = {
  sky: 0x11161d, fog: 0x10151b, fogDensity: 0.0042,
  sun: 0x8fa4c2, sunI: 0.15, az: 320, alt: 38,
  hemiSky: 0x2a323e, hemiGround: 0x14171a, hemiI: 0.44,
  exposure: 0.9, lamps: 1, floods: 1, env: 0.12,
};

const H = 3600;
const BLEND = 12 * 60; // 12 yard-minutes of crossfade either side of a boundary

function presetFor(tt: number): PresetP {
  if (tt >= 4.5 * H && tt < 8 * H) return DAWN;
  if (tt >= 8 * H && tt < 16.5 * H) return WORKDAY;
  if (tt >= 16.5 * H && tt < 18.5 * H) return GOLDEN;
  return NIGHT;
}

/** blended preset parameters for a yard time */
export function evalPreset(t: number): PresetP {
  const day = 24 * H;
  const tt = ((t % day) + day) % day;
  const cur = presetFor(tt);
  // proximity to any preset boundary
  const bounds: number[] = [4.5 * H, 8 * H, 16.5 * H, 18.5 * H];
  const near = { bound: -1, dist: 1e9 };
  for (const bd of bounds) {
    let d = Math.abs(tt - bd);
    d = Math.min(d, day - d);
    if (d < near.dist) { near.dist = d; near.bound = bd; }
  }
  const f = smoothstep(BLEND, 0, near.dist); // 0 away from boundary → 1 at it
  if (f <= 0) return cur;
  // the preset that takes over just after the boundary
  const otherP = presetFor((near.bound + 60) % day);
  const a = cur, b = otherP;
  const mix = (x: number, y: number) => x + (y - x) * f;
  const c = (x: number, y: number) => mixColor(x, y, f);
  return {
    sky: c(a.sky, b.sky), fog: c(a.fog, b.fog), fogDensity: mix(a.fogDensity, b.fogDensity),
    sun: c(a.sun, b.sun), sunI: mix(a.sunI, b.sunI), az: mix(a.az, b.az), alt: mix(a.alt, b.alt),
    hemiSky: c(a.hemiSky, b.hemiSky), hemiGround: c(a.hemiGround, b.hemiGround), hemiI: mix(a.hemiI, b.hemiI),
    exposure: mix(a.exposure, b.exposure), lamps: mix(a.lamps, b.lamps), floods: mix(a.floods, b.floods),
    env: mix(a.env, b.env),
  };
  function mixColor(x: number, y: number, k: number): number {
    const ca = new THREE.Color(x), cb = new THREE.Color(y);
    return ca.lerp(cb, k).getHex();
  }
}

const _c1 = new THREE.Color();
const _c2 = new THREE.Color();

export class Sky {
  readonly sun: THREE.DirectionalLight;
  readonly hemi: THREE.HemisphereLight;
  private dome: THREE.Mesh;
  private sunDisc: THREE.Mesh;
  private current = { ...DAWN, env: DAWN.env };
  floodsEnabled = false;

  constructor(scene: THREE.Scene) {
    scene.environment = envEquirect();
    this.hemi = new THREE.HemisphereLight(0xaebbc6, 0x4a5054, 0.8);
    scene.add(this.hemi);

    this.sun = new THREE.DirectionalLight(0xfff2e0, 1.7);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -85; sc.right = 85; sc.top = 85; sc.bottom = -85;
    sc.near = 20; sc.far = 500;
    this.sun.shadow.bias = -0.0004;
    scene.add(this.sun);
    scene.add(this.sun.target);

    const domeMat = new THREE.MeshBasicMaterial({ map: skyTex(), side: THREE.BackSide, fog: false, depthWrite: false });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), domeMat);
    this.dome.renderOrder = -10;
    this.dome.scale.setScalar(1400);
    scene.add(this.dome);

    const discMat = new THREE.MeshBasicMaterial({ color: 0xfff4de, fog: false, transparent: true, opacity: 0.9, depthWrite: false });
    this.sunDisc = new THREE.Mesh(new THREE.CircleGeometry(26, 24), discMat);
    this.sunDisc.renderOrder = -9;
    scene.add(this.sunDisc);
  }

  /** snap the shadow to texels so steel edges don't crawl */
  private static readonly TEXEL = 170 / 2048;

  update(dt: number, t: number, player: THREE.Vector3, weatherFogMul: number, qualityShadows: boolean): PresetP {
    const target = evalPreset(t);
    const c = this.current;
    const k = 1 - Math.exp(-dt * 1.2);
    c.fog = mixHex(c.fog, target.fog, k);
    c.sky = mixHex(c.sky, target.sky, k);
    c.sun = mixHex(c.sun, target.sun, k);
    c.hemiSky = mixHex(c.hemiSky, target.hemiSky, k);
    c.hemiGround = mixHex(c.hemiGround, target.hemiGround, k);
    c.fogDensity = damp(c.fogDensity, target.fogDensity * weatherFogMul, 1.2, dt);
    c.sunI = damp(c.sunI, target.sunI, 1.2, dt);
    c.az = damp(c.az, target.az, 0.8, dt);
    c.alt = damp(c.alt, target.alt, 0.8, dt);
    c.hemiI = damp(c.hemiI, target.hemiI, 1.2, dt);
    c.exposure = damp(c.exposure, target.exposure, 1.2, dt);
    c.env = damp(c.env ?? 0.4, target.env, 1.2, dt);
    c.lamps = damp(c.lamps, target.lamps, 1.5, dt);
    c.floods = damp(c.floods, target.floods, 1.5, dt);

    const scene = this.sun.parent as THREE.Scene;
    scene.background = (_c1.setHex(c.sky), _c1);
    if (scene.fog instanceof THREE.FogExp2) {
      (scene.fog.color as THREE.Color).setHex(c.fog);
      scene.fog.density = c.fogDensity * weatherFogMul;
    }
    this.sun.color.setHex(c.sun);
    this.sun.intensity = c.sunI;
    this.hemi.color.setHex(c.hemiSky);
    this.hemi.groundColor.setHex(c.hemiGround);
    this.hemi.intensity = c.hemiI;

    scene.environmentIntensity = c.env;

    // dome tint + sun disc
    const domeMat = this.dome.material as THREE.MeshBasicMaterial;
    _c1.setHex(c.sky); _c2.setHex(c.fog);
    _c1.lerp(_c2, 0.55).multiplyScalar(1.28);
    domeMat.color.copy(_c1);
    const az = (c.az * Math.PI) / 180, alt = (Math.max(c.alt, 2) * Math.PI) / 180;
    const dir = new THREE.Vector3(Math.cos(alt) * Math.cos(az), Math.sin(alt), Math.cos(alt) * Math.sin(az));
    this.sun.position.copy(player).addScaledVector(dir, 260);
    this.sun.target.position.copy(player);
    if (qualityShadows) {
      // texel snap
      const T = Sky.TEXEL;
      this.sun.target.position.set(Math.round(player.x / T) * T, 0, Math.round(player.z / T) * T);
      this.sun.position.copy(this.sun.target.position).addScaledVector(dir, 260);
    }
    this.sun.target.updateMatrixWorld();

    this.sunDisc.position.copy(this.dome.position).addScaledVector(dir, 1200 * (this.dome.scale.x / 1400));
    this.sunDisc.position.y -= 60 * (this.dome.scale.x / 1400);
    this.sunDisc.lookAt(this.dome.position.x, this.sunDisc.position.y, this.dome.position.z);
    const discMat = this.sunDisc.material as THREE.MeshBasicMaterial;
    discMat.color.setHex(c.sun);
    discMat.opacity = clamp(c.sunI * 0.7, 0, 0.95);

    // lamps / floods / windows emissives
    for (const m of registry.lamps) m.emissiveIntensity = c.lamps * 2.2;
    for (const m of registry.windows) m.emissiveIntensity = Math.max(c.lamps * 1.6, c.floods * 0.6);
    for (const m of registry.floods) m.emissiveIntensity = c.floods * 3.4;
    this.floodsEnabled = c.floods > 0.5;

    return c;
  }

  /** jump current state straight to the preset for `t` (time pinning, tests) */
  snap(t: number, weatherFogMul: number): void {
    const target = evalPreset(t);
    for (const k of Object.keys(target) as Array<keyof PresetP>) {
      (this.current as Record<string, number>)[k] = target[k] as number;
    }
    this.current.fogDensity *= weatherFogMul;
  }

  /** keep the dome (and the sun disc) safely inside the camera far plane */
  setFar(far: number): void {
    const r = Math.max(600, far * 0.9);
    this.dome.scale.setScalar(r);
  }

  get exposure(): number { return this.current.exposure; }
}

function mixHex(a: number, b: number, t: number): number {
  _c1.setHex(a); _c2.setHex(b);
  return _c1.lerp(_c2, t).getHex();
}
