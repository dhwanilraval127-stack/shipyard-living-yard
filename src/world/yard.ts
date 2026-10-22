import * as THREE from 'three/webgpu';
import { buildGround, GroundBuilt } from './ground';
import { buildGate } from './gate';
import { buildBuildings } from './buildings';
import { buildProps, LAMP_POS, FLOOD_MASTS } from './props';
import { buildElin } from './elin';
import { buildHull44 } from './hull44';
import { buildKirsten, KirstenBuilt } from './kirsten';
import { buildCrane, CraneBuilt } from './crane';
import { buildTorben } from './torben';
import type { Collider, Interactable, AmbientPoint, Hooks } from './types';

export { LAMP_POS, FLOOD_MASTS };

export interface Yard {
  scene: THREE.Scene;
  ground: GroundBuilt;
  kirsten: KirstenBuilt;
  crane: CraneBuilt;
  colliders: Collider[];
  interactables: Interactable[];
  points: AmbientPoint[];
  tick(ctx: { simSec: number; yardSec: number }): void;
}

export function buildYard(hooks: Hooks): Yard {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xa9b2ba, 0.004);

  const ground = buildGround();
  scene.add(ground.group);

  const parts = [
    ['gate', buildGate(hooks)],
    ['buildings', buildBuildings()],
    ['props', buildProps()],
    ['elin', buildElin(hooks)],
    ['hull44', buildHull44(hooks)],
    ['kirsten', buildKirsten()],
    ['crane', buildCrane()],
    ['torben', buildTorben(hooks)],
  ] as const;
  for (const [name, p] of parts) { p.group.name = name; scene.add(p.group); }
  ground.group.name = 'ground';
  const flat = parts.map(([, p]) => p);

  const colliders: Collider[] = [...ground.colliders];
  const interactables: Interactable[] = [];
  const points: AmbientPoint[] = [];
  for (const p of flat) {
    if (p.colliders) colliders.push(...p.colliders);
    if (p.interactables) interactables.push(...p.interactables);
    if (p.points) points.push(...p.points);
  }

  const kirsten = parts.find(([n]) => n === 'kirsten')![1] as KirstenBuilt;
  const craneX = parts.find(([n]) => n === 'crane')![1] as CraneBuilt;
  const torbenX = parts.find(([n]) => n === 'torben')![1] as ReturnType<typeof buildTorben>;

  const tick = (ctx: { simSec: number; yardSec: number }): void => {
    ground.update(ctx.simSec);
    craneX.goliathUpdate({ yardSec: ctx.yardSec });
    torbenX.update({ t: ctx.simSec });
  };

  return { scene, ground, kirsten, crane: craneX, colliders, interactables, points, tick };
}
