# JERNVIK — Milestone M1 Review (First Slice)

**Date:** 2026-08-29 · **Reviewer stance:** external award jury, per §55 of the directive
**Scope built:** directive phases 1–10 (architecture → renderer → loading → environment → player → ELIN → Hull 44 → interaction → audio architecture → heat-stamp discovery prototype)

---

## What exists and is verified

A continuous, walkable shipyard — gate → main yard → two building ways → fabrication shed → steel store → breaking beach → overlook — running locally, offline, on ₹0 of services, in ~222 KB gzipped total.

**Verified by automated headless-browser tests (screenshots in `/shots`, all zero console errors):**

| Claim | Evidence |
|---|---|
| Boots WebGPU-first, falls back to WebGL2 in the same scene graph | boot checklist renders both; backend reported |
| Loading checklist is real state, never a fake percentage | `RENDERER / YARD / VESSELS / TIDE / SURVEY / AUDIO` lines appear in true order |
| First-person surveyor walks from spawn; collision, water boundary, ground follow | SPAWN WALK regression + beach slope tests |
| MV ELIN: beached bow-to-sea, cut open amidships, scaffold, cutting plan, name | screenshots `05-elin`, `d4-elin-bow`, `z1-elevation` |
| HULL 44: primer strakes hinged at the bilge, open frames forward, way cradle | `final-3-hull44`, walkway views |
| HULL 43 launch at 13:15 yard time — siren, rumble, run, splash, spray, horn chorus; alternates launch/rehearsal by day | `f3-launch-run` (countdown PA visible), `f4-launch-afloat` |
| Yard clock drives whistles, PA, tea-break silence, GOLIATH travel, dawn mist, rain window, night floods | clock chip + event captions across `02…08` series |
| Four authored light presets, no continuous sun sim | golden/night/dawn/noon frame series |
| Fully synthesized spatial audio (no files, no music, no licenses needed) | system wired; hear on a real sound device — sandbox could not listen |
| **Heat-stamp discovery arc**: rub keel (HT-58117) → rub H44 S-4 (HT-61204) → rub ELIN strake B (HT-61204) → recognition caption → far foghorn → WO-03 logs → clipboard shows "Same heat. 61204. The new ship is wearing her plate." | `func4.mjs`: RECORDS, CONNECTED:true, ORDERS, NOTE — all green, twice |
| Prompt/card/clipboard/noticeboard/2D-copy UI loop, Escape to put anything down | `func.mjs`, `probe2.mjs` state dumps |
| Sim survives audio-blocked boot and missing audio contexts (guards + loop safety net) | NO-CTX BOOT test, previously-failing sequence re-run clean |

## Jury scores (honest, harsh, current state)

| Category | /10 | Why not higher |
|---|---|---|
| Art direction | 6.5 | Palette/value structure is right; surfaces are still primitive-born. ELIN reads; terrain texture language needs a hero pass |
| Originality | 8.5 | No borrowed grammar anywhere: heat-stamps as narrative, tea-break silence as content, paperwork as UI |
| 3D craft | 5.5 | Boxes and lofts, honestly deployed. The cranes and hull silhouettes carry it; detail density is the gap |
| Interaction | 7 | The 4-verb loop is tight and diegetic; survey-station deep inspection mode not built yet |
| UX | 7.5 | Zero tutorial prose; clipboard as only menu; captions carry everything. Needs playtesting with real hands |
| Story | 8 | The discovery arc *works, mechanically and emotionally paced*; missing VO halves its power |
| Sound | 6 | Architecture is complete and expressive; unverifiable by ear in this sandbox — must be tuned on real speakers |
| Technical execution | 8.5 | Deterministic 30 Hz sim, one code path/two backends, batched draw calls, typed, zero runtime deps beyond three |
| Performance | 6 | Budgets + governor + quality tiers wired; draw calls measured ~500–1300 under software GL. Real-GPU numbers pending |
| Emotional impact | 6.5 | The connection beat lands (verified); arrival and launch need their final polish passes |
| Industrial authenticity | 7 | Practices correct (bow-to-sea, cradles, permits, tide, stamps preserved at cutting). Crew present but stiff |

**The judge remembers:** the clipboard moment — two 61204s, one small italic margin note, a foghorn far away.
**The judge criticizes:** "screenshots look early-stage; where are the people?" (crew now exists but is basic), "I want to climb ELIN's deck."
**Derivative?** No benchmark-adjacent structure survives scrutiny. **AI-slop?** No gradients, no neon, no floating cards; UI is paper and paint.
**Weakest 10%:** water richness, terrain edge detail, shed interior, absence of VO.
**Strongest 10%:** the discovery system, the yard clock's consequences, the floor's painted signage language.

## The five improvements implemented this round (not merely described)

1. **The crew** — 15 figures, 4 baked poses, 4 instanced draw calls, placed by the same schedule that drives sound; they walk routes, take tea at the office, and burn ELIN at night.
2. **Gulls** — 7 instanced checks over the water, gone at night.
3. **Wet ground** — rain darkens and glosses the painted yard floor continuously.
4. **Launch spray + foam** — the splash is now visible, not just audible.
5. **Spawn/arrival fix + ELIN stamp relocation** — the surveyor now spawns outside the office collider facing the gate lamp; the beach stamp sits at its true waterline position with a correct approach.

## Next five (agreed priority)

1. **VO pass** — self-recorded Timekeeper/PA lines behind captions (MLV-critical).
2. **Survey-station mode** — the theodolite moment: ghost/exploded view on HAVFRUEN… on HULL 44 (deterministic, no runtime CSG).
3. **ELIN deck detail** — superstructure interiors, burn marks, cut plate halves leaning on stays.
4. **Dialogue ledger at the Timekeeper's window** — phrase chips + intent map, the §13.3 pattern.
5. **Water second pass** — shoreline foam line + Gerstner-ish vertex swell at low cost.

## Non-negotiables maintained

- ₹0: runtime deps = three.js + 5 local font files. No APIs, no keys, no CDNs, no analytics.
- Offline after install; every asset procedural except fonts.
- No physics engine, no LLM, no voice input, no minimap, no collectibles, no jump.
- Deterministic clock; every event reproducible (tests rely on it).
