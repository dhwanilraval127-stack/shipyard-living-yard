# ASSET LICENSES — the ₹0 ledger

Every byte in this project is accounted for. No paid assets, no subscriptions,
no card-dependent services, no trials. Runtime network requests after install: zero.

| Asset | Source | License | Attribution |
|---|---|---|---|
| three.js (incl. WebGPURenderer/WebGL2 backend) | npm `three@0.180` | MIT | © 2010–2026 three.js authors |
| Barlow, Barlow Condensed (woff2, self-hosted) | npm `@fontsource/*` | SIL Open Font License 1.1 | Jeremy Tribby / STAG fonts |
| TypeScript, Vite (build-time only) | npm | Apache-2.0 / MIT | build toolchain, not shipped |
| All geometry | generated in `src/world/*` at boot | project-original | Jernvik |
| All textures (steel, rust, paint, floor paint, hull bands, water normals, signs, stencils) | painted to `<canvas>` in `src/engine/tex.ts` at boot, deterministic seed 1913 | project-original | Jernvik |
| All audio | synthesized in `src/engine/audio/*` via WebAudio oscillators/noise at runtime | project-original | Jernvik |
| Puppeteer-core + @sparticuz/chromium (dev verification only) | npm | MIT / Apache-2.0 | not shipped, not runtime |

Fonts are embedded locally via npm — no CDN calls. If a future VO track is
self-recorded, record it, note it here, and keep it under the project's own terms.
