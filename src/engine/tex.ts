import * as THREE from 'three/webgpu';
import { Rng } from './rng';

/**
 * Procedural texture factory. Every surface in the yard is authored here,
 * deterministically, at boot. No image files, no downloads — a zero-cost,
 * offline asset pipeline that fits the art direction: value structure first,
 * weathering that tells a story, detail that reads at 3 metres.
 */

function cnv(w: number, h: number): { c: HTMLCanvasElement; g: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  return { c, g };
}

const rng = new Rng(1913);

export function makeTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
  opts: { srgb?: boolean; repeat?: boolean; mipmaps?: boolean } = {}): THREE.CanvasTexture {
  const { c, g } = cnv(w, h);
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = opts.repeat === false ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.generateMipmaps = opts.mipmaps !== false;
  t.needsUpdate = true;
  return t;
}

/* ---------- shared painters ---------- */

function speckle(g: CanvasRenderingContext2D, w: number, h: number, count: number, alpha: number, dark = 'rgba(0,0,0,1)', light = 'rgba(255,255,255,1)'): void {
  for (let i = 0; i < count; i++) {
    const x = rng.next() * w, y = rng.next() * h, r = rng.range(0.4, 1.6);
    g.fillStyle = rng.chance(0.5) ? dark : light;
    g.globalAlpha = alpha * rng.range(0.3, 1);
    g.fillRect(x, y, r, r);
  }
  g.globalAlpha = 1;
}

function blotches(g: CanvasRenderingContext2D, w: number, h: number, count: number, color: string, aMin: number, aMax: number, rMin: number, rMax: number): void {
  for (let i = 0; i < count; i++) {
    const x = rng.next() * w, y = rng.next() * h, r = rng.range(rMin, rMax);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = rng.range(aMin, aMax);
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  g.globalAlpha = 1;
}

/** vertical weather streaks — rust runs below fittings, gravity does the rest */
function streaks(g: CanvasRenderingContext2D, w: number, h: number, count: number, color: string, aMin: number, aMax: number, y0 = 0): void {
  g.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const x = rng.next() * w;
    const y = y0 + rng.next() * (h - y0) * 0.4;
    const len = rng.range(h * 0.05, h * 0.5);
    const wid = rng.range(0.6, 3.2);
    g.strokeStyle = color;
    g.globalAlpha = rng.range(aMin, aMax);
    g.lineWidth = wid;
    g.beginPath();
    g.moveTo(x, y);
    let cx = x;
    const steps = 6;
    for (let s = 1; s <= steps; s++) {
      cx += rng.range(-2.4, 2.4);
      g.lineTo(cx, y + (len * s) / steps);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---------- ground ---------- */

export function concreteTex(base = '#8d8a85'): THREE.CanvasTexture {
  return makeTex(512, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    blotches(g, w, h, 26, 'rgba(60,58,54,1)', 0.03, 0.09, 20, 90);
    blotches(g, w, h, 16, 'rgba(160,158,150,1)', 0.04, 0.08, 14, 60);
    speckle(g, w, h, 2600, 0.05);
    // expansion joints
    g.strokeStyle = 'rgba(40,38,36,0.5)'; g.lineWidth = 2;
    for (let i = 0; i <= 2; i++) {
      g.beginPath(); g.moveTo((i * w) / 2, 0); g.lineTo((i * w) / 2, h); g.stroke();
      g.beginPath(); g.moveTo(0, (i * h) / 2); g.lineTo(w, (i * h) / 2); g.stroke();
    }
  });
}

export function sandTex(): THREE.CanvasTexture {
  return makeTex(512, 512, (g, w, h) => {
    g.fillStyle = '#95896f'; g.fillRect(0, 0, w, h);
    // tidal ripples — strong enough to read at 3 metres
    for (let band = 0; band < 14; band++) {
      const y = (band / 14) * h + rng.range(-4, 4);
      g.strokeStyle = band % 2 ? 'rgba(58,52,40,0.34)' : 'rgba(178,166,138,0.30)';
      g.lineWidth = rng.range(4, 9);
      g.beginPath();
      for (let x = 0; x <= w; x += 12) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 6 + band * 1.7) * 5);
      g.stroke();
    }
    speckle(g, w, h, 3800, 0.07);
    blotches(g, w, h, 18, 'rgba(52,58,50,1)', 0.04, 0.10, 16, 70); // oil from the work
    blotches(g, w, h, 10, 'rgba(210,200,175,1)', 0.05, 0.12, 20, 60); // shell sand
    // wet band at the bottom of the tile (v≈0 → seaward)
    const wet = g.createLinearGradient(0, h * 0.78, 0, h);
    wet.addColorStop(0, 'rgba(58,54,44,0)');
    wet.addColorStop(1, 'rgba(52,48,40,0.5)');
    g.fillStyle = wet;
    g.fillRect(0, h * 0.78, w, h * 0.22);
  });
}

/* ---------- metals & paint ---------- */

export function plateTex(base: string, rust: number): THREE.CanvasTexture {
  return makeTex(512, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    // brushed streaks
    g.globalAlpha = 0.05;
    for (let i = 0; i < 90; i++) {
      g.strokeStyle = rng.chance(0.5) ? '#000' : '#fff';
      g.lineWidth = rng.range(0.5, 1.6);
      const y = rng.next() * h;
      g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + rng.range(-6, 6)); g.stroke();
    }
    g.globalAlpha = 1;
    if (rust > 0) {
      blotches(g, w, h, Math.floor(10 * rust) + 4, 'rgba(112,66,38,1)', 0.08, 0.3 * rust + 0.08, 8, 46);
      blotches(g, w, h, Math.floor(6 * rust) + 2, 'rgba(66,38,24,1)', 0.06, 0.2, 4, 20);
    }
    speckle(g, w, h, 900, 0.04);
  });
}

export function rustTex(): THREE.CanvasTexture {
  return makeTex(512, 512, (g, w, h) => {
    g.fillStyle = '#6e4630'; g.fillRect(0, 0, w, h);
    blotches(g, w, h, 40, 'rgba(90,52,30,1)', 0.2, 0.5, 12, 70);
    blotches(g, w, h, 30, 'rgba(48,28,18,1)', 0.15, 0.45, 6, 40);
    blotches(g, w, h, 14, 'rgba(140,92,54,1)', 0.1, 0.25, 4, 22);
    speckle(g, w, h, 2000, 0.08);
  });
}

export function corrugatedTex(base: string): THREE.CanvasTexture {
  return makeTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const step = 16;
    for (let x = 0; x < w; x += step) {
      const grd = g.createLinearGradient(x, 0, x + step, 0);
      grd.addColorStop(0, 'rgba(0,0,0,0.22)');
      grd.addColorStop(0.5, 'rgba(255,255,255,0.07)');
      grd.addColorStop(1, 'rgba(0,0,0,0.28)');
      g.fillStyle = grd; g.fillRect(x, 0, step, h);
    }
    streaks(g, w, h, 14, 'rgba(70,45,28,1)', 0.05, 0.16);
    speckle(g, w, h, 700, 0.05);
  });
}

export function timberTex(): THREE.CanvasTexture {
  return makeTex(256, 256, (g, w, h) => {
    g.fillStyle = '#7d6448'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) {
      g.strokeStyle = 'rgba(40,28,16,0.4)'; g.lineWidth = 1.5;
      const y = (i * h) / 7 + 1;
      g.strokeRect(-4, y, w + 8, h / 7 - 2);
    }
    for (let i = 0; i < 60; i++) {
      g.strokeStyle = 'rgba(50,36,20,0.3)';
      g.lineWidth = 0.7;
      const y = rng.next() * h;
      g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + rng.range(-3, 3)); g.stroke();
    }
    speckle(g, w, h, 500, 0.05);
  });
}

/**
 * Hull sides texture. Canvas top = deck edge (v=1), bottom = keel (v=0).
 * Bands: topside / boot topping / antifoul, plus rust runs, scum line, draft marks.
 */
export interface HullTexOpts {
  topside: string; boot: string; bottom: string;
  rust: number;          // 0..1
  scum: boolean;
  draft?: boolean;
}

export function hullTex(o: HullTexOpts): THREE.CanvasTexture {
  return makeTex(1024, 512, (g, w, h) => {
    // canvas y=0 is v=1 (deck edge). Bands from deck down:
    const topY = 0;
    const topsideH = h * 0.58;   // topside band
    const bootH = h * 0.12;      // boot topping
    const botH = h - topsideH - bootH; // antifoul
    g.fillStyle = o.topside; g.fillRect(0, topY, w, topsideH);
    g.fillStyle = o.boot; g.fillRect(0, topsideH, w, bootH);
    g.fillStyle = o.bottom; g.fillRect(0, topsideH + bootH, w, botH);
    // vertical weather streaking on topside
    streaks(g, w, topsideH + 8, Math.floor(50 * o.rust) + 10, 'rgba(74,44,26,1)', 0.06, 0.22 * o.rust + 0.05);
    streaks(g, w, h * 0.7, Math.floor(20 * o.rust) + 4, 'rgba(30,30,30,1)', 0.04, 0.12, topsideH * 0.4);
    // scum + growth at boot line
    if (o.scum) {
      g.strokeStyle = 'rgba(52,58,48,0.5)';
      for (let i = 0; i < 60; i++) {
        const x = rng.next() * w, y = topsideH + rng.range(-4, 4);
        g.lineWidth = rng.range(1, 4);
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + rng.range(6, 26), y + rng.range(-3, 3)); g.stroke();
      }
    }
    // plate seams (horizontal stringers + vertical butts)
    g.strokeStyle = 'rgba(0,0,0,0.16)'; g.lineWidth = 1.4;
    for (const yy of [topsideH * 0.33, topsideH * 0.66, topsideH + bootH]) {
      g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke();
    }
    for (let x = (rng.next() * 60) | 0; x < w; x += rng.range(90, 150)) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x + rng.range(-8, 8), h); g.stroke();
    }
    // rust pooling near boot topping
    if (o.rust > 0.3) {
      for (let i = 0; i < 24 * o.rust; i++) {
        const x = rng.next() * w;
        g.fillStyle = 'rgba(70,40,22,0.28)';
        g.beginPath();
        g.ellipse(x, topsideH + rng.range(-6, 6), rng.range(3, 12), rng.range(6, 20), 0, 0, Math.PI * 2);
        g.fill();
      }
    }
    // draught marks (white, both ends of the texture = bow & stern quarters)
    if (o.draft) {
      g.fillStyle = 'rgba(238,236,228,0.92)';
      g.font = '700 26px "Barlow Condensed", sans-serif';
      g.textAlign = 'center';
      const marks = ['6', '5', '4', '3'];
      marks.forEach((m, i) => {
        for (const cx of [w * 0.09, w * 0.91]) {
          const y = topsideH + 14 + i * 30;
          g.fillText(m, cx, y);
          g.fillRect(cx - 14, y - 22, 28, 2);
        }
      });
    }
    speckle(g, w, h, 1200, 0.04);
  });
}

/** red-oxide primer plating for the new build — clean, seamed, stencilled later */
export function primerTex(): THREE.CanvasTexture {
  return makeTex(512, 512, (g, w, h) => {
    g.fillStyle = '#7d3b2a'; g.fillRect(0, 0, w, h);
    blotches(g, w, h, 12, 'rgba(96,52,36,1)', 0.08, 0.2, 20, 80);
    // plate seams
    g.strokeStyle = 'rgba(38,20,14,0.45)'; g.lineWidth = 2;
    for (const yy of [h * 0.5]) { g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke(); }
    for (let x = 64; x < w; x += 128) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke();
    }
    // runs of fresh black tar near the bottom edge
    streaks(g, w, h * 0.25, 8, 'rgba(20,20,22,1)', 0.1, 0.22, h * 0.75);
    speckle(g, w, h, 500, 0.03);
  });
}

/* ---------- water ---------- */

/** seamless value-noise normal map, three octaves */
export function waterNormalTex(): THREE.CanvasTexture {
  const S = 256;
  const height = new Float32Array(S * S);
  // periodic lattice noise
  const octs = [
    { cells: 8, amp: 0.55 }, { cells: 16, amp: 0.3 }, { cells: 32, amp: 0.15 },
  ];
  const grids = octs.map((o) => {
    const gg: number[] = [];
    for (let i = 0; i < o.cells * o.cells; i++) gg.push(rng.next());
    return { ...o, gg };
  });
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let v = 0;
      for (const o of grids) {
        const fx = (x / S) * o.cells, fy = (y / S) * o.cells;
        const x0 = Math.floor(fx) % o.cells, y0 = Math.floor(fy) % o.cells;
        const x1 = (x0 + 1) % o.cells, y1 = (y0 + 1) % o.cells;
        const tx = fx - Math.floor(fx), ty = fy - Math.floor(fy);
        const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const v00 = o.gg[y0 * o.cells + x0], v10 = o.gg[y0 * o.cells + x1];
        const v01 = o.gg[y1 * o.cells + x0], v11 = o.gg[y1 * o.cells + x1];
        v += o.amp * ((v00 * (1 - sx) + v10 * sx) * (1 - sy) + (v01 * (1 - sx) + v11 * sx) * sy);
      }
      height[y * S + x] = v;
    }
  }
  return makeTex(S, S, (g, w, h) => {
    const img = g.createImageData(w, h);
    const at = (x: number, y: number) => height[(((y % h) + h) % h) * w + (((x % w) + w) % w)];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = at(x + 1, y) - at(x - 1, y);
        const dy = at(x, y + 1) - at(x, y - 1);
        const nx = -dx * 2.2, ny = -dy * 2.2, nz = 1;
        const len = Math.hypot(nx, ny, nz);
        const i = (y * w + x) * 4;
        img.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
        img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
        img.data[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
        img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
  }, { srgb: false });
}

/* ---------- signage ---------- */

const STAMP_FONT = '"Barlow Condensed", "Arial Narrow", sans-serif';

export function signTex(rows: string[], opts: {
  w?: number; bg?: string; fg?: string; border?: string; size?: number; align?: CanvasTextAlign; sub?: string[]; pad?: number;
} = {}): THREE.CanvasTexture {
  const w = opts.w ?? 512;
  const size = opts.size ?? 44;
  const pad = opts.pad ?? 22;
  const subH = (opts.sub?.length ?? 0) * (size * 0.62);
  const h = Math.max(72, rows.length * (size + 14) + subH + pad * 2);
  return makeTex(w, h, (g) => {
    g.fillStyle = opts.bg ?? '#7a2e22'; g.fillRect(0, 0, w, h);
    if (opts.border !== 'none') {
      g.strokeStyle = opts.fg ?? '#e9e4d8';
      g.lineWidth = 3;
      g.strokeRect(6, 6, w - 12, h - 12);
    }
    g.fillStyle = opts.fg ?? '#e9e4d8';
    g.textAlign = opts.align ?? 'center';
    g.textBaseline = 'middle';
    const total = rows.length + (opts.sub?.length ?? 0) * 0.62;
    let y = h / 2 - (total * (size + 14)) / 2 + (size + 14) / 2 + pad * 0;
    g.font = `700 ${size}px ${STAMP_FONT}`;
    for (const r of rows) {
      // letterspacing
      const spaced = r.split('').join('\u200a');
      g.fillText(spaced, w / 2, y, w - pad * 2);
      y += size + 14;
    }
    g.font = `500 ${size * 0.6}px ${STAMP_FONT}`;
    for (const r of opts.sub ?? []) {
      const spaced = r.split('').join('\u200a');
      g.fillText(spaced, w / 2, y, w - pad * 2);
      y += size * 0.62;
    }
  });
}

/** chalk stencil decal on plates: "61204 B — SLAB 7" */
export function stencilTex(lines: string[], color = 'rgba(235,230,218,0.94)'): THREE.CanvasTexture {
  const w = 256, lh = 40, h = lines.length * lh + 28;
  return makeTex(w, h, (g) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = color; g.lineWidth = 3;
    g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = color;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 30px ${STAMP_FONT}`;
    lines.forEach((l, i) => {
      const spaced = l.split('').join('\u200a');
      g.fillText(spaced, w / 2, 28 + i * lh);
    });
  });
}

/** ship name on the hull: white letters, transparent elsewhere */
export function nameTex(name: string, port: string): THREE.CanvasTexture {
  return makeTex(512, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(238,234,224,0.95)';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 64px ${STAMP_FONT}`;
    g.fillText(name.split('').join('\u200a'), w / 2, h / 2 - 14);
    g.font = `500 22px ${STAMP_FONT}`;
    g.fillText(port.split('').join('\u200a'), w / 2, h - 22);
  });
}

/** the cutting plan: a paper table on a board */
export function cuttingPlanTex(): THREE.CanvasTexture {
  const w = 384, h = 480;
  return makeTex(w, h, (g) => {
    g.fillStyle = '#ddd6c4'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2c2e30';
    g.textAlign = 'left'; g.textBaseline = 'top';
    g.font = `700 26px ${STAMP_FONT}`;
    g.fillText('MV ELIN — CUTTING PLAN', 18, 16);
    g.font = `500 15px ${STAMP_FONT}`;
    g.fillText('JRN/BRK/ELIN/07 — REV 3', 18, 46);
    g.strokeStyle = '#2c2e30'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(18, 68); g.lineTo(w - 18, 68); g.stroke();
    const rows: [string, string][] = [
      ['POS 4', 'STRAKE C → STOCK'],
      ['POS 5', 'STRAKE B PL 110 → STOCK'],
      ['POS 6', 'STRAKE B PL 114 → STOCK'],
      ['POS 7', 'STRAKE B PL 118 → STOCK'],
      ['POS 8', 'STRAKE B → STOCK'],
      ['POS 9', 'TANK TOP → SCRAP'],
      ['POS 10', 'FRAMES → SCRAP'],
      ['—', 'STAMPS PRESERVED AT CUT'],
    ];
    g.font = `500 16px ${STAMP_FONT}`;
    rows.forEach(([a, b], i) => {
      const y = 78 + i * 26;
      g.fillText(a, 18, y);
      g.fillText(b, 96, y);
      g.strokeStyle = 'rgba(44,46,48,0.25)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(18, y + 20); g.lineTo(w - 18, y + 20); g.stroke();
    });
    g.font = `500 14px ${STAMP_FONT}`;
    g.fillText('CUTTING BY PERMIT ONLY — BURNER’S AREA', 18, h - 64);
    g.fillText('JERNVIK SHIPBUILDING & SALVAGE CO.', 18, h - 40);
    // weathering
    blotches(g, w, h, 8, 'rgba(110,96,70,1)', 0.06, 0.16, 10, 40);
    speckle(g, w, h, 300, 0.05);
  });
}

/** hazard stripes for crane bases and way ends */
export function hazardTex(): THREE.CanvasTexture {
  return makeTex(128, 128, (g, w, h) => {
    g.fillStyle = '#c8a428'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1c1d1f';
    for (let i = -h; i < w + h; i += 32) {
      g.beginPath();
      g.moveTo(i, 0); g.lineTo(i + 16, 0); g.lineTo(i + 16 - h, h); g.lineTo(i - h, h);
      g.closePath(); g.fill();
    }
    speckle(g, w, h, 200, 0.08);
  });
}

/** blueprint-style site plan (overlook board) */
export function sitePlanTex(): THREE.CanvasTexture {
  const w = 512, h = 384;
  return makeTex(w, h, (g) => {
    g.fillStyle = '#28406b'; g.fillRect(0, 0, w, h); // blueprint blue, desaturated
    g.strokeStyle = 'rgba(214,224,236,0.85)'; g.lineWidth = 1.5;
    // yard outline
    g.strokeRect(60, 60, 340, 240);
    // sea
    g.fillStyle = 'rgba(214,224,236,0.14)';
    g.fillRect(60, 300, 340, 40);
    g.fillStyle = 'rgba(214,224,236,0.85)';
    g.font = `700 15px ${STAMP_FONT}`;
    g.fillText('JERNVIK — GENERAL ARRANGEMENT', 70, 34);
    g.font = `500 11px ${STAMP_FONT}`;
    const labels: [string, number, number][] = [
      ['GATE', 360, 150], ['MAIN YARD', 200, 165], ['WORKSHOP', 120, 92],
      ['STEEL STORE', 300, 92], ['OVERLOOK', 84, 270], ['QUAY', 240, 288],
      ['WAY 1 · HULL 44', 150, 240], ['WAY 2 · HULL 43', 190, 240],
      ['ELIN — THE CUT', 80, 210], ['GOLIATH', 160, 225],
    ];
    for (const [t, x, y] of labels) g.fillText(t, x, y);
    // north arrow
    g.strokeStyle = 'rgba(214,224,236,0.85)';
    g.beginPath(); g.moveTo(452, 60); g.lineTo(452, 96); g.stroke();
    g.beginPath(); g.moveTo(452, 54); g.lineTo(446, 68); g.lineTo(458, 68); g.closePath();
    g.fillStyle = 'rgba(214,224,236,0.85)'; g.fill();
    blotches(g, w, h, 6, 'rgba(16,24,40,1)', 0.05, 0.12, 20, 60);
  });
}

/** rain streak sprite */
export function streakSprite(): THREE.CanvasTexture {
  return makeTex(16, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, 'rgba(200,212,222,0)');
    grd.addColorStop(0.5, 'rgba(200,212,222,0.55)');
    grd.addColorStop(1, 'rgba(200,212,222,0)');
    g.fillStyle = grd;
    g.fillRect(w / 2 - 1.2, 0, 2.4, h);
  }, { mipmaps: false });
}

/** subtle vertical-gradient sky dome (tinted per preset by material color) */
export function skyTex(): THREE.CanvasTexture {
  return makeTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.62, '#cfd4d8');
    grd.addColorStop(0.78, '#e6e4de');
    grd.addColorStop(1, '#dcd9d2');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  }, { repeat: false });
}


/**
 * THE YARD FLOOR. One canvas is the whole slab's paint: roads, walkway lines,
 * hatched live-works zones, ground stencils, tire marks, oil, repairs.
 * The yard's signage system is painted on the ground it governs.
 * World mapping: x -190..190 -> u, z -62..58 -> v. 2048 x 640 px (~5.4 px/m).
 */
export function yardFloorTex(): THREE.CanvasTexture {
  const W = 2048, H = 640;
  const px = (x: number): number => ((x + 190) / 380) * W;
  const pz = (z: number): number => ((58 - z) / 120) * H;
  const m = W / 380; // pixels per metre

  return makeTex(W, H, (g) => {
    // base concrete
    g.fillStyle = '#8f8c86'; g.fillRect(0, 0, W, H);
    blotches(g, W, H, 60, 'rgba(96,93,88,1)', 0.05, 0.14, 30, 120);
    blotches(g, W, H, 40, 'rgba(158,155,148,1)', 0.04, 0.10, 20, 80);
    speckle(g, W, H, 9000, 0.05);
    // concrete slab joints
    g.strokeStyle = 'rgba(52,50,47,0.4)'; g.lineWidth = 2;
    for (let x = -190; x <= 190; x += 20) { g.beginPath(); g.moveTo(px(x), 0); g.lineTo(px(x), H); g.stroke(); }
    for (let z = -60; z <= 60; z += 20) { g.beginPath(); g.moveTo(0, pz(z)); g.lineTo(W, pz(z)); g.stroke(); }

    // main road: gate (east) to the ways head (west), x -60..176 at z -14..-2
    g.fillStyle = '#575754';
    g.fillRect(px(-62), pz(-2), (176 - -62) * m, 12 * m);
    blotches(g, W, H, 26, 'rgba(40,40,38,1)', 0.05, 0.13, 14, 60);
    // re-run blotches clipped to road via redraw: simple dark wear band along wheel lines
    g.strokeStyle = 'rgba(43,43,41,0.35)'; g.lineWidth = 3.4 * m * 0.35;
    for (const dz of [-9.4, -6.8, -4.6]) {
      g.beginPath();
      for (let x = -60; x <= 174; x += 8) g.lineTo(px(x), pz(dz) + Math.sin(x * 0.05) * 1.5);
      g.stroke();
    }

    // yellow walkway lines both sides of the road
    g.strokeStyle = 'rgba(202,168,38,0.95)'; g.lineWidth = Math.max(3.4, 0.34 * m);
    for (const dz of [-13.2, -2.8]) {
      g.beginPath(); g.moveTo(px(-62), pz(dz)); g.lineTo(px(176), pz(dz)); g.stroke();
    }
    // hatched keep-clear at the ways head (x -60..-30)
    g.save();
    g.beginPath();
    g.rect(px(-62), pz(0), 32 * m, 14 * m);
    g.clip();
    g.strokeStyle = 'rgba(196,164,40,0.6)';
    g.lineWidth = Math.max(2, 0.22 * m);
    for (let x = -64; x < -28; x += 1.6) {
      g.beginPath(); g.moveTo(px(x), pz(0)); g.lineTo(px(x + 14), pz(14)); g.stroke();
    }
    g.restore();

    // burner route: red painted lane toward the Cut (x -85..-40, z 6..10)
    g.fillStyle = 'rgba(122,46,34,0.55)';
    g.fillRect(px(-85), pz(10), 45 * m, 4 * m);
    // stage lane toward the ways (x -30..10, z 2..6)
    g.fillStyle = 'rgba(122,46,34,0.4)';
    g.fillRect(px(-30), pz(6), 40 * m, 4 * m);

    // ground stencils — the yard labels its own floor
    g.fillStyle = 'rgba(232,228,216,0.9)';
    g.font = `700 ${Math.round(3.4 * m)}px "Barlow Condensed", "Arial Narrow", sans-serif`;
    g.textAlign = 'center';
    const stencil = (t: string, x: number, z: number, rot = 0): void => {
      g.save();
      g.translate(px(x), pz(z));
      g.rotate(rot);
      g.fillText(t.split('').join('\u200a'), 0, 0);
      g.restore();
    };
    stencil('MAIN YARD', 40, 12);
    stencil('GATE', 160, 6);
    stencil('THE CUT', -62, 20, -0.06);
    stencil('WAYS', -26, -20, 0.04);
    stencil('HULL 44', -46, 14, 0.03);
    stencil('SLOW', 120, -8);
    stencil('SLOW', -8, -8);
    // direction arrows
    g.strokeStyle = 'rgba(232,228,216,0.8)';
    g.lineWidth = Math.max(3, 0.3 * m);
    const arrow = (x: number, z: number, dx: number, dz: number): void => {
      const ax = px(x), az = pz(z);
      g.beginPath();
      g.moveTo(ax - dx * 2 * m, az - dz * 2 * m);
      g.lineTo(ax + dx * 2 * m, az + dz * 2 * m);
      g.moveTo(ax + dx * 2 * m, az + dz * 2 * m);
      g.lineTo(ax + dx * 1.2 * m - dz * 0.8 * m, az + dz * 1.2 * m + dx * 0.8 * m);
      g.moveTo(ax + dx * 2 * m, az + dz * 2 * m);
      g.lineTo(ax + dx * 1.2 * m + dz * 0.8 * m, az + dz * 1.2 * m - dx * 0.8 * m);
      g.stroke();
    };
    arrow(60, -8, -1, 0);
    arrow(-70, 16, -1, 0.2);
    arrow(100, -8, 1, 0);

    // tire marks: short, faint, on the road only
    g.strokeStyle = 'rgba(45,44,42,0.16)';
    g.lineWidth = 2;
    for (let i = 0; i < 22; i++) {
      const x0 = rng.range(-58, 168), z0 = rng.range(-11.5, -3.5);
      g.beginPath();
      g.moveTo(px(x0), pz(z0));
      g.bezierCurveTo(px(x0 + rng.range(-3, 3)), pz(z0 + rng.range(-2, 2)), px(x0 + rng.range(-7, 7)), pz(z0 + rng.range(-3, 3)), px(x0 + rng.range(-10, 10)), pz(z0 + rng.range(-4, 4)));
      g.stroke();
    }
    // oil stains + repairs
    blotches(g, W, H, 34, 'rgba(38,36,34,1)', 0.10, 0.28, 4, 18);
    for (let i = 0; i < 10; i++) {
      const x = rng.next() * W, y = rng.next() * H, w = rng.range(40, 130), h = rng.range(20, 60);
      g.fillStyle = rng.chance(0.5) ? 'rgba(120,116,108,0.35)' : 'rgba(70,68,64,0.3)';
      g.fillRect(x, y, w, h);
      g.strokeStyle = 'rgba(50,48,45,0.4)'; g.lineWidth = 1.5;
      g.strokeRect(x, y, w, h);
    }
    // puddle shadows near the quay (salt damp)
    blotches(g, W, H, 14, 'rgba(62,66,62,1)', 0.10, 0.2, 10, 36);
    // edge grime at the quay lip
    const lip = g.createLinearGradient(0, pz(58), 0, pz(44));
    lip.addColorStop(0, 'rgba(60,58,54,0.4)');
    lip.addColorStop(1, 'rgba(60,58,54,0)');
    g.fillStyle = lip;
    g.fillRect(0, pz(58), W, pz(44) - pz(58));
  });
}


/** Grey northern sky as an equirect environment: metals need something to reflect. */
export function envEquirect(): THREE.CanvasTexture {
  const t = makeTex(256, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#c9d2da');   // zenith
    grd.addColorStop(0.45, '#aeb9c2');// horizon haze
    grd.addColorStop(0.5, '#8d979e');
    grd.addColorStop(0.62, '#4a5054');// ground bounce
    grd.addColorStop(1, '#33383c');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    // faint sun patch so specular has an anchor
    g.fillStyle = 'rgba(255,244,222,0.85)';
    g.beginPath(); g.ellipse(w * 0.22, h * 0.32, 14, 9, 0, 0, Math.PI * 2); g.fill();
  }, { repeat: false });
  t.mapping = THREE.EquirectangularReflectionMapping;
  return t;
}
