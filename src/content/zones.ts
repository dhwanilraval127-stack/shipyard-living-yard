export interface ZoneRect { id: string; name: string; x0: number; x1: number; z0: number; z1: number; }

/** The yard, as painted on the office floor plan. +X east (gate), +Z south (sea). */
export const ZONES: ZoneRect[] = [
  { id: 'gate',     name: 'YARD GATE',        x0: 140,  x1: 190,  z0: -45,  z1: 20 },
  { id: 'quay',     name: 'MAIN QUAY',        x0: 8,    x1: 140,  z0: 20,   z1: 58 },
  { id: 'ways',     name: 'THE WAYS',         x0: -75,  x1: 10,   z0: 0,    z1: 70 },
  { id: 'cut',      name: 'THE CUT',          x0: -190, x1: -85,  z0: -25,  z1: 75 },
  { id: 'workshop', name: 'FABRICATION SHED', x0: -12,  x1: 56,   z0: -82,  z1: -46 },
  { id: 'steel',    name: 'STEEL STORAGE',    x0: 56,   x1: 130,  z0: -82,  z1: -46 },
  { id: 'overlook', name: 'OVERLOOK',         x0: -175, x1: -75,  z0: -170, z1: -98 },
  { id: 'mainyard', name: 'MAIN YARD',        x0: -85,  x1: 140,  z0: -46,  z1: 20 },
];

export function zoneAt(x: number, z: number): ZoneRect | null {
  for (const zn of ZONES) {
    if (x >= zn.x0 && x <= zn.x1 && z >= zn.z0 && z <= zn.z1) return zn;
  }
  return null;
}
