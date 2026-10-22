import * as THREE from 'three/webgpu';
import type { Collider } from '../world/types';
import { groundHeight } from '../world/ground';

/**
 * The surveyor. Walks. Looks. Does not jump, sprint, or swim — a professional
 * on a worksite. Capsule-vs-AABB, analytic ground, water is a boundary.
 */
export class PlayerController {
  pos = new THREE.Vector3(181, 0, -11);
  yaw = Math.PI / 2;   // facing west, through the gate
  pitch = -0.02;
  private vel = new THREE.Vector3();
  private stepDist = 0;
  radius = 0.38;
  eye = 1.62;
  speed = 2.6;
  enabled = false;

  forward = new THREE.Vector3();
  private _v = new THREE.Vector3();

  constructor(private colliders: Collider[], private onStep: () => void, private waterY: () => number) {}

  look(dx: number, dy: number, sens: number): void {
    this.yaw -= dx * 0.0021 * sens;
    this.pitch -= dy * 0.0021 * sens;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -1.45, 1.45);
  }

  update(dt: number, move: { x: number; z: number }): void {
    // desired velocity in world space
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    const wx = move.x * cos - move.z * sin;
    const wz = -move.x * sin - move.z * cos;
    const targetVX = wx * this.speed, targetVZ = wz * this.speed;
    const k = 1 - Math.exp(-dt * 10);
    this.vel.x += (targetVX - this.vel.x) * k;
    this.vel.z += (targetVZ - this.vel.z) * k;

    // integrate with collision, axis-separated so shores feel solid but slide
    const tryMove = (ax: 'x' | 'z', amount: number): void => {
      if (amount === 0) return;
      const old = this.pos[ax];
      this.pos[ax] = old + amount;
      const gh = groundHeight(this.pos.x, this.pos.z);
      if (gh < this.waterY() + 0.45) { this.pos[ax] = old; return; }
      if (gh - this.pos.y > 0.42) { this.pos[ax] = old; return; } // too tall a step
      for (const c of this.colliders) {
        if (this.circleHits(c)) {
          this.pos[ax] = old;
          return;
        }
      }
    };
    tryMove('x', this.vel.x * dt);
    tryMove('z', this.vel.z * dt);

    // ground follow (smoothed)
    const gh = groundHeight(this.pos.x, this.pos.z);
    this.pos.y += (gh - this.pos.y) * Math.min(1, dt * 14);

    // yard boundary
    this.pos.x = THREE.MathUtils.clamp(this.pos.x, -182, 181);
    this.pos.z = THREE.MathUtils.clamp(this.pos.z, -176, 74);

    // footsteps
    this.stepDist += Math.hypot(this.vel.x, this.vel.z) * dt;
    if (this.stepDist > 0.85) { this.stepDist = 0; this.onStep(); }

    this.forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this.forward.applyAxisAngle(this._v.set(1, 0, 0), 0); // noop, keep linter calm
  }

  private circleHits(c: Collider): boolean {
    const cx = THREE.MathUtils.clamp(this.pos.x, c.x0, c.x1);
    const cz = THREE.MathUtils.clamp(this.pos.z, c.z0, c.z1);
    const dx = this.pos.x - cx, dz = this.pos.z - cz;
    return dx * dx + dz * dz < this.radius * this.radius;
  }

  applyToCamera(cam: THREE.PerspectiveCamera): void {
    cam.position.set(this.pos.x, this.pos.y + this.eye, this.pos.z);
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    this._v.set(-sin * Math.cos(this.pitch), Math.sin(this.pitch), -cos * Math.cos(this.pitch));
    cam.lookAt(this.pos.x + this._v.x * 10, this.pos.y + this.eye + this._v.y * 10, this.pos.z + this._v.z * 10);
  }
}
