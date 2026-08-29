# SHIPYARD — THE LIVING YARD

**Production Blueprint — v1.0 (Draft for Sign-off)**

| | |
|---|---|
| Document status | DRAFT — awaiting creative/technical sign-off |
| Author | Lead Creative / Technical / Interaction Direction |
| Date | 2026-08-29 |
| Supersedes | Nothing (initial blueprint) |
| Implementation | **Not started by design.** Nothing in this document may be coded against until §32 is signed off. |

**How to read this document.** Sections 1–14 are creative and experiential. Sections 15–25 are structural and technical. Sections 26–32 are execution, verification, and the honest reckoning about scope. Every section ends with a **Critical note** — the arguments we had with ourselves, and the cuts that came out of them. The cut list (§29) is as much a part of this blueprint as any feature.

---

## 0. Executive thesis

**The pitch, in one sentence:**

> A working shipyard on a grey northern sea — where ships are born from the steel of ships that died here — and the yard itself is the website: no pages, no menus; buildings, cranes, tides, sirens and voices are the navigation.

**The idea that earns the whole project:** Jernvik is a yard that both *builds* and *breaks* ships. At its western edge, a vessel is being taken apart, plate by plate, on the beach. At its heart, a new hull is rising on the ways. The visitor arrives as a new employee on induction day. Over the course of a visit, a quiet truth surfaces: the steel going into the new ship came out of the old one. The yard's law, stamped above the gate since 1913: **"We only launch what we can remember."**

**Pillars, ranked.** Rank matters — when features conflict, the higher pillar wins.

1. **AUTHENTICITY** — everything reads true: the paperwork, the weld spatter, the two-note crane horn, the union whistle at shift change. One false detail collapses the spell.
2. **IMMERSION** — the visitor forgets the browser chrome exists. No modal may interrupt the world. Sound carries orientation.
3. **RESTRAINT** — the editor-in-chief pillar. Every effect must trace to a fiction or a function. Anything present "because it looks cool" gets cut in the M8 pass, without appeal.
4. **PERFORMANCE** — respect for the visitor's machine is hospitality, not engineering vanity. A dropped frame is a hole in the fiction.
5. **STORYTELLING** — one story (the cycle of a ship's steel), told three ways, beats six stories told once.
6. **ORIGINALITY** — deliberately ranked last, because originality is a *byproduct* of specificity, not a goal you can aim at. We will be original by being ruthlessly specific about one shipyard, not by stacking novelty.

**"The world is the website," operationalized:**

- 100% of informational content is reachable through *space* — by walking, riding, or listening.
- The URL is a *place*: `/dry-dock-1`, `/the-cut`, `/registry/elin`. Places deep-link; places are crawlable (§25).
- The HUD is a clipboard. The map is a blueprint table. Narration is a loudspeaker. Settings are a noticeboard.
- The fallback site (§25) is the same yard in words — the yard's own paper archive.

**Success criteria (measurable, not vibes):**

| Criterion | Target |
|---|---|
| Median session length | ≥ 6 minutes |
| Visitors reaching ≥ 3 distinct zones | ≥ 55% |
| Visitors witnessing the Launch event | ≥ 30% |
| Muted-comprehension test (sound off, can a viewer navigate & learn?) | Pass, no exceptions |
| Sustained 45 fps on 2019 integrated graphics (Tier B-min) | Pass |
| Every content item reachable without mouse, without audio, without vision (§16) | Pass |
| First-time user needs no tutorial prose | Pass |

---

## 1. Creative direction

### 1.1 Logline and tone

**Logline:** On your first morning at a century-old shipyard, you are handed a clipboard, a hard hat, and six work orders — and a yard that builds ships from the bones of dead ones slowly tells you why.

**Tone:** *Documentary realism with one held breath of magic.* The reference feeling is a Burtynsky shipbreaking photograph that suddenly blinks: the welder lifts her mask, the gantry crane groans awake, the fog lifts and the new hull is *there*. Nothing supernatural ever happens. The "magic" is that the yard is coherent, alive, and remembers everything.

**What this is NOT (binding creative exclusions):**

- Not cyberpunk. No neon, no holograms-as-decor, no rain-slicked Chinatown pastiche.
- Not a toy world. Nothing bounces cutely. Steel is heavy. Torben the yard tractor takes three seconds to get moving and everyone accepts that.
- Not dystopian. The yard is neither a ruin-porn set nor an ESG brochure. It is a working place with dignity: the breaking beach is hard and honest, and the yard is proud, not defensive, about what it does.
- Not a game in structure. No fail states, no scores, no health bars, no puzzles that gate content.

### 1.2 The fiction (worn lightly)

**Jernvik Shipbuilding & Salvage Co. — est. 1913.** Founded as a breaker's yard; began *building* during wartime from the steel it was salvaging, and never stopped doing both. The staff talk about steel the way vintners talk about vineyards — plate provenance, heat numbers, "she's good steel, she was laid down in '61." The poetic conceit — *steel remembered* — is never announced. It is discovered, in documents, in plate stamps, in one quiet room (§14, The Reveal).

The harbor's country and city are deliberately unnamed. Northern-European-ish, grey, universal. Language of signage: English with stamped North-Sea loanwords (VERFT, KAI 3, VARSSEL) for texture — never enough to confuse.

### 1.3 Emotional map per zone

| Zone | Target feeling (2–3 words) |
|---|---|
| Yard Gate & Timekeeper's Office | welcomed, handed-something |
| The Ways (slipways) | awe, vertigo |
| Dry Dock No. 1 | intimacy, curiosity |
| The Cut (breaking beach) | uneasy beauty, respect |
| Fabrication Sheds | craft, warmth |
| Fitting-Out Basin | scale, calm |
| Harbor & Quay | play, air |
| Overlook Hill | understanding |

### 1.4 Voice of the copy

Dry northern understatement. Safety-notice cadence. **No exclamation marks, anywhere, ever.** Examples:

- Gate sign: `ALL VISITORS REPORT TO THE TIMEKEEPER. HARD HATS ARE NOT OPTIONAL. THEY NEVER WERE.`
- Work order: `WO-04 — SURVEY, DRY DOCK NO. 1. Take the gauge to the dock floor. Look at her properly this time. — V.`
- PA: `Attention on yard. Launch rehearsal at the ways in ninety seconds. Stand clear of the cradle. This means you, Torben.`

### 1.5 Signature moments (only four; we protect these from feature creep)

1. **The Arrival** (first 30 seconds): mist, a gate lamp, a ship's silhouette resolving out of fog, the PA saying your name-tag. First impression is *weather and sound*, not UI.
2. **The Launch** (recurring world event, ~every 20 real minutes, with a 90-second PA countdown): the whole yard stops, sirens, the hull slides, tugs nose her, spray, horns. Every visitor has a chance to see it; at night it is a different, floodlit show.
3. **The Reveal**: in the archive room, a survey of Hull 44's keel plates; the stamped heat numbers match MV ELIN's breakwater manifest, laid on the same table. No music cue. A pause, then the yard whistle. Understatement *is* the drama.
4. **The cat.** A yard cat named Sparks who sleeps on warm transformer housings and appears in four places on a fixed route. Zero cost, disproportionate memorability. Jurors remember the cat.

**Critical note.** We considered a fifth signature — a "steel memory" ghost-overlay showing every ship ever broken at the beach — and cut it. One held breath of magic means *one*. The Reveal carries it.

---

## 2. Art direction

### 2.1 Visual thesis: **The Overcast Sublime**

A softbox sky. Steel, rust, concrete and water are the color story; humans appear as high-vis punctuation. The drama is tonal (value structure), not chromatic. Color is spent like money, and only on things that *mean*: safety orange marks what you may engage; oxide red is the yard's brand; everything else is grey doing honest work.

### 2.2 References (for alignment, never for copying)

- **Edward Burtynsky**, *Shipbreaking* series — composition of industrial scale, palette discipline.
- **Roger Deakins** overcast exteriors (e.g., *1917*, *The Man Who Wasn't There*) — value structure under flat light.
- ***Chernobyl* (2019)** — production-design authenticity as narrative authority; paperwork as texture.
- ***Inside* (Playdead)** — restraint; one idea per screen; environmental storytelling without words.
- Real reference: Chittagong/Alang breaking beaches (composition only), Scandinavian and Baltic repair yards (procedure, signage, paperwork).

### 2.3 Palette system

| Role | Color | Usage |
|---|---|---|
| Base neutrals | Fog grey #B8BDC2 · Wet steel #4A5054 · Concrete #8D8A85 · Harbor water #3E4A50 | ~85% of all pixels |
| Interactive accent | Signal orange #E8641B | *Only* on engageable things. If it's orange, you can do something. Enforced by lint. |
| Caution | Chrome yellow | Hazard marking only, never interactive |
| Yard brand | Oxide red #7A2E22 | Signage, door frames, the gate |
| Magic | Weld blue-white #CFE8FF, arc amber | Emissive events only (welding, night floods) |

Color script per time preset (§12) adjusts exposure, sun color and fog, but the *hue discipline* above never changes.

### 2.4 Materials and weathering

- Full PBR, channel-packed ORM, KTX2/Basis (§18).
- Weathering must *tell*: rust runs below fittings, boot scuffs at door thresholds, chalk tallies on plate edges, paint drips under repainted rails. **No decorative grunge** — if a stain has no author, it does not ship.
- Trim-sheet strategy for shed interiors and hull structures; decal atlas for streaks, stencil numbers, weld seams, oil.
- One texture sentence we will not violate: *detail visible at 3 meters matters more than detail visible at 30 centimeters.* This is a world seen in motion.

### 2.5 Shape language

- **Horizontal mass** (ships, sheds, quays) against **vertical accents** (gantry crane GOLIATH, mast, lighthouse, cranes' booms).
- The repeating rhythm of hull frames and shed trusses is the yard's visual "brand pattern."
- Silhouettes are hand-carved slightly beyond realism (~5–8% exaggeration) so 85-meter ships read at 400 meters. This is the one stylization we allow ourselves, and it is in service of scale honesty, not style.

### 2.6 FX restraint rules (hard limits, enforced in review)

- Maximum **2** compositing/post effects active at once (e.g., TAA + subtle grain). Bloom exists solely for emissive sources (weld arcs, night floods, gate lamp) — never on surfaces, never on text.
- Film grain ≤ 2%, no lens flare except the sun from Overlook Hill, no chromatic aberration except during the Launch impact beat (≤ 1.5s, reduced-motion exempt).
- Sparks, dust, steam and smoke are *event-driven*, never ambient wallpaper. Dust motes appear only inside shed light shafts.
- Water: one ocean shader, tuned, not five. No "hero water" and "meh water" — one good water everywhere.

### 2.7 Lighting doctrine

One sun/sky system, baked or probe-based ambient per zone, and at most **2 dynamic local lights** per view. The welding arc is the yard's living light — pooled, flickering, coherent with audio (§10). Night (§12) is floodlight art direction, not a darkness sim.

### 2.8 Character art stance

Silhouette-first design. The three speaking NPCs get authored faces at 8–12k triangles with a deliberately small blendshape set (jaw, blink, brow — see §13). The crowd gets honest low detail: modular bodies, hard hats, high-vis, *no fake face detail at distance*. We do not attempt photoreal humans, and we frame accordingly (profiles, mid-shot, backlit silhouettes). Uncanny valley is avoided by design, not hope.

**Critical note.** The art direction's biggest risk is "AAA envy" — chasing photoreal weathering and 4K faces. We name the enemy explicitly: this project wins on *coherence and restraint*, and every asset budget line (§18) exists to defend that.

---

## 3. World design

### 3.1 Geography

A single coastal site, roughly **640 m × 420 m** of playable land and water margin. Deep water and the fitting-out basin to the south. Slipways (the Ways) face the water for launches. The breaking beach (the Cut) occupies the western shore where the tide works. The gate and offices on the eastern land side. Overlook Hill to the north with the old lighthouse.

```
                          N
        ┌────────────────────────────────────────┐
        │   OVERLOOK HILL + LIGHTHOUSE           │  ← vantage, map table, "score" spot
        │              (39 m)                    │
 ┌──────┼────────────────────────────────────────┤
 │ FAB- │                                        │
 │ RICA-│      THE WAYS — slipways 1 & 2         │  ← Hull 44 building, Hull 45 keel
 │ TION │      GOLIATH gantry crane straddles    │
 │SHEDS─┼────────────────────────────────────────┤
 │(work-│   DRY DOCK No.1      │  FITTING-OUT    │  ← MV HAVFRUEN under repair /
 │shops)│  (caisson, −9 m)     │  BASIN (afloat) │     MV ALMA fitting out
 ├──────┴──────────────────────┴─────────────────┤
 │                 HARBOR & MAIN QUAY            │  ← tug berth, KAI 2 / KAI 3
 ├───────────────────────────────┬───────────────┤
 │  THE CUT — breaking beach     │  YARD GATE +  │  ← MV ELIN (being broken) /
 │  (west tide line)             │  TIMEKEEPER   │     ORION (hulk) — E: entrance
 └───────────────────────────────┴───────────────┘
                          S  (open sea)
```

### 3.2 Zone register

| # | Zone | Fiction role | Content role (the "website section") | Mood | Landmark |
|---|---|---|---|---|---|
| 1 | Yard Gate & Timekeeper's Office | Induction, ledgers, keys | Start hub, orientation, settings (noticeboard) | welcome | The gate sign, 1913 |
| 2 | Fabrication Sheds | Plate shop, pipe shop, carpenter's loft | Craft & materials detail, archive room (Reveal) | craft, warmth | The light shafts |
| 3 | The Ways | Where hulls rise | Build process story, Hull 44/45, GOLIATH ride | awe | GOLIATH gantry crane |
| 4 | Dry Dock No. 1 | Repair & survey | **Ship inspection system home** (§8) | intimacy, scale | The dock floor, −9 m |
| 5 | Fitting-Out Basin | Afloat, masts and cables | Fleet context, quiet scale | calm | MV ALMA's masthead |
| 6 | Harbor & Main Quay | Working waterfront | Transport (tug), play, air | openness | The foghorn |
| 7 | The Cut | Breaking beach | Recycling & steel-provenance story | uneasy beauty | ELIN's stern on the tide line |
| 8 | Overlook Hill | The lighthouse walk | Overview, documentary trigger, the "score" moment | understanding | The lighthouse lamp room |

### 3.3 Density and sightline discipline

- A **landmark or focal event every 40–80 m** of walking. No flat run longer than 60 m without a reason to turn your head.
- The world is **dense, not sprawling**. 640 × 420 m is a deliberate maximum; crossing on foot takes ~5 minutes at jog and that is *by design* — the tug and Torben exist to compress distance only after the visitor has earned a sense of it.
- Every zone is legible from at least two other zones (sightlines were placed, not discovered), so visitors navigate by looking, not by HUD.

### 3.4 Verticality

Dock floor at −9 m; quay at +3 m; Overlook at +39 m; GOLIATH cab at +48 m (ride only); Hull 44 scaffolds (scripted ascent only — see §6 for why ladders are cut). Vertical contrast is the cheapest scale trick that is also honest, so we spend it deliberately at the dock and the hill.

### 3.5 Tide

A slow real tide (±1.1 m over a compressed ~6-hour cycle, tied to the yard clock). It matters at the Cut (ELIN's stern sits on, then off, the sand — the beach visibly breathes) and at the dock caisson (the gate is "dry-docked" at low tide for its own inspection — a background event). The tide table is posted in the Timekeeper's office. No swimming, ever (§6).

### 3.6 Boundaries that read true

No invisible walls where a visible excuse exists: "LIVE WORKS — PERMIT REQUIRED" tape at open edges, deep-water edges, the breaking beach's unstable hulk cordons. Crossing attempts fade back with a one-line PA rebuke. The fence at the gate is *the* hard boundary and it looks like one.

### 3.7 Interiors (small, dense, museum-grade)

Four interiors only: the Timekeeper's Office, the Archive Room (in the plate shop), the Fabrication Sheds (semi-open), and GOLIATH's cab (ride). Interiors carry the project's densest craft: the ledgers, the tide table, the radiator, the tea rotation rota, the model of Hull 44's sister. Interiors are where detail pays highest per square meter — we spend accordingly.

### 3.8 Named world

Everything load-bearing has a stamped name, and names are content: GOLIATH (gantry crane), TORBEN (yard tractor), the tug **MV SØSTER**, the cat **SPARKS**, cranes KAI-1/2/3, sheds PLATESHOP and PIPEHALL. The six registry ships: **Hull 44** (building), **Hull 45** (keel), **MV ELIN** (being broken), **MV ORION** (hulk, static), **MV ALMA** (fitting-out), **MV HAVFRUEN** (dry dock). Six is the ceiling (§29 — we have cut ships before and will again).

**Critical note.** The ELIN/Hull 44 timeline is a deliberate soft fable — a breaker's manifest from last spring feeding a keel laid this spring is optimistic timing, and we know it. The fiction answers with the yard's one poetic license: the archive's manifests are presented as the yard's *memory*, not this quarter's logistics. We hold the line at: poetic timeline yes, impossible physics no.

---

## 4. Interaction design

### 4.1 The grammar: LOOK → APPROACH → PROMPT → ENGAGE

One primary affordance per view, always. The world signals in its own voice first (a painted stencil, a lit window, a brass plaque, a sound); the HUD chip confirms in the yard's typographic stamp *only when the object is in interaction range*. Nothing glows, nothing bobs, nothing pulses — except safety orange, which means *engaging is possible*.

### 4.2 Diegetic UI inventory (the interface IS the yard)

| In-world device | Function | Notes |
|---|---|---|
| Painted floor lines & stenciled arrows | Wayfinding, zone entry | Yellow walkway lines, orange "you may interact" stencils |
| Yard signage system | Section identity & orientation | Consistent typographic system, oxide red + fog white |
| Loudspeaker PA | Narration, event countdowns, alerts, humor | The yard itself speaks; always captioned (§16) |
| The clipboard (held document) | HUD: work orders, registry index | The only "menu." Tab/hold to raise |
| Blueprint table (Timekeeper's Office) | The map, world state, time/weather pin | Also pocket fold-out survey map overlay |
| Survey stations (docked theodolites) | Deep ship inspection mode (§8) | Fixed in-world positions; not a passive buff |
| Documents (surveys, manifests, permits) | Data sheets, lore, SEO-equivalent content | Rubber-stamped "Certificate of Survey" cards |
| Two-tone crane horn / foghorn / shift whistle | Confirmations, timekeeping, identity | Sound as interface feedback (§10) |
| Heat-number plate stamps | The collectible thread & lore key | 12 rubbings; feeds The Reveal (§1.5) |
| The noticeboard (office wall) | Settings overlay | Non-diegetic break, styled diegetic |
| Telephones / radio handsets | Character dialogue entry points | Phrase-ledger (§13) |

### 4.3 Work orders — the guided path

The visit is framed as induction day. The Timekeeper stamps your card and the clipboard fills itself. **Six work orders maximum**, each 2–4 minutes, written as real yard paperwork, completable in any order except WO-06 (attend a launch — scheduled, so it teaches the world clock). Work orders are an *offer*, never a lock: free roam exists from the first minute, and nothing is missable — everything remains discoverable without them.

1. WO-01 Clock in (office, clipboard, settings — 60 s)
2. WO-02 Walk the yard (gate → quay, wayfinding by sightline — 3 min)
3. WO-03 Take the gauge to Dry Dock No. 1 (introduces survey station + x-ray — 4 min)
4. WO-04 The Cut permit (the breaking beach, ELIN's manifest — 3 min)
5. WO-05 Ride GOLIATH (the crane loop, the yard from above — 3 min)
6. WO-06 Attend the launch (scheduled event — waiting is the content)

### 4.4 Complete interaction set (exhaustive; if it's not here, it doesn't exist)

Walk · jog (toggle) · look · focus/inspect · read document · talk (choose or type, §13) · ride/drive (Torben, GOLIATH, tug) · ring horn · take photograph (P1) · pin time/weather at the blueprint table (P1) · teleport via map pushpins (accessibility) · clipboard · settings. **That's the whole verb list.** Thirteen verbs. This line is a feature.

### 4.5 Onboarding = "Induction" (90 seconds, zero tutorial prose)

The gate sequence teaches LOOK (the PA calls your eyeline to the silhouettes), APPROACH (your card doesn't work until you're *at* the office door), PROMPT (the stencil under the door handle), ENGAGE (the handle). The clipboard's first work order stamps itself in front of you. No tooltip walls. If a playtest requires a sentence of instruction, we redesign the interaction, not the sentence.

**Critical note.** We explicitly reject: quest markers, floating labels, glowing interactables, achievement toasts, "press E" spam, daily rewards, and any retention mechanics. A shipyard does not vibrate at you.

---

## 5. Camera system

### 5.1 Modes (finite state machine, single owner)

| Mode | When | Behavior |
|---|---|---|
| ARRIVAL | First 30 s | Spline dolly through mist; skippable |
| WALK | Default | First-person, head-locked look, smoothing per settings |
| INSPECT | At survey stations / hotspots | Constrained orbit around focus; tele lens; UI index |
| VEHICLE | Torben / tug / GOLIATH | Ride cam or lag-chase with spring damping |
| CINEMATIC | Directed moments (§14) | Shot-list playback against live sim |
| TOUR | Documentary mode / Tier C | Guided fixed-rig positions, user-paced |
| PHOTO | P1 | Frozen sim, free camera within bounds, letterbox |

Transitions are always motivated (a cut or a 0.6 s ease — never a floating glide between modes). A single `CameraDirector` service owns all modes; nothing else moves the camera, ever (architectural law, §19).

### 5.2 Lens discipline

- Walk: 55–65° FOV (slider 50–80°, §16).
- Ships and cranes are shot **long**: 32–40° equivalent in INSPECT and CINEMATIC. Wide angles lie about 85-meter ships; telephoto makes them tower. This one decision does more for scale drama than any effect we could buy.
- Camera height honors the human: 1.68 m eye height. On the dock floor, that means *looking up* at HAVFRUEN's keel blocks — the composition is free; we just have to not waste it.

### 5.3 Rules

- **No clipping through steel.** Simplified colliders + soft push-out; camera failure modes escalate: stuck > 0.5 s → nudge; > 2 s → snap to last valid pose (and log).
- **Shake budget:** default ≤ 4 shake events per visit (launch, gale, nothing else). Reduced-motion = zero, always.
- **Dynamic FOV** only on Torben acceleration, ≤ +6°, spring-damped.
- **Cinematic cutting:** average shot length 1.5–2.5 s; 180° line respected in NPC scenes; waterline hero angles for ships; exactly one 4-second "breath" shot per cinematic — the stillness is a signature, and repetition is the point.
- Letterbox + 2% grain active only in CINEMATIC mode.

---

## 6. Player controls

### 6.1 Identity

First-person. You are a new surveyor — no visible avatar, hands appear only to raise the clipboard. No jump, no crouch, no sprint. **Rationale:** you are a professional on a worksite, not a platformer hero; removing jump removes 100% of "how do I get on the roof" conversations and every fall-damage edge case. Verticality is provided by designed routes (dock stairs, scaffold hoist, the hill path, the crane ride).

### 6.2 Movement

- Walk 1.7 m/s; jog 4.5 m/s (toggle: Shift, or double-tap-forward on touch).
- Stair smoothing on slopes ≤ 45°; capsule controller with 0.45 m step offset; swept collision vs simplified colliders.
- Water edge: shallow splash zone only; deep edges fade back with a PA line ("The harbor is not part of the tour.").

### 6.3 Comfort

- Head bob: **off by default** (accessibility posture, §16); subtle optional.
- Look smoothing: off by default, available for comfort.
- Comfort vignette: available, off by default.
- All holds convertible to toggles (§16).

### 6.4 Input matrix (launch)

Keyboard+mouse (remappable), gamepad (standard mapping), touch (§17). Reserved chords avoided; every binding visible and rebindable from the noticeboard. Voice input: cut (§9). Eye/switch tracking: P2, via the TOUR fallback path.

---

## 7. Vehicle system

### 7.1 Philosophy

Vehicles provide **rhythm and scale**, not a driving game. The yard is slow and heavy, and that slowness is the luxury. You hear TORBEN before you see him.

### 7.2 Final roster (three, and the list is closed)

| Vehicle | Role | Feel |
|---|---|---|
| **TORBEN**, yard electric tow tractor | Driveable. Distances compress after you've earned them. Carries you (+ waits NPCs may hop on — pure charm) | 18 km/h top, 3 s to full crawl, wide turns, flashing beacon, two-tone horn. Springs-and-damper sway, no physics engine. |
| **GOLIATH**, 600 t gantry crane | Rideable, scripted 3-min loop during build events | The cab ride: the whole yard under your feet. Not free-flying (§29). |
| **MV SØSTER**, harbor tug | Rideable ferry hop between quay berths, 90 s | Doubles as transport and a moving wide-shot of the yard. Dolphining? No. Buoys, gulls, engine note. |

### 7.3 Physics stance (binding)

**Kinematic motion on hand-authored feel curves. No rigid-body dynamics engine.** Cranes execute data-authored move sequences; the tug runs a spline with weather-driven offset; TORBEN is a tuned arcade-kinematic model. Rationale: full physics costs scope, performance, determinism (testing, §27), and *control of the frame* — none of which buys a single unit of the four things we're selling (authenticity, immersion, storytelling, restraint).

### 7.4 Rules

- No fail states. Leaving marked yard roads slows TORBEN with a diegetic governor ("The grass is not rated for Torben.").
- Vehicles are discoverable: keys in TORBEN's ignition from induction; GOLIATH's ride is offered during WO-05; the tug has a posted timetable (the yard clock again).
- GALE weather suspends the GOLIATH ride and tug with posted notices — weather has *consequences*, which is what makes it feel real (§11).

---

## 8. Ship inspection system

The content core of the project. Everything else exists to bring you here.

### 8.1 The registry (six vessels, six states of the steel cycle)

| Vessel | State | Location | Story role |
|---|---|---|---|
| **Hull 44** | Under construction | The Ways | The new life. Built from reclaimed steel (the Reveal). |
| **Hull 45** | Keel & blocks | The Ways, adjacent slip | The rhythm of work; mostly future. |
| **MV ELIN** | Being broken | The Cut | The old life. Coaster, laid down 1961. Her manifest is the key. |
| **MV ORION** | Hulk, static | The Cut, cordoned | The sobering one. No story happy ending offered; respect instead. |
| **MV ALMA** | Fitting out, afloat | Basin | The finish work: masts, cables, paint. |
| **MV HAVFRUEN** | Survey & repair, dry docked | Dry Dock No. 1 | The inspection home base; propeller, rudder, sea valves. |

### 8.2 Scale ladder (one mental model, everywhere)

`SHIP → ZONE (bow / mid / engine room) → ASSEMBLY (plates, frames, propeller, rudder, piping) → PART (hotspot)`.

Each ship carries **6–10 authored hotspots** — never more. A hotspot opens a **Certificate of Survey** card: real spec fields (dimensions, tonnage, steel provenance, dates), a 60–120-word story, an audio note where relevant. Cards are real text (§16, §25 — this is also the SEO payload).

### 8.3 Two inspection modes

1. **Walkaround plaques.** Brass plaques at physical positions on/near each vessel. Approach → prompt → the card, in the world's voice (PA quotes the relevant line). This mode is always available, no special gear, no mode switch.
2. **The Survey Station.** A theodolite-like instrument stand at each major berth. Engage → full **X-ray / exploded** study of *that* vessel:
   - Ghosted hull: fresnel-wireframe body with calm blueprint-cyan highlights — a 1913 yard's *modern* instrument, not sci-fi neon.
   - Highlight sets: structural frames, piping runs, **steel-origin map** (ELIN's reclaimed plates glow only once the story has earned it).
   - Exploded view: ≤ 40 pre-authored assembly offsets, animated over 1.2 s, reversible.
   - Section planes: 3 axes, animated cuts. Implementation: clip planes, not geometry boolean.
   - Part index as stamped tabs, keyboard-navigable.

### 8.4 Performance and honesty rules

- Exploded/X-ray uses a **pre-built swapped LOD set + shader mode** on instanced hull geometry. No runtime CSG, no runtime mesh slicing, ever.
- The x-ray look is a *styled instrument*, deliberately readable — its job is comprehension, and comprehension is a performance feature (fewer wasted hotspots).

### 8.5 Deep links

Every hotspot has a URL (`/registry/elin/heat-61204`). Sharing a look is a first-class feature; the engine boots directly into that station with the card open (§21, §25).

**Critical note.** We cut per-part free disassembly ("unscrew every valve") as a trap: 10× the art and rigging cost for a mechanic visitors use twice. The exploded view delivers the *understanding* at 5% of the cost. Also cut: comparing ships side-by-side in a UI. The yard compares ships by *walking between them* — which is the point of the whole world.

---

## 9. Voice system

Three separate things that must not be conflated:

### 9.1 VO narration & character voices (launch-critical)

- **Cast:** THE YARD (PA voice — the narrator function; weathered, unhurried, dry), THE TIMEKEEPER (orientation, ledger), THE FOREMAN (craft and the Ways/dock), THE BURNER (the Cut; ethics and poetry of breaking, in fewer words than you'd expect).
- **Budget:** ~220 recorded lines EN, ~12–15 minutes of audio. Recorded human VO. **No TTS for hero content** — synthetic voices are the fastest way to break the authenticity pillar.
- **Delivery:** always diegetic or half-diegetic (PA, radio, in-scene). Captions on by default (§16). Ducking hierarchy: events > narration > ambient barks.
- **Production spec:** 48 kHz/24-bit WAV, −23 LUFS integrated, 30 s room tone per actor; per-line files, Opus ~40 kbps (AAC fallback for older Safari), 20–80 KB/line.

### 9.2 System voice (accessibility fallback)

If audio assets fail or audio is unavailable, all VO content degrades to **on-screen caption card + (only then) system TTS**, visibly marked in the caption style. Content never disappears.

### 9.3 Voice INPUT — cut from launch

Explicitly rejected: mic-permission friction, accent equity problems, accuracy embarrassment, and the cardinal sin of *gating content behind hardware*. Post-launch experiment (P2): optional, on-device speech → maps to the same phrase-ledger UI, so it must never work *better* than typing/tapping. Nothing leaves the device; there is no cloud voice pipeline, full stop.

### 9.4 Localization

Subtitles-first pipeline; EN master; all strings externalized from day one (§22); dubs are a metrics-based later decision and never block launch. Signage loanwords are *texture*, not localization surface.

---

## 10. Spatial audio system

### 10.1 Doctrine

**Sound is the second world.** You will know where you are with your eyes closed: the Cut has grinders and gulls and chain; the dock floor has a 2.6-second slap; the sheds have warm compressed-air hum and radio mumble. We build the audio *before* the polish pass, not after.

### 10.2 Engine

Custom WebAudio graph (no framework). HRTF panning near-field, equal-power far-field (CPU). Two convolution sends with per-zone IR blends: Dry Dock 2.6 s · Sheds 0.4 s · Open ~0 s · Harbor 0.9 s. Occlusion via cheap raycast + low-pass; **transmission** for thin steel: sounds on the far side of a plate are band-passed so hulls *boom* when struck beyond — a signature detail worth its CPU.

### 10.3 Beds and events

- **Beds:** sea (layered by distance to shoreline), wind (global gust state × local exposure — leeward of a ship is quiet), yard hum (transformers, compressors).
- **Events:** ~120 SFX assets, 3–5 variants each, randomized pitch/level, tied to the production sim (§13): weld arc crackle + light sync, grinding, chipping, crane travel groan, two-tone horn, the **foghorn (the yard's logo sound — you will remember it)**, gulls, chains, steam, radio mumble, teacups.
- **Doppler** on TORBEN and the tug. **The Launch** gets a 40-second choreographed mix: sirens → crowd → the ways groan → spray → horn chorus. This is the audio showpiece; it is rehearsed in review like a scene.

### 10.4 The score is the yard

**No traditional music.** The yard's rhythms *are* the score: hammer cadence, grinder pitch, whistle intervals. At Overlook Hill, a "score mode" bus mixes live yard hits into a slow, sparse, generative piece — diegetic source, never a soundtrack pasted on top. Sparse tonal drones are permitted only in cinematics, and sparingly. This is the audio identity, and it is cheaper than licensing *and* more original than composing.

### 10.5 Policy and budget

Audio starts only on the "clock in" gesture (autoplay policy handled *as fiction*, not as a workaround). Global sliders: events / voices / ambience. Mono downmix and full silent mode with complete captions always available. Budget: ≤ 64 concurrent voices desktop, ≤ 32 mobile; mix CPU ≤ 1.2 ms/frame; static beds pre-rendered.

---

## 11. Weather system

### 11.1 States (four; the list is closed)

| State | Frequency & role |
|---|---|
| **HIGH OVERCAST** | Default. The softbox. The yard's natural state. |
| **HARBOR MIST** | Dawn identity. The Arrival lives here. |
| **RAIN** (drizzle → heavy) | Mood shift; roughness darkening, drip lines at shed edges, PA dryness: "It is raining. It is a shipyard." |
| **GALE** | Rare scheduled event (~1 per 2 h), 2–3 min: work pauses, cranes luff and weathervane, TORBEN slows, tug suspends, sea whitens, PA warnings. Weather with *consequences* is the whole trick. |

**CLEAR** exists only as a user-pinned variant of YARD NOON — a lucky visitor's day, fictionally acknowledged by NPCs. It is rare *on purpose*.

### 11.2 Wind

A single global wind vector (0–25 kt) drives: sea state, mist advection, smoke lean, flags and tarps, crane cable sway, rain slant, audio bed gains. One source of truth; everything samples it.

### 11.3 Technology and restraint

GPU particle rain (streaks), wetness as a material uniform (horizontal surfaces darken, cheap — no SSR puddle stack on mobile), puddle decal cards. Transitions are 30–90 s blends, never pops. **No lightning storms** (photosensitivity + tone), **no snow** (not this latitude's story), **no rainbows**. Weather never blocks navigation; it modifies it, with posted notices.

---

## 12. Day/night system — curated presets + the yard clock

### 12.1 The critical decision

**No continuous astronomical simulation.** Four art-directed presets, slow automatic drift (~60 real minutes per full yard day), user-pinnable at the blueprint table and via URL. A real-time sun sim is the most commonly shipped form of "alive" that actually reads as dead: 90% of a visitor's session would sit in two transitional, art-directable-once-only light states. We choose four *authored* lights over one simulated one.

### 12.2 The presets

| Preset | In-world time | Light | Identity |
|---|---|---|---|
| **MORNING WATCH** | 04:50 | Mist, sodium lamps dying, water like pewter | The Arrival's home |
| **YARD NOON** | 12:20 | Clean flat softbox, full contrast read | The showcase / screenshot state |
| **GOLDEN OFF-SHIFT** | 17:40 | Low warm rake, long shadows, dust visible | The hero-shot state |
| **NIGHT SHIFT** | 23:10 | Floodlight rig, welding arcs carry the yard, gulls gone, foghorn closer | The mood state — first-class, not a darkness penalty |

Each preset defines: sun angle/color/intensity, ambient (bake or probe set), fog density/color, floodlight set, exposure, audio mix offsets. Preset transitions: 45–90 s crossfades; sirens mark them (the yard clock, below).

### 12.3 The yard clock (the heartbeat)

The yard runs a compressed day; **world events are scheduled against it**, and this schedule — not particle counts — is what makes the yard *living*:

| Yard time | Event |
|---|---|
| 06:00 / 14:00 / 22:00 | Shift whistle; crews change (visible population swap) |
| 09:30 | Tea break — the yard audibly and visibly exhales (~8% of NPCs step out) |
| hourly | PA announcements, tide table updates |
| every ~20 real min | **LAUNCH rehearsal or launch** — 90 s PA countdown, §1.5 |
| ~1 per 2 h | GALE weather slot |
| 23:10 | Night shift: floodlights on in a staged sequence across the yard |

Deterministic schedule = QA can screenshot every event frame-accurately (§27), and every visitor gets a chance at the Launch without waiting a real day.

---

## 13. NPC system

### 13.1 Cast (speaking — three humans, one building)

- **THE TIMEKEEPER** — gate office. Dry, kind, has stamped everything twice. Orientation and the clipboard.
- **THE FOREMAN** — the Ways and the dock. Teaches inspection; talks about steel like a sommelier.
- **THE BURNER** — the Cut. Fewest lines, most weight. The ethics of breaking, without a sermon.
- **THE YARD ITSELF** — the PA. The fourth voice and the narrator.

A fourth speaking character (the crane driver) was cut to protect recording and writing budget — she waves from GOLIATH instead, which says more.

### 13.2 Ambient crew (the life)

14 task archetypes (welder, burner, chipping gang, rigger, painter, clerk, marshal, fitter…). Placement is driven by the **production sim** — a lightweight, data-authored state machine tracking what work is happening where (plate moves → crane moves → welders arrive). One source of truth drives NPC placement, SFX, arc lights and crane motion, so the yard reads *coherent*: the "living" comes from consequences, not crowd density.

- Behavior: authored task stations + short patrol paths; steering-based avoidance on authored routes (no navmesh — the yard's routes are painted anyway).
- Crowd LOD: 8k → 2k tris → impostor card; ≤ 30 visible (desktop), ≤ 14 (mobile); fade, never pop, in view.
- Animation: shared locomotion set + task loops; look-at and head attention are cheap and disproportionately alive — everyone glances at the launch.

### 13.3 Dialogue — the phrase ledger (the key UX decision)

Talking to a character opens their **ledger**: 4–6 suggested questions as stamped chips (e.g., "Where does the steel go?" / "Who was she?" / "Why this yard?"). This solves the blank-page problem, mobile input, accessibility, and writing scope in one move. Free-typed input is matched against a curated knowledge base (50–80 intents per character with synonym scoring) with **in-character fallbacks** ("Ask me that at tea. Short answer: yes."). No dead ends, no wiki-dump dialogue.

**LLM policy (binding):** no external LLM dependency at launch — content must never depend on a network API, and privacy is a design value (nothing about the visit leaves the device). A post-launch experiment may run an on-device small model as an *enhancement* to intent matching; the ledger always remains the canonical interface.

### 13.4 Barks

~60 context rules: weather, zone entry, launch countdown, tide events, Sparks-the-cat proximity. Barks are the cheapest aliveness per line we have; they get a real writing pass, not leftovers.

### 13.5 Faces and performance

Three authored heads, 8–12k tris, blendshape set of 12 (jaw, blink, brow only). No lip-sync beyond honest jaw motion; dialogue staging is look-at, head tilt, hand props (the stamp, the thermos, the gauntlet). Framing rules (§2.8) keep faces honest. The crowd has no faces and no shame about it.

---

## 14. Cinematic system

### 14.1 Doctrine

All cinematics are **real-time, sim-true, and skippable in one input** — always, no exceptions, no "skip after 5 seconds." Skipping resumes at the destination with nothing lost. The Launch cinematic is not canned footage: it is a director cutting between live cameras on the same simulation you could be standing in. That coherence — seeing the same event from the beach, the crane, and the edit — is the feature.

### 14.2 The pieces

| Piece | Length | Notes |
|---|---|---|
| ARRIVAL | 30 s | Mist → gate → clock-in; hands control at the office door; skippable from frame 1 |
| INDUCTION beats | 2 × 8 s | Micro-cuts teaching the clipboard and the PA |
| THE LAUNCH | 60–75 s | Multi-cam director over live sim; different at night |
| THE REVEAL | 45 s | Archive room; heat numbers; one held breath; yard whistle. No music sting. |
| TOUR chapters | 6 × ~90 s | Documentary mode: fixed-rig positions, user-paced, VO — also the Tier C experience spine (§17) |

### 14.3 Technology

Shot lists are data: `{camera rig, lens, duration, look-at, dolly, event cues}` on splines, driven by the same `CameraDirector` (§5) and the deterministic yard clock. Seeded determinism means QA captures reference frames for regression (§27). Letterbox + 2% grain + caption/CC pipeline active; reduced-motion preset swaps moving shots for fixed-viewpoint crossfades (§16).

### 14.4 Rules

- Never seize controls for more than 30 s without re-showing the skip affordance.
- Cinematic cameras obey world collision except where a shot is authored to ride a surface (crane rails).
- One 4-second "breath" shot per piece. The stillness is a signature; do not decorate it.

---

## 15. UI / HUD system

### 15.1 Doctrine

**Diegetic first; the HUD is a clipboard and a wristwatch.** The default screen carries exactly three things:

- **Context chip** (bottom center): the current prompt, styled as a rubber-stamped label.
- **Compass strip** (thin, top, toggleable): headings + zone ticks. No pings, no player-arrow pin on a live map.
- **Clipboard indicator** (corner): work-order presence. Raise with Tab / hold.

Nothing else. No minimap, no XP, no objective glow, no toasts (PA captions are the only transient text, and they live in the caption system, not a toast stack).

### 15.2 The overlay family (all non-pausing; the world keeps breathing behind them)

| Overlay | Style | Content |
|---|---|---|
| Clipboard | Paper document | Work orders, registry index, current objective's one-sentence summary |
| Noticeboard (settings) | Corkboard, pinned cards | All settings (§16 surfaces) |
| Survey map | Fold-out paper chart | Zone map; teleport pushpins (accessibility); tide & launch times |
| Certificate of Survey | Stamped document | Hotspot/ship data (§8) |
| Photo mode frame | Contact-sheet | P1 |

### 15.3 Typography and voice

Two typefaces, no more: a **stencil/display face** for signage and stamps, a **workhorse grotesque** for body copy and captions. UI copy is written in the yard's voice (§1.4). Numbers and dates format from locale data, never hard-coded strings.

### 15.4 Rules

- If a UI element could exist in the yard, it must exist *in* the yard: the map table and the pocket map are both physical/verbatim objects first, overlays second.
- No modal may interrupt the world. Settings never pause; the sim idles visibly behind glass.
- Hold-to-confirm on anything disruptive (pinning time, teleport). Everything else is single-input.
- Text minimums: 16 px equivalent body, 200% scaling, contrast ≥ 4.5:1 (§16).

---

## 16. Accessibility system

### 16.1 Doctrine

**Equivalent experience, not a compliance checkbox.** Every piece of content must be reachable without vision, without hearing, without audio output, and without a mouse. The fallback site (§25) is fully WCAG 2.2 AA and is the guaranteed path; the world itself aims at the same bar through the systems below.

### 16.2 Vision

- **Captions for everything meaningful:** all VO with speaker names, plus tagged significant SFX `[foghorn, two blasts]`, `[welding nearby]`. Live-region announcements for PA.
- Caption size (100–200%), background opacity, and high-contrast mode.
- Colorblind safety: zone accents are shape-paired (signage carries pictograms); interaction affordance is safety-orange *and* a stencil symbol *and* a prompt — never color alone.
- Photosensitivity: flash cap (weld arcs < 3 Hz, damped), no lightning, gale handled with slow exposure shifts; tested against Harding-style checks.
- Text scaling everywhere; UI contrast modes.

### 16.3 Hearing

Mono downmix; independent sliders (events / voices / ambience); silent mode with full captions; the office PA board animates visually on announcements; gamepad haptics double horn/event cues.

### 16.4 Motor

Full remapping; **every hold is convertible to a toggle**; no timing pressure anywhere in the experience; teleport via map pushpins as a first-class movement mode (also just pleasant); gamepad single-stick navigation mode; touch targets ≥ 44 px with spacing; no drag-only, no gesture-only interactions.

### 16.5 Vestibular / motion comfort

Reduced-motion preset (single switch): kills head bob, shake, dynamic FOV, DOF; cinematics become fixed-viewpoint crossfades. FOV slider (50–80°); comfort vignette; look-smoothing options; steady-cam toggle for vehicles.

### 16.6 Cognitive

Plain-language mode for all UI copy (one idea per prompt; work orders carry one-sentence summaries); nothing is missable; anything repeatable is repeatable; no punishment states exist to accommodate.

### 16.7 Screen readers & keyboard

The fallback site is the full SR experience. In-world: prompts are real labeled buttons; a keyboard-navigable **landmark jump** menu mirrors the map; focus order is engineered, not defaulted; the caption system uses ARIA live regions; an audio-free, reduced-motion "TOUR" path covers the complete narrative (§17).

### 16.8 Process

Audits at M2, M5, M7 (automated axe + manual SR walkthroughs — NVDA, VoiceOver, JAWS) with **paid SR-user test sessions budgeted in M7**. A public accessibility statement ships on the site.

**Critical note.** Accessibility here is not a tax on the design; several of its systems (teleport map, phrase ledger, captions-as-content, TOUR mode) are among the project's best UX ideas for *everyone*. That is the standard we hold: no a11y feature may feel like a hospital railing.

---

## 17. Mobile strategy

### 17.1 Tiers

| Tier | Devices | Experience |
|---|---|---|
| **A — Full** | Desktop dGPU/modern Apple Silicon | Everything, 60 fps target |
| **B — Full, tuned** | Recent flagships, recent laptops w/ iGPU | Full content; dynamic resolution, reduced crowd/particles, 1 shadow cascade, simplified water, equal-power panning; 30 fps target with 60-burst |
| **C — The Guided Tour** | Older/low devices, or chosen by anyone | **Documentary mode:** the complete content set via TOUR chapters, poster-frame 360 views, full VO + captions, full text. Designed with equal care — it is also the accessibility path and the SEO crawl path. Triple duty, zero shame. |

Tier assignment at boot by capability probe + runtime governor; the user can always *choose lower*, never higher-than-safe.

### 17.2 Touch controls

Left-thumb slide = move; right-area drag = look; tap = interact (with prompt magnetism); long-press = inspect; two-finger tap = clipboard. Look-area sizing adapts to handedness setting. No gyroscope look (default off; power + comfort). Device-safe-area aware; one-thumb-complete path exists for the entire guided tour.

### 17.3 Orientation & form

Landscape-first design; **portrait is fully functional** (HUD compacts, FOV tightens, prompts stack bottom-aligned). One polite suggestion to rotate at the dock — never a nag.

### 17.4 Thermal & battery governor

Sampling loop: FPS + thermal state + battery API (where present). Shedding order when constrained: particles → shadows → water detail → crowd → dynamic resolution → (last) voice count. Explicit "Battery saver" preset. Streaming pauses when backgrounded. iOS memory guardrails: hard heap ceiling enforcement, aggressive texture residency trimming (iOS kills tabs quietly and we do not get a second chance).

### 17.5 iOS/web quirks handled at architecture level

WebGL2-first paths where WebGPU is absent; dual-format audio (Opus + AAC); no OffscreenCanvas requirement (P2 enhancement); fullscreen via vendor-prefixed APIs; no PWA install flow at launch (§29) — correct viewport/meta only.

---

## 18. Performance strategy

### 18.1 Targets by tier (hard budgets, CI-enforced)

| Metric | Tier A (desktop) | Tier B (mobile/laptop) | Tier C |
|---|---|---|---|
| Frame rate | 60 fps @ 1440p | 30 fps @ device res (60 burst) | n/a (TOUR) |
| Draw calls on screen | ≤ 1,100 | ≤ 700 | n/a |
| Triangles on screen | ≤ 5.5 M | ≤ 2.5 M | n/a |
| VRAM | ≤ 900 MB | ≤ 500 MB | n/a |
| JS heap | ≤ 300 MB | ≤ 220 MB | ≤ 80 MB |
| Voices | ≤ 64 | ≤ 32 | stream only |
| First frame | < 4 s @ 20 Mbps | < 6 s | < 3 s |
| Interactive (clock-in ready) | < 8 s | < 12 s | < 5 s |

### 18.2 Frame budget (Tier A, 16.6 ms)

| Stage | Budget |
|---|---|
| Simulation (fixed 30 Hz, amortized) | 2.0 ms |
| Culling / draw submission | 1.5 ms |
| Shadows (1 directional + ≤2 local) | 2.5 ms |
| Main geometry | 6.0 ms |
| Water / sky | 1.5 ms |
| Particles | 1.0 ms |
| Post (≤2 effects) | 2.0 ms |
| Present + headroom | 0.1 ms |

### 18.3 Techniques (and the anti-goals that protect them)

- **One code path, two backends:** three.js `WebGPURenderer` with TSL-authored materials; automatic WebGL2 backend fallback. No feature ships on WebGPU that doesn't render on WebGL2 (parity tested, §27).
- Instancing + material-based merging; 3–4-step LOD chains; impostor cards for distant cranes/ships; zone-portal culling (authored) on top of frustum culling.
- Textures: KTX2/Basis, channel-packed ORM, mip-bias governor; 1K default / 2K hero / 4K *only* Hull 44's hull + office interior.
- Geometry: meshopt compression; zone packs stream independently (§23).
- Workers: asset decode, streaming queue, audio parsing. Sim stays main-thread at fixed 30 Hz with render interpolation — deterministic and boring, which is the point.
- Dynamic resolution governor with hysteresis; adaptive quality only *downward-sheds effects* in the §17 order.
- GC discipline: object pools, zero per-frame allocations in hot paths, frozen data structures, no per-frame string building. A memory regression fails CI like a broken test.
- P2 experiments, gated on "no code fork": WebGPU compute culling; OffscreenCanvas rendering.

**Anti-goals (named so nobody "optimizes" us into them):** no SSR stack; no per-object SSAO on mobile; no FFT ocean; no runtime CSG/meshing; no unbatched transparency soup; no video textures outside Tier C; no third-party analytics scripts in the render path (there are none at all — §25).

### 18.4 Continuous enforcement

Asset linter fails builds that exceed per-zone tri/material/texture budgets (§22); headless perf harness gates merges against fixed-profile metrics; nightly real-GPU runs (§27).

---

## 19. Technical architecture

### 19.1 Stack (deliberately small)

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript, strict, no `any` leaks | Refactor safety over a 9-month build |
| Bundler | Vite | Speed; static prerender plugin for §25 |
| Renderer | three.js `WebGPURenderer` (TSL) → WebGL2 fallback | One material code path across WebGPU/WebGL2, which is the whole ballgame in 2026 |
| World runtime | Custom ECS-lite (typed archetypes, ~600 LOC) | Determinism + zero-dependency control; bitECS rejected for migration churn risk |
| UI overlay | Hand-rolled store→DOM bindings (~200 LOC) | No framework tax inside the experience; the *fallback site* may use any static toolchain |
| Audio | Custom WebAudio service | The graph is bespoke anyway (§10) |
| Physics | None. Kinematic controllers + authored curves | §7.3 — binding decision |
| State | Custom signal stores (~100 LOC) | §21 |
| Content validation | zod at build time | Bad data fails the build, not the visitor |

Dependency policy: every dependency must survive the question *"can we write this in a day?"* If yes, we write it. Target: ≤ 8 runtime dependencies.

### 19.2 Runtime architecture

```
┌────────────────────────────  MAIN THREAD  ────────────────────────────┐
│                                                                       │
│  ┌──────────┐   ┌───────────────────────────────────────────────┐    │
│  │ Input     │→ │  SIM (fixed 30 Hz, deterministic, seeded RNG)  │    │
│  │ services  │  │  PlayerController · ProductionSim · YardClock  │    │
│  └──────────┘   │  Vehicles · NPC steering · Weather/Wind · Tide │    │
│                 └───────────────┬───────────────────────────────┘    │
│        ┌────────────────────────┼───────────────────────────┐        │
│        ▼                        ▼                           ▼        │
│  ┌───────────┐          ┌─────────────┐            ┌────────────┐    │
│  │ World/    │          │ Camera-     │            │ Audio      │    │
│  │ ECS scene │          │ Director    │            │ Director   │    │
│  └─────┬─────┘          └─────────────┘            └────────────┘    │
│        ▼                                                              │
│  ┌──────────────────────────────┐   ┌─────────────────────────────┐  │
│  │ Render: WebGPU | WebGL2      │   │ UI overlay (DOM, store-bound)│  │
│  │ TSL materials · LOD · culling│   │ captions · documents · maps  │  │
│  └──────────────────────────────┘   └─────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
        ▲ Streaming queue (worker)      ▲ Asset decode (worker)
        └── zone packs: GLB + KTX2 ─────┘
```

**Architectural laws (binding):**

1. One `CameraDirector`. Nothing else writes camera transforms.
2. Systems never call systems. Data flows through stores; cross-cutting signals go through a typed event bus.
3. Sim is fixed-step and seeded; rendering interpolates. If a feature requires frame-rate-dependent logic, the feature is wrong.
4. All content is data (§22). Zero gameplay strings, positions, or schedules in code.
5. The DOM overlay never blocks the render loop (no layout thrash; store bindings batch via rAF).

### 19.3 Asset pipeline (offline, Node/CLI)

Blender (headless) → glTF → `gltf-transform` (meshopt + prune + weld) → KTX2 (`toktx`, UASTC/ETC1S by use) → zone pack (`{zone}.glb` + textures + collision JSON + nav grid + LOD manifests). Collision and sightline/nav data are baked offline from authored simplified proxies. A **content compiler** turns `/content` sources (§22) into: runtime JSON, SEO HTML/markdown, sitemap entries, OG-image hooks, and the asset-linter manifest with per-zone budgets.

### 19.4 Browser support matrix (minimums)

Last two major Chrome/Edge/Firefox; Safari ≥ 16.4 (WebGL2; WebGPU when present). Dual audio codecs. No polyfill for WebGL1; Tier C covers it.

---

## 20. File / folder architecture

```
shipyard-living-yard/
├── docs/                        # this blueprint, ADRs, art bible, audio bible
├── site/                        # fallback + SEO site (static, prerendered)
│   ├── routes/                  # / , /dry-dock-1 , /the-cut , /registry/... 
│   └── assets/                  # posters, OG renders, icons
├── src/
│   ├── main.ts                  # boot, capability ladder (§24)
│   ├── engine/                  # renderer agnostic plumbing
│   │   ├── render/              # passes, post chain, lod, impostors
│   │   ├── ecs/                 # archetypes, queries, scheduler
│   │   ├── io/                  # streaming queue, cache, workers
│   │   └── math/                # curves, springs, seeded rng
│   ├── world/                   # the yard itself
│   │   ├── zones/               # per-zone systems & portals (data-driven)
│   │   ├── ships/               # registry runtime, inspection rigs
│   │   ├── sea/  sky/  weather/ # environment systems
│   │   └── props/               # cranes, vehicles, doors, torches
│   ├── systems/                 # sim systems (30 Hz)
│   │   ├── production/          # the yard's state machine (§13.2)
│   │   ├── clock/               # yard clock, schedule, tide
│   │   └── npc/                 # stations, steering, barks
│   ├── player/                  # controller, verbs, interaction raycast
│   ├── camera/                  # CameraDirector + modes
│   ├── cinematics/              # shot lists runtime (data in /content)
│   ├── audio/                   # graph, buses, IRs, cue scheduler
│   ├── inspection/              # survey stations, x-ray, cards
│   ├── ui/                      # DOM overlay: clipboard, noticeboard, captions
│   ├── accessibility/           # settings surfaces, remap, landmark jump
│   └── state/                   # stores, event bus, url projection
├── content/                     # THE SOURCE OF TRUTH (§22)
│   ├── registry/                # ships: elin.toml/json, hull-44, ...
│   ├── zones/                   # zone defs, portals, budgets
│   ├── workorders/  characters/ # KBs, barks, ledger phrases
│   ├── schedule/                # yard clock events, weather slots
│   ├── audio/                   # cue sheets, session manifests
│   ├── strings/                 # i18n (en first)
│   └── seo/                     # long-form article markdown per zone/ship
├── assets-src/                  # Blender files, texture sources (Git-LFS policy §31)
├── tools/                       # content compiler, asset linter, perf harness
├── tests/                       # unit, golden-frames, perf profiles, fuzz
└── public/                      # engine entry, icons, manifest bits
```

Rules: `content/` is the single source of truth (two renderers consume it — §25); `assets-src/` follows a Git-LFS policy with a size ceiling per file; nothing generated lands in Git (`/public/packs` is build output).

---

## 21. State architecture

### 21.1 Store layers

| Store | Scope | Persisted | Examples |
|---|---|---|---|
| `Settings` | device | localStorage | a11y, quality tier, audio sliders, controls |
| `Session` | tab | no | tier probe results, boot phase, watchdog state |
| `World` | sim | no (regenerable) | yard clock, weather, tide, production sim |
| `Player` | sim | last-position (optional) | pose, mode, current vehicle |
| `Focus` | transient | no | hovered/engaged target, active document |
| `Narrative` | visitor | localStorage | work orders, rubbings, revealed story beats |
| `Registry` | immutable | built-in | compiled ship/zone/character data (§22) |
| `Diagnostics` | dev | no | perf counters, watchdog logs |

### 21.2 Rules

- Unidirectional flow: input → stores → systems → render. No two-way store bindings inside the sim.
- Cross-cutting reactions (e.g., GALE pauses the tug) are event-bus subscriptions, never direct calls.
- **The URL is a serialized projection** of `World + Focus + Narrative` (`/dry-dock-1?focus=hull-44:keel&t=17:40&w=mist`). Deep links restore state exactly (§25); the back/forward buttons work like places, and this is a headline feature, not an easter egg.
- Persistence is versioned + checksummed with a migration hook; corrupt saves degrade to a clean induction (§24), never to a broken boot.
- A record/replay harness (M5) uses the determinism of the sim for QA (§27).

---

## 22. Data architecture

### 22.1 Principles

All content is data, validated at build (zod), compiled to typed runtime JSON, and linted against budgets. Writers and sound designers work in `content/` without touching `src/`.

### 22.2 Core schemas (abridged, normative field names)

```ts
// registry/elin.ts (illustrative)
Ship {
  id: "elin", name: "MV ELIN", class: "coaster",
  built: 1961, broken: "2026-spring",
  dims: { loa: 84.6, beam: 12.4, draught: 6.1, dwt: 2980 },
  steel: { provenance: "reclaimed", reclaimedInto: ["hull-44"] },
  story: StoryBeat[],           // 3–5 beats, 60–120 words each
  hotspots: Hotspot[],          // 6–10
  zone: "the-cut", state: "breaking",
  seo: { slug: "registry/elin", title: "...", description: "..." }
}
Hotspot {
  id: "heat-61204", assembly: "hull-plate",
  label: "Plate, shell — heat 61204",
  spec: Record<string,string>,  // typed fields per assembly type
  story: string, audioNote?: AudioCueRef,
  pose: { zone: "the-cut", position, facing },  // walkaround plaque
  station: { highlightSet: "origin-elin", explodeGroup: "shell-pl-04" }
}
ZoneDef {
  id: "dry-dock-1", bounds, portals: Portal[], budgets: { tris, materials, texMB },
  ambient: { probe, ir: "dock" }, signage: SignageItem[], landmarks: Landmark[]
}
ScheduleEvent { at: "yardtime 09:30", id: "tea-break", actions: Action[] }
CharacterKB { id: "burner", ledger: Phrase[], intents: Intent[], barks: Bark[] }
WorkOrder { id: "wo-04", title, body, summary, route: Waypoint[], completion: Condition }
AudioCue { id, variants: FileRef[], bus, ir, priority, cooldown }
WeatherState { id: "gale", windKt: [18,25], sea: 3, fogK: ..., audioMix: MixOffset }
TimePreset { id: "golden", sun: {...}, fog: {...}, floods: FloodSetRef[], exposure: Ev }
```

### 22.3 Budget linting (build fails on violation)

Per-zone triangle/material/texture budgets; hotspot counts (≤ 10/ship); VO line coverage vs cue sheets (every cue has files; every file has a cue); string-externalization check (no literal copy in `src/`); color-discipline check (orange = interactive only) on authored UI data.

---

## 23. Loading architecture

### 23.1 Phases

| Phase | What | Budget | Visitor sees |
|---|---|---|---|
| 0 | Static shell: brand, title, "CLOCK IN" gate | < 120 KB gz, LCP < 1.8 s | The gate in mist (poster render) |
| 1 | Engine core + Gate zone pack + audio core | ~4–6 MB | Clock-in enables; ARRIVAL begins |
| 2 | Priority streaming: path-of-travel zones first | 2–5 MB per zone pack | Lights come on across the yard, section by section (real bytes, honest) |
| 3 | Background prefetch along the guided path + registry documents | idle bandwidth | nothing visibly |
| 4 | On-demand: interiors, vehicles' interiors, document art | on approach | nothing visibly |

### 23.2 Machinery

- **Priority scheduler with cancellation** (worker): zone packs are dependency-ordered; travel intent (movement vector + work-order routes) raises priority; a hard turn cancels prefetch.
- **Caching:** Cache API + service worker, versioned URLs, LRU eviction with a storage-pressure listener; stale-version cleanup on boot.
- **Honesty rule:** the loader shows real bytes and real zone names ("OPENING THE PLATESHOP… 3.2 / 4.1 MB"), never fake progress bars. The diegesis is the *induction paperwork* + the yard's lights coming on.
- **Resume:** returning visitors get "SHIFT IN PROGRESS — RESUME WHERE YOU LEFT OFF" when a saved session exists.
- **Memory-aware streaming:** heap/VRAM ceilings pause streaming; evicting far-zone packs (with a re-entry cost) before ever OOM-ing.

### 23.3 Failure behavior

Every asset has: retry w/ backoff → proxy material (grey + stencil label) → zone marked "CLOSED FOR MAINTENANCE" (rare, styled, linked to fallback site content). A missing zone pack never blocks boot.

---

## 24. Error handling

### 24.1 Boot-time capability ladder

```
probe → WebGPU available?  ── yes ─→ Tier by GPU probe
      └─ no → WebGL2 available? ── yes ─→ Tier by GPU probe (same content)
                                └─ no → Tier C (Guided Tour) + notice
memory < floor? → Tier C regardless
"skip the fancy version" link shown once on every boot screen (choice is respected, never nagged)
```

### 24.2 Subsystem fault boundaries (each subsystem degrades alone; the world never dies whole)

| Failure | Degradation |
|---|---|
| Audio context blocked/fails | Caption-first mode + system-voice TTS for VO (marked); sliders replaced by notice |
| Asset fetch fails | Retry w/ backoff → proxy material → "CLOSED FOR MAINTENANCE" (§23.3) |
| Worker unavailable | Main-thread decode (slower load, logged) |
| WebGPU device lost | Auto-recreate → rebuild scene < 2 s → else WebGL2 backend (same scene graph) |
| WebGL context lost | Restore handler; user sees a single "RESETTING THE YARD" stamp, never a reload |
| localStorage/Cache evicted | In-memory session continues; persistence silently disabled; no errors surfaced |
| Heap/VRAM pressure | Streaming pauses → far-zone eviction → tier shed (§17 order) — watchdog, automatic |
| Frame stall > 3 s | Watchdog: tier down one notch + notice |
| Audio dropouts | Voice-budget cut, priority re-quote |

### 24.3 Global failure

Any uncaught fatal: diegetic **"YARD CLOSED — WEATHER"** screen with Retry (fresh boot) and a link straight into the fallback site's same-content page. Never a raw stack, never a white screen. A "copy diagnostics" button (build, tier, last events; local only).

### 24.4 Policy

- **Privacy is an error-handling decision:** no third-party error SDKs, no telemetry by default. A quiet self-hosted aggregate (page-level counts only) may be enabled post-launch; individual behavior is never recorded.
- Errors respect the fiction's voice. Even the error screens are written by the yard.

---

## 25. SEO / fallback architecture

### 25.1 Doctrine: one source of truth, two renderers

`content/` (§22) compiles into **(a)** the live 3D experience and **(b)** a complete, fast, static site. The static site is not an apology — it is the yard's **paper archive**: every zone, every ship, every work order, every story, fully typeset in the same design system, with real renders and the full accessibility implementation. It is simultaneously: the SEO surface, the no-JS experience, the Tier C textual backbone, the social-share landing target, and the error-path destination.

### 25.2 Routes (real URLs, prerendered, canonical)

```
/                     → arrival page: the pitch, the gate poster, enter buttons by tier
/dry-dock-1           → zone page + engine deep link into the dock
/the-ways  /the-cut  /overlook  /sheds  /basin  /harbor
/registry             → ship index (6 vessels)
/registry/elin        → full survey: specs, story, hotspots (each hotspot anchorable)
/visit                → controls, accessibility, tiers (real user value; also FAQ-ish SEO)
/colophon             → credits, tech notes, typefaces (the award-community signal page)
```

- Engine routes and site routes are the same paths: JS present → boots the world into that state; JS absent → the article. One canonical URL per place. No `#!` hacks, no cloaking — the crawler-visible content *is* the content.
- `?focus=` / `?t=` / `?w=` parameters are the world-state projection (§21.2); share links open the world exactly where someone stood.

### 25.3 Structured data & social

JSON-LD: `Organization` (the fictional yard, clearly fictional in the colophon), `WebSite`, `BreadcrumbList`, `TouristAttraction` (the yard as a place, with geo-less description), `Article` for ship stories. OG/Twitter cards use art-directed poster renders per zone (M8 task: 8 posters + registry cards). Sitemap + canonicals + `hreflang` when localized. Lighthouse CI gates on the shell: LCP < 1.8 s, CLS < 0.02, no third-party scripts (there are none).

---

## 26. Development phases

### 26.1 Assumptions

Core team of 4 (technical director, technical artist, environment artist, designer/generalist incl. audio) + contracted VO + part-time accessibility consultant. Durations below are calendar weeks for that team with parallel tracks. A 2-person reality or an 8-week reality is addressed in §31 (MLV).

### 26.2 Milestones

| M | Name | Wk | Goal — "playable proof of…" | Definition of done |
|---|---|---|---|---|
| M0 | Foundations | 3 | …the machine | Repo, CI, perf harness, renderer abstraction w/ WebGPU+WebGL2 parity smoke, ECS-lite, stores, input, asset pipeline round-trip (Blender→pack→stream), error ladder |
| M1 | Arrival | 4 | …the first 30 seconds | Graybox yard, WALK camera, gate→quay path, ARRIVAL cinematic, clock-in gate, streaming of 2 zones, audio beds + first spatial events, muted-comprehension prototype |
| M2 | The Living Yard | 5 | …a yard that breathes | Yard clock + presets + weather v1 (overcast/mist/rain), production sim v1 driving arcs/SFX/crane moves, ambient NPCs v1, tide, captions pipeline, a11y audit #1 |
| M3 | The Ship | 5 | …inspection as content | HAVFRUEN + Hull 44 in-dock builds, survey stations (x-ray/explode/sections), hotspot cards, clipboard + work orders 1–4, deep links |
| M4 | Rhythm & Scale | 3 | …the yard under your feet | TORBEN + tug, GOLIATH ride, vehicle cameras, GALE consequences, night shift lighting |
| M5 | Story | 3 | …the spine works | Timekeeper/Foreman/Burner w/ ledgers + VO session #1, THE LAUNCH event + cinematic, THE REVEAL, documentary TOUR v1, record/replay QA harness |
| M6 | The Cut | 3 | …death, handled with respect | Breaking beach complete, ELIN + ORION, provenance/steel-origin highlight set, WO-05/06, localization-ready strings freeze |
| M7 | Hardening | 4 | …it survives the wild | Tier B/C complete + governor, mobile controls, soak/leak fixes, a11y audit #2 + SR-user sessions, perf budgets green on CI, device matrix pass |
| M8 | Content Complete & Polish | 4 | …restraint as a feature | Art pass, **restraint audit** (cut anything unjustified — this is scheduled work, not spare time), sound pass, copy pass, SEO/fallback site, OG posters, launch ops runbook |

Total ≈ 34 team-weeks ≈ **8.5 calendar months** for the full vision with the assumed team. Priorities ladder if time compresses:

- **P0 (never cut):** Arrival, one ship inspected deeply, The Launch, captions, Tier C fallback, performance budgets, restraint audit.
- **P1 (cut last):** TORBEN, night shift, gale, photo mode, tug, registry beyond 4 ships, barks > 30.
- **P2 (cut first):** GOLIATH ride, time/weather pinning UI, ORION, Hull 45, score-mode overlook, haptics, voice-input experiment.

Descope rule (binding): when a milestone slips two weeks, cut from the *bottom of the ladder*, never from QA, captions, or the restraint audit.

### 26.3 The MLV path (Minimum Lovable Version, ~8 weeks)

Arrival + gate→quay→dry dock; ONE ship (HAVFRUEN) inspected via one survey station; one preset (HIGH OVERCAST) + one mist event; no vehicles; one character (Timekeeper) with a small ledger; captions + Tier C from day one; fallback site covering everything shipped. MLV *is* a launchable award contender — it contains the thesis (world = interface), one signature (arrival), and the discipline. Everything else in this document is the full-vision delta.

---

## 27. Testing strategy

| Layer | What | Tooling / cadence |
|---|---|---|
| Unit | Sim math, stores, scheduler, loader queue, URL projection | vitest, every merge |
| Determinism | Same seed → same 10-min sim hash across machines | CI job, nightly |
| Golden frames | Frozen camera poses × presets × backends (WebGPU vs WebGL2) vs reference renders | headless capture + SSIM threshold, per merge |
| Performance CI | Fixed-profile headless + nightly real-GPU runner: fps, draw calls, tris, heap, load times vs §18 budgets | merge gate + nightly report |
| Soak | 60-min auto-walk bot: memory slope, AudioContext/WebGL handle leaks, GC churn | nightly |
| Backend parity | Visual + feature diff between WebGPU and WebGL2 | per merge |
| Input fuzz | 10-min random input streams (incl. pathological: rapid mode flips, focus spam) | nightly |
| Network profiles | Load + streaming under Slow-4G / flaky / offline-mid-session | per release |
| Device matrix | iPhone 13/15 Safari · Pixel 7/8 · mid Android · macOS Safari · Win Chrome/Edge/Firefox · 2019 iGPU laptop | per milestone |
| Accessibility | axe on site + overlay; manual NVDA/VoiceOver/JAWS walkthroughs; caption completeness vs cue sheets; flash-rate checks | M2/M5/M7 + paid SR users in M7 |
| Content | Schema validation, budget linter, string-externalization, VO coverage, link rot on fallback site | every build |
| Experience protocol | 5 first-time users per milestone (remote, think-aloud): Can they find the dock? Do they notice the Cut? Was the Launch seen? Did anyone need instructions? | per milestone video |
| Launch ops | CDN/cache purge drill, version-bump drill, "worst device" dress rehearsal | pre-launch week |

The boring rule that protects the magic: **any bug that can break immersion (camera clip, audio pop, streaming pop-in, caption lag) is P0 severity by default**, above visual bugs.

---

## 28. Award-level quality checklist

The bar, as ten pass/fail tests. A "fail" on any of these in review means the release is not ready, regardless of schedule.

1. **The 5-second test.** From clock-in: mist, a ship silhouette, the PA's first line — all within five seconds, zero UI.
2. **The one-screenshot test.** A single frame (dawn mist, GOLIATH's silhouette, weld sparks on Hull 44) is the poster, the OG image, and the memory. If no single frame says everything, the art direction hasn't converged.
3. **The closed-eyes test.** Sound only: can a visitor name their zone? (Beds, IRs, and event grammar must make it trivial.)
4. **The muted test.** Sound off, captions on: complete navigation and comprehension.
5. **The 2019 laptop test.** Tier B-min sustained, governor graceful, no "your device is weak" messaging.
6. **The juror's three minutes.** Arrival → one work order → one survey station → (scheduled) Launch. The best path through the yard must be *the default path*.
7. **The restraint audit.** Every effect, sound and particle traces to a fiction or function, with an owner's name on the justification. Anything orphaned is cut at M8 — scheduled, mandatory.
8. **The originality audit.** Side-by-side against five known benchmark experiences: no borrowed structure, no borrowed interaction grammar, no borrowed audio identity. "Reminds me of" must be followed by "…but ours does X."
9. **The detail audit.** 50 authored, nameable details exist and are discoverable (the tea rota, Sparks' route, the tide table, plate stamps, the lighthouse logbook, burnt matches at the burner's hut…). The list is a living doc; anything unfindable is re-placed, not deleted.
10. **The honesty test.** No fake progress bars, no fake buttons, no manipulative urgency, no tracking. The yard doesn't lie.

Hygiene beneath the ten: credits live in-world (the painter's board by the gate), ≥ 3 easter eggs (the cat counts), zero placeholder assets at launch, and the fallback site would win its own little award for typographic clarity.

---

## 29. Cut list — features considered and rejected (the most important section in this document)

| Feature | Verdict | Why (and what replaces it) |
|---|---|---|
| Multiplayer / shared presence | **CUT** | Servers, moderation, sync cost, and the fiction breaks ("why are there forty identical surveyors?"). Solitude is the mood. Ambient NPCs provide life. |
| Free crane operation (drive GOLIATH) | **CUT** | Physics/animation scope explosion, griefing-free version impossible; the scripted cab ride delivers the awe at 2% of cost. |
| Rigid-body physics sandbox | **CUT** | §7.3. Determinism, perf, and frame control. Authored feel beats simulated flail. |
| Continuous real-time day/night sim | **CUT** | §12. Four authored lights beat one simulated one; visitors only ever see two transitional states of a real cycle. |
| Voice input at launch | **CUT** | §9.3. Mic friction, accent equity, hardware gating. Ledger chips + typing are better UX for everyone. |
| LLM-driven NPC conversation | **CUT at launch** | Content must not depend on a network API; privacy; hallucinated lore destroys authenticity. Phrase ledger + curated KB (§13.3). On-device experiment post-launch, enhancement only. |
| Minimap HUD | **CUT** | Kills looking. Landmarks + compass strip + paper map (with a11y teleport) do the job in-fiction. |
| Swimming / diving | **CUT** | A whole second world (underwater art, movement, fog) for one verb. Harbor edges stay edges. |
| Jump / sprint / crouch | **CUT** | §6.1. Surveyor, not platformer. Removes a hundred edge cases; vehicles cover speed. |
| Collectible spread (20+ pickups) | **CUT** | One thread only: the 12 heat-stamp rubbings feeding The Reveal. Collectible spam is engagement metric cosplay. |
| Achievements / gamification | **CUT** | The work orders + service record on the clipboard are enough. Trophies cheapen work. |
| User-generated content / base building | **CUT** | Not our thesis, infinite scope, moderation forever. |
| Accounts / login / cloud saves | **CUT** | Friction at the gate for a benefit nobody needs here. Local persistence (§21) suffices. |
| Ads / sponsor content / newsletter gates | **CUT** | Immersion pillar. Non-negotiable. |
| Forced intro cinematic > 10 s | **CUT** | Skippable-from-frame-1 always (§14). Jurors punish hostage-taking. |
| Native mobile app / PWA install flow | **CUT (launch)** | Two codebases or install-funnel friction; the web experience is the product. Revisit post-launch. |
| Video cinematics (pre-rendered) | **CUT** | Sim-true real-time only (§14); coherence is the feature. |
| Volumetric everything (clouds/fog) | **CUT** | Analytic sky + fog cards + light shafts; spend the frame budget where eyes actually are. |
| SSR-stack water / FFT ocean | **CUT** | One good Gerstner-style shader + cards; the sea is weather, not a tech demo. |
| Photoreal humans / Metahuman-grade faces | **CUT** | §2.8. Uncanny valley risk + budget; silhouette-first honesty. |
| Crowd > 30 visible | **CUT** | Aliveness comes from consequence (§13.2), not headcount. |
| Quest/RPG systems (XP, skill trees) | **CUT** | Work orders are the genre-transcending version of quests; they are paperwork, which is funnier and truer. |
| Day-one dubs beyond EN | **CUT** | Subtitles-first (§9.4); dubs by demand metrics. |
| Ship customization / painting | **CUT** | Wrong game entirely. |
| Drone free-flight mode | **CUT (P2 border)** | Photo mode + overlook + GOLIATH ride cover aerial desire; free flight breaks culling budgets and boundaries. |

---

## 30. Risk register

| # | Risk | L×I | Mitigation |
|---|---|---|---|
| 1 | Scope creep ("just one more zone") | H×H | Closed lists everywhere (§4.4, §7.2, §11.1, §29); change requests require cutting an equal-size item from the ladder |
| 2 | WebGPU/WebGL2 parity bugs | M×H | One TSL code path; parity golden-frames per merge (§27); WebGL2 is the floor, never the orphan |
| 3 | iOS memory kills / Safari quirks | H×H | Hard heap ceilings, dual audio codecs, device-matrix gates per milestone, Tier C guaranteed |
| 4 | Asset pipeline drag (art outpacing budgets) | M×H | Asset linter in CI from M0; budget violations fail builds, not reviews |
| 5 | VO scheduling/quality | M×M | One recording block per milestone trio; cue sheets frozen 2 weeks ahead; scratch VO for timing from M1 |
| 6 | A11y regressions discovered late | M×H | Audits at M2/M5/M7; captions & toggles are P0 ladder items, built in M2 not bolted in M8 |
| 7 | Team smaller than assumed | M×H | MLV path (§26.3) pre-planned; P-ladder enforced |
| 8 | "Award fatigue" — jurors seen many 3D worlds | M×M | The differentiator is tone + specificity (breaking/building duality, audio identity), not tech; originality audit (§28.8) |
| 9 | Storage eviction / cache churn | L×M | Versioned SW cache, LRU, graceful in-memory fallback (§24) |
| 10 | Autoplay/audio policy surprises | L×M | Clock-in gesture is the designed unlock; silent mode fully supported |
| 11 | The Launch event missed by visitors | M×M | 90 s PA countdown + siren audible yard-wide + schedule posted at the gate + WO-06 |

---

## 31. Scope reality (the honest section)

- **Full vision:** 4-person core team, ~8.5 calendar months, contracted VO + a11y consultant, budget for one recording block per story milestone and device-lab time.
- **MLV (§26.3):** ~8 weeks, same team, ships as a complete, award-contending statement.
- **2-person team:** MLV only, extended to ~14 weeks; cut list starts at P2 and climbs; full vision is explicitly out of reach without adding a technical artist.
- **Asset storage:** `assets-src/` (Blender, PSD) via Git-LFS with a per-file ceiling; compiled packs are build artifacts, never committed. Content in `content/` is plain text — the most valuable, most mergeable asset in the repo is also the most durable.

---

## 32. Open decisions requiring sign-off

These are the forks where the blueprint deliberately presents a recommendation but needs an owner's call:

1. **Yard identity.** JERNVIK Shipbuilding & Salvage Co., est. 1913, tagline "Steel remembered." Alternates considered and set aside: Greypepper Marine Co., Ostervik Verft. **Recommend: lock JERNVIK.**
2. **Time default.** Preset-drift ON (60-min yard day) with pinning, vs. pinned-only. **Recommend: drift ON** — the yard clock's events (launch, tea break, shifts) are load-bearing for "living."
3. **Registry size.** 6 ships (full) vs. 4 (MLV). **Recommend: 6 target, 4 minimum, cut from the bottom (ORION, Hull 45) first.**
4. **TORBEN availability.** Keys-in-ignition from induction vs. unlocked after WO-02. **Recommend: from induction** — freedom is the promise; the work orders suggest, never gate.
5. **Team/calendar reality.** Confirm the §31 assumption or trigger the MLV path *now* (it changes milestone content, not architecture — the architecture supports both).
6. **Voice input experiment (§9.3).** Keep as P2 or strike entirely. **Recommend: keep as P2, parked behind explicit opt-in.**

---

### Sign-off

- [ ] Creative direction (§1–3)
- [ ] Experience systems (§4–14)
- [ ] UI / Accessibility / Mobile (§15–17)
- [ ] Performance & architecture (§18–25)
- [ ] Plan, scope, cuts (§26–31)
- [ ] Open decisions (§32)

**On sign-off, M0 begins:** repository scaffolding, CI, perf harness, renderer parity smoke, and the Blender→stream pipeline round-trip. No feature work before the harness exists. That is the whole point of having written this document.

*Blueprint v1.0 — ends.*
