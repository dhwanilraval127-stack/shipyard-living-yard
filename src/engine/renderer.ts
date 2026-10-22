import * as THREE from 'three/webgpu';

export type Backend = 'webgpu' | 'webgl2';

export interface QualityLevel {
  name: string;
  pixelRatio: number;
  shadows: boolean;
  shadowSize: number;
  rain: number;
  far: number;
}

export const QUALITY_LEVELS: Record<'ultra' | 'high' | 'medium' | 'low', QualityLevel> = {
  ultra:  { name: 'ULTRA',  pixelRatio: 2.0, shadows: true,  shadowSize: 2048, rain: 1800, far: 1600 },
  high:   { name: 'HIGH',   pixelRatio: 1.5, shadows: true,  shadowSize: 2048, rain: 1400, far: 1300 },
  medium: { name: 'MEDIUM', pixelRatio: 1.2, shadows: true,  shadowSize: 1024, rain: 900,  far: 1000 },
  low:    { name: 'LOW',    pixelRatio: 1.0, shadows: false, shadowSize: 512,  rain: 400,  far: 750 },
};

/**
 * One code path, two backends. WebGPU first; the same scene graph falls back
 * to WebGL2 inside WebGPURenderer. If neither speaks, the caller drops to 2D.
 */
export class Render {
  readonly three: THREE.WebGPURenderer;
  backend: Backend;
  farPlane = 1600;

  private constructor(r: THREE.WebGPURenderer, backend: Backend) {
    this.three = r;
    this.backend = backend;
  }

  static async create(canvas: HTMLCanvasElement): Promise<Render | null> {
    const attempts: Array<{ forceWebGL: boolean; freshCanvas: boolean }> = [
      { forceWebGL: false, freshCanvas: false },
      { forceWebGL: true, freshCanvas: true },
    ];
    let target = canvas;
    for (const a of attempts) {
      try {
        const r = new THREE.WebGPURenderer({
          canvas: target,
          antialias: true,
          forceWebGL: a.forceWebGL,
        });
        await r.init();
        const isGPU = (r.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend === true;
        const render = new Render(r, isGPU ? 'webgpu' : 'webgl2');
        render.three.shadowMap.enabled = true;
        return render;
      } catch {
        // WebGPU absent or init failed: try the WebGL2 path on a clean canvas.
        if (a.freshCanvas) {
          const fresh = canvas.cloneNode() as HTMLCanvasElement;
          canvas.parentNode?.replaceChild(fresh, canvas);
          target = fresh;
        }
      }
    }
    return null;
  }

  applyQuality(q: QualityLevel): void {
    this.three.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pixelRatio));
    this.three.shadowMap.enabled = q.shadows;
    this.farPlane = q.far;
  }

  resize(): void {
    const w = window.innerWidth, h = window.innerHeight;
    this.three.setSize(w, h, false);
  }

  render(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    this.three.render(scene, camera);
  }

  get stats(): { calls: number; tris: number } {
    const i = this.three.info.render;
    return { calls: i.calls, tris: i.triangles };
  }
}
