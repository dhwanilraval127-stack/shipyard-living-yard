import * as THREE from 'three/webgpu';
import {
  concreteTex, sandTex, plateTex, rustTex, corrugatedTex, timberTex, primerTex, hazardTex,
} from './tex';
export { Batch } from './builder';

/** Shared, cached materials. Everything repeats; nothing is unique unless it earns it. */

const cacheM = new Map<string, THREE.MeshStandardMaterial>();

export interface StdOpts {
  color?: number | string;
  roughness?: number;
  metalness?: number;
  map?: THREE.Texture | null;
  emissive?: number | string;
  emissiveIntensity?: number;
  side?: THREE.Side;
  transparent?: boolean;
  opacity?: number;
  alphaTest?: number;
}

export function std(key: string, o: StdOpts = {}): THREE.MeshStandardMaterial {
  const hit = cacheM.get(key);
  if (hit) return hit;
  const m = new THREE.MeshStandardMaterial({
    color: o.color ?? 0x9a9a96,
    roughness: o.roughness ?? 0.85,
    metalness: o.metalness ?? 0.05,
    map: o.map ?? null,
    emissive: o.emissive ?? 0x000000,
    emissiveIntensity: o.emissiveIntensity ?? 1,
    side: o.side ?? THREE.FrontSide,
    transparent: o.transparent ?? false,
    opacity: o.opacity ?? 1,
    alphaTest: o.alphaTest ?? 0,
  });
  cacheM.set(key, m);
  return m;
}

/* ---------- shared instances ---------- */

export const M = {
  get concrete() { return std('concrete', { map: concreteTex(), color: 0xbdb9b2, roughness: 0.94, metalness: 0 }); },
  get asphalt() { return std('asphalt', { map: concreteTex('#6d6d6a'), color: 0x8f8f8c, roughness: 0.96, metalness: 0 }); },
  get sand() { return std('sand', { map: sandTex(), color: 0xb3a789, roughness: 1, metalness: 0 }); },
  get steel() { return std('steel', { color: 0x565c60, roughness: 0.52, metalness: 0.82 }); },
  get steelDark() { return std('steelDark', { color: 0x3a3f43, roughness: 0.6, metalness: 0.75 }); },
  get steelFresh() { return std('steelFresh', { color: 0x9aa2a8, roughness: 0.4, metalness: 0.9 }); },
  get cutEdge() { return std('cutEdge', { color: 0xb87a44, roughness: 0.35, metalness: 0.85, emissive: 0x1a0e05, emissiveIntensity: 1 }); },
  get rust() { return std('rust', { map: rustTex(), color: 0x9c8065, roughness: 0.95, metalness: 0.12 }); },
  get primer() { return std('primer', { map: primerTex(), color: 0xa8614a, roughness: 0.72, metalness: 0.25 }); },
  get hazard() { return std('hazard', { map: hazardTex(), color: 0xd8cfae, roughness: 0.8, metalness: 0.1 }); },
  get timber() { return std('timber', { map: timberTex(), color: 0xa08a6a, roughness: 0.9, metalness: 0 }); },
  get rubber() { return std('rubber', { color: 0x1d1f21, roughness: 0.95, metalness: 0 }); },
  get glassDark() { return std('glassDark', { color: 0x141c24, roughness: 0.18, metalness: 0.7 }); },
  get oxide() { return std('oxide', { color: 0x7a2e22, roughness: 0.68, metalness: 0.22 }); },
  get oxideDim() { return std('oxideDim', { color: 0x5f2820, roughness: 0.8, metalness: 0.15 }); },
  get paper() { return std('paper', { color: 0xddd6c4, roughness: 0.9, metalness: 0 }); },

  painted(key: string, color: number, rough = 0.55) { return std(key, { color, roughness: rough, metalness: 0.3 }); },

  corrugated(key: string, base: string) { return std(key, { map: corrugatedTex(base), roughness: 0.78, metalness: 0.42 }); },

  /** emissive lamp head — intensity is driven by the clock */
  get lampOn() {
    const m = std('lampOn', { color: 0x2a2d30, roughness: 0.6, metalness: 0.4, emissive: 0xffd9a0, emissiveIntensity: 0 });
    registry.lamps.push(m);
    return m;
  },
  /** lit window at dawn/night */
  get windowLit() {
    const m = std('windowLit', { color: 0x1c2126, roughness: 0.3, metalness: 0.5, emissive: 0xffc98c, emissiveIntensity: 0 });
    registry.windows.push(m);
    return m;
  },
  get floodHead() {
    const m = std('floodHead', { color: 0x303539, roughness: 0.5, metalness: 0.5, emissive: 0xe8f2ff, emissiveIntensity: 0 });
    registry.floods.push(m);
    return m;
  },
  /** weld arc — flicker driven by production system */
  get weldArc() {
    const m = std('weldArc', { color: 0x222528, roughness: 0.5, metalness: 0.3, emissive: 0xcfe8ff, emissiveIntensity: 0 });
    registry.welds.push(m);
    return m;
  },
};

/** emissive registries the lighting system drives */
export const registry = {
  lamps: [] as THREE.MeshStandardMaterial[],
  windows: [] as THREE.MeshStandardMaterial[],
  floods: [] as THREE.MeshStandardMaterial[],
  welds: [] as THREE.MeshStandardMaterial[],
};

export { plateTex, rustTex, primerTex };
