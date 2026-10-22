import * as THREE from 'three/webgpu';

export interface Collider { x0: number; x1: number; z0: number; z1: number; }

export interface Interactable {
  id: string;
  pos: THREE.Vector3;
  radius: number;
  label: string;
  enabled?: () => boolean;
  act: () => void;
}

export type AmbientKind = 'hammer' | 'grinder' | 'weld' | 'torch';

export interface AmbientPoint { id: string; kind: AmbientKind; pos: THREE.Vector3; }

export interface UpdateCtx {
  dt: number;
  yardSec: number;          // seconds since 00:00 yard time
  player: THREE.Vector3;
  lamps: number;            // 0..1 lamp intensity
  floods: number;
}

export interface Built {
  group: THREE.Group;
  colliders?: Collider[];
  interactables?: Interactable[];
  points?: AmbientPoint[];
}

/** Callbacks the world invokes; main.ts binds them to audio/UI/discovery. */
export interface Hooks {
  stamp(id: string): void;
  doc(id: string): void;
  torbenHorn(): void;
}
