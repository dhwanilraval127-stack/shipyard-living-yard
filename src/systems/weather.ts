import * as THREE from 'three/webgpu';
import { streakSprite } from '../engine/tex';
import { clamp, smoothstep } from '../utils/math';

/** CLEAR / RAIN / FOG — driven by the yard clock. Rain falls around the player. */
export class Weather {
  fogMul = 1;
  rain = 0;          // 0..1
  windKt = 9;
  private pts: THREE.Points;
  private geo: THREE.BufferGeometry;
  private pos: Float32Array;
  private budget = 1400;
  private N = 2200;

  constructor(scene: THREE.Scene) {
    this.geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(this.N * 3);
    for (let i = 0; i < this.N; i++) {
      this.pos[i * 3] = (Math.random() - 0.5) * 80;
      this.pos[i * 3 + 1] = Math.random() * 40;
      this.pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    const mat = new THREE.PointsMaterial({
      map: streakSprite(), size: 1.15, transparent: true, opacity: 0.32,
      color: 0xaebcc6, depthWrite: false, sizeAttenuation: true,
    });
    this.pts = new THREE.Points(this.geo, mat);
    this.pts.frustumCulled = false;
    this.pts.visible = false;
    scene.add(this.pts);
  }

  setBudget(n: number): void {
    this.budget = clamp(n, 100, this.N);
  }

  update(dt: number, yardSec: number, player: THREE.Vector3): void {
    const H = 3600;
    // dawn mist thins as the workday starts
    const mist = 1 + 1.35 * (1 - smoothstep(6.6 * H, 8 * H, yardSec)) * smoothstep(3.2 * H, 5.4 * H, yardSec);
    // rain window 10:30–11:15
    const rainT = smoothstep(10.42 * H, 10.62 * H, yardSec) * (1 - smoothstep(11.0 * H, 11.2 * H, yardSec));
    this.fogMul += (mist - this.fogMul) * Math.min(1, dt * 0.4);
    this.rain += (rainT - this.rain) * Math.min(1, dt * 0.3);
    this.windKt = 9 + this.rain * 13;

    this.pts.visible = this.rain > 0.02;
    if (this.pts.visible) {
      const n = Math.min(this.budget, this.N);
      const count = Math.floor(n * this.rain);
      const fall = 26 * dt, slant = this.windKt * 0.14 * dt;
      for (let i = 0; i < count; i++) {
        let x = this.pos[i * 3], y = this.pos[i * 3 + 1], z = this.pos[i * 3 + 2];
        y -= fall;
        x += slant;
        // wrap into a box around the player
        if (y < player.y - 2) y = player.y + 38;
        if (x < player.x - 42) x += 84; if (x > player.x + 42) x -= 84;
        if (z < player.z - 42) z += 84; if (z > player.z + 42) z -= 84;
        this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
      }
      this.geo.attributes.position.needsUpdate = true;
      this.geo.setDrawRange(0, count);
    }
  }
}
