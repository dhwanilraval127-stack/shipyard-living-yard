import * as THREE from 'three/webgpu';

/**
 * Night shift lighting: two pooled floodlights that follow the visitor to the
 * nearest masts, plus the workshop's warm interior. Light is spent, not sprayed.
 */
export class FloodPool {
  private spots: THREE.SpotLight[] = [];
  private workshop: THREE.PointLight;
  private lastPick = 0;

  constructor(scene: THREE.Scene, private masts: THREE.Vector3[]) {
    for (let i = 0; i < 2; i++) {
      const s = new THREE.SpotLight(0xdfe9ff, 0, 150, 0.55, 0.55, 1.5);
      s.visible = false;
      scene.add(s);
      scene.add(s.target);
      this.spots.push(s);
    }
    this.workshop = new THREE.PointLight(0xffc98c, 0, 42, 1.7);
    this.workshop.position.set(22, 6.8, -64);
    scene.add(this.workshop);
  }

  update(dt: number, player: THREE.Vector3, floodsVal: number, dayWork: boolean): void {
    void dt;
    this.lastPick += 1;
    const wantLight = floodsVal > 0.05;
    if (wantLight) {
      const sorted = this.masts
        .map((m, i) => ({ i, d: m.distanceToSquared(player) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      this.spots.forEach((s, k) => {
        const m = this.masts[sorted[k].i];
        s.position.copy(m);
        s.target.position.set(m.x + 2, 0, m.z + 6);
        s.target.updateMatrixWorld();
        s.intensity = floodsVal * 3200;
        s.visible = true;
      });
    } else {
      for (const s of this.spots) { s.intensity = 0; s.visible = false; }
    }
    // the shed stays warm: day work bright, night shift dim
    this.workshop.intensity = dayWork ? 70 : floodsVal * 26;
  }
}
