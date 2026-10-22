/** Documents and material records. This is the story's evidence chain. */

export interface YardDoc {
  id: string;
  title: string;
  ref: string;
  rows: [string, string][];
  body: string;
  stamp?: string;
}

/** Rubbable heat stamps — the surveyor's thread. */
export interface StampDef {
  id: string;
  heat: string;
  label: string;      // prompt label in the world
  doc: YardDoc;
}

export const STAMPS: StampDef[] = [
  {
    id: 'h44-keel',
    heat: 'HT-58117',
    label: 'RUB PLATE STAMP — KEEL PLATE',
    doc: {
      id: 'h44-keel',
      title: 'MATERIAL RECORD — RUBBING',
      ref: 'JRN/SRV/0041',
      rows: [
        ['HEAT No.', 'HT-58117'],
        ['FROM', 'HULL 44 — KEEL PLATE, PORTABLE SECTION'],
        ['MARKS', '58117 B · SLAB 4 · JERNVIK STOCK'],
        ['STATUS', 'INSTALLED — KEEL LAID THIS SPRING'],
      ],
      body: 'Keel steel, laid first and laid straight. The register has no origin page for this heat — the plate was in the stock yard before anybody now on the payroll was.',
      stamp: 'LOGGED',
    },
  },
  {
    id: 'h44-s4',
    heat: 'HT-61204',
    label: 'RUB PLATE STAMP — STRAKE S-4',
    doc: {
      id: 'h44-s4',
      title: 'MATERIAL RECORD — RUBBING',
      ref: 'JRN/SRV/0042',
      rows: [
        ['HEAT No.', 'HT-61204'],
        ['FROM', 'HULL 44 — SHELL STRAKE S-4, PL 118'],
        ['MARKS', '61204 B · SLAB 7 · JERNVIK STOCK'],
        ['STATUS', 'INSTALLED — THIS SEASON'],
      ],
      body: 'Shell plating, second strake up. Good metal, the foreman says — rolled heavy, holds a weld line like it was poured yesterday. The register lists its origin only as: yard stock.',
      stamp: 'LOGGED',
    },
  },
  {
    id: 'elin-b',
    heat: 'HT-61204',
    label: 'RUB PLATE STAMP — CUT EDGE',
    doc: {
      id: 'elin-b',
      title: 'MATERIAL RECORD — RUBBING',
      ref: 'JRN/SRV/0043',
      rows: [
        ['HEAT No.', 'HT-61204'],
        ['FROM', 'MV ELIN — SHELL STRAKE B, REMAINING EDGE'],
        ['ROLLED', '1961 — AALBORG WORKS'],
        ['STATUS', 'RELEASED TO YARD STOCK, THIS SPRING'],
      ],
      body: 'On ELIN, strake B carried the cargo and the weather for sixty-odd years. Her cutting plan released this plate to stock in the spring. Stamps last longer than paint. This one is still sharp enough to read.',
      stamp: 'LOGGED',
    },
  },
];

/** Readable documents that are not rubbings. */
export const DOCS: YardDoc[] = [
  {
    id: 'gate-plaque',
    title: 'CAST PLAQUE — YARD GATE',
    ref: 'CAST 1913',
    rows: [
      ['YARD', 'JERNVIK SHIPBUILDING & SALVAGE CO.'],
      ['ESTABLISHED', '1913 — AS A BREAKER’S YARD'],
      ['MOTTO', 'WE ONLY LAUNCH WHAT WE CAN REMEMBER'],
    ],
    body: 'The founders broke ships here before the yard ever built one. The motto was cast into the gate in 1913 and nobody has paid for it to be removed.',
    stamp: 'READ',
  },
  {
    id: 'elin-plan',
    title: 'CUTTING PLAN — MV ELIN',
    ref: 'JRN/BRK/ELIN/07',
    rows: [
      ['VESSEL', 'MV ELIN — COASTER, LAID DOWN 1961'],
      ['POSITION', 'No.7 — STRAKE B, SHELL, FORWARD OF MIDSHIP'],
      ['RELEASED', 'PLATES 114–121 → YARD STOCK, THIS SPRING'],
      ['NOTE', 'STAMPS TO BE PRESERVED AT CUTTING'],
    ],
    body: 'Standard practice: reusable plate is released to the stock yard with its stamps intact. The yard keeps its paperwork. The paperwork keeps the yard honest.',
    stamp: 'READ',
  },
  {
    id: 'elin-bow',
    title: 'NAME BOARD — MV ELIN',
    ref: 'REG 1961',
    rows: [
      ['NAME', 'ELIN'],
      ['PORT', 'JERNVIK'],
      ['BUILT', '1961 — 84.6 m OVERALL, 2,980 t DEADWEIGHT'],
      ['FINAL VOYAGE', 'DELIVERED TO THE BEACH UNDER HER OWN STEAM'],
    ],
    body: 'She came in the way working ships end: slowly, and under her own power. Sixty years of Coasters’ weather are written on her side. The yard reads it as a ledger.',
    stamp: 'READ',
  },
  {
    id: 'h44-board',
    title: 'WAY BOARD — HULL 44',
    ref: 'JRN/BLD/44',
    rows: [
      ['BUILD', 'HULL 44 — KEEL LAID THIS SPRING'],
      ['STEEL', 'YARD STOCK, CERTIFIED HEATS ONLY'],
      ['PROGRESS', 'UP TO STRAKE S-5 AFT, FRAMES FORWARD'],
      ['NOTE', 'SHE WAS ALWAYS GOING TO BE LAID FROM THE STOCK YARD'],
    ],
    body: 'Every new hull at Jernvik is laid from certified heats in the stock yard. Where the stock yard gets its steel is written in the salvage ledger, one beach south-west of here.',
    stamp: 'READ',
  },
];
