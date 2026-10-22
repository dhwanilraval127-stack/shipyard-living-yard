# JERNVIK — THE LIVING YARD

**Steel Remembered.**

A working shipyard that builds ships from the steel of ships it breaks.
You are the new surveyor. The yard is the website — no menus, no pages;
buildings, cranes, sirens and paperwork are the navigation.

Zero-cost, local-only, offline after install. One runtime dependency (three.js).

---

## Run it (your Windows laptop)

```
npm install
npm run dev
```

Open the printed localhost URL. Click **CLOCK IN**. Sound on — the score is the yard itself.

- **Build (optional):** `npm run build` then `npm run preview` — serves the compiled yard.
- **Typecheck:** `npm run typecheck`
- **Headless verification tour** (needs a Chromium; on your machine the easiest is
  `npm i -D playwright && npx playwright install chromium`, then point
  `tools/verify.mjs` at `playwright-core`): saves a full screenshot + stats tour to `shots/`.

## The experience, in one paragraph

Clock in at the gate. Take the clipboard. Walk the yard: the fabrication shed,
the steel store, the two building ways where HULL 44 is rising and HULL 43 waits
to go down the ways at 13:15 sharp. Follow the burning sounds west to the Cut,
where MV ELIN comes apart on the tide under permit. Rub the heat-stamps off the
plates — new hull, old hull — and let the paperwork say the thing the yard never
will out loud. Shifts end. GOLIATH travels. It rains; it clears. At 18:30 the
floodlights come up and the night shift takes ELIN apart under the lamps.
The clock never stops for you. That is the point.

## Controls

| Key | Does |
|---|---|
| `W A S D` | walk |
| mouse | look (click the yard to take the helm) |
| `E` | inspect / engage / close |
| `Tab` | clipboard (work orders + material records) |
| `N` | noticeboard (settings, accessibility, quality) |
| `Esc` | put things down |
| `F3` | frame stats |

## Documentation

- `docs/BLUEPRINT.md` — the full production blueprint (v1.0)
- `docs/REVIEW-M1.md` — the first-slice jury review, honestly scored
- `docs/ASSET_LICENSES.md` — the ₹0 license ledger

## License ledger (summary)

- three.js — MIT. @fontsource Barlow / Barlow Condensed — SIL OFL 1.1.
- Everything else — made here, for this yard, procedurally. No copyrighted
  music, no stock media, no scraped assets. The yard generates its own.
