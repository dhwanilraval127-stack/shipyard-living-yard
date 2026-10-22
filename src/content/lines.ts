/** Every word the yard says. Dry. No exclamation marks anywhere, ever. */

export const PA_LINES: Record<string, string> = {
  'pa-morning': 'Attention on yard. New surveyor on the gate today. Walk the rails, keep off the ways when the horn sounds, and mind the tide on the beach.',
  'pa-night': 'Night shift, stand easy. The floodlights will hold until the fog decides otherwise. Surveyor: the office lamp stays on for you.',
  'tea-start': 'Tea break. All burning and hammering stops for fifteen minutes. Yes, again.',
  'tea-end': 'Break is over. Back to it.',
  'launch-prep': 'Attention. Launch of HULL 43 from No.2 way at thirteen-fifteen. Keep the beach clear, keep the quay clear, and stand anywhere you can see her whole length.',
  'launch-t60': 'Launch in one minute. Take up your positions.',
  'launch-t30': 'Launch in thirty seconds. Stand clear of the cradle.',
  'launch-t10': 'Ten seconds.',
  'launch-t5': 'Five. Four. Three. Two. One.',
  'launch-go-launch': 'She is off the ways. HULL 43 is afloat and steady. Tug will bring her to the fitting-out buoy.',
  'launch-go-rehearsal': 'Cradle held at the mark. Rehearsal logged as clean. Stand her back.',
  'daywork-end': 'Day works are done. Burning continues on ELIN under permit, light duty only.',
  'floods-on': 'Floodlights going up. Night shift, mind your shadows.',
  'whistle-0600': '', // whistle only
  'whistle-1400': '',
  'whistle-2200': '',
  'crane-shift': '', // handled by crane system
  'rain-start': 'It is raining. It is a shipyard.',
  'rain-end': 'Rain easing. The plates drink before we do.',
  'launch-recradle': 'HULL 43 re-cradled on No.2 way overnight. She will do it again this afternoon. That is the arrangement.',
  'dawn-watch': 'Morning watch. Fog on the beach again. ELIN can wait for the light.',
};

export const ARRIVAL_PA = 'Yard announce. Surveyor, the clipboard is at the office window. The yard will introduce itself as you go.';

export const SFX_CAPTIONS: Record<string, string> = {
  foghorn: '[foghorn, two long notes]',
  foghornFar: '[foghorn, far off]',
  twoTone: '[crane horn, two notes]',
  whistle: '[shift whistle, three blasts]',
  chime: '[PA chime]',
  siren: '[launch siren]',
  groan: '[the ways take the strain]',
  rumble: '[a long rumble down the slip]',
  splash: '[she meets the water]',
  weld: '[welding, nearby]',
  torch: '[cutting torch, nearby]',
  grinder: '[grinder on plate]',
  hammer: '[caulking hammers]',
  gull: '[gulls]',
  quiet: '[the yard goes quiet — tea break]',
  horns: '[horns across the harbor]',
};

export const CONNECTION_NOTE = 'Same heat. 61204. The new ship is wearing her plate.';
export const CONNECTION_CAPTION = 'The surveyor writes it in the margin, small: “same heat.” A horn answers, far off.';

export const HINTS = {
  move: 'W A S D — WALK · MOUSE — LOOK · E — INSPECT · TAB — CLIPBOARD',
  clipboard: 'TAB — CLIPBOARD · N — NOTICEBOARD',
};

/** 2D reading copy — the same yard in words. Complete on purpose. */
export const TWOD_COPY: { title: string; html: string }[] = [
  {
    title: 'THE GATE',
    html: `<p>JERNVIK SHIPBUILDING &amp; SALVAGE CO., established 1913 as a breaker's yard, building since the war it does not discuss. The cast motto over the gate reads: <em>we only launch what we can remember.</em> You are the new surveyor. The Timekeeper's lamp is always on.</p>`,
  },
  {
    title: 'THE WAYS — HULL 44',
    html: `<p>Two concrete ways run into the harbor. On No.1 way, HULL 44 is rising: keel laid this spring, red-oxide plates going on strake by strake, frames forward still open to the sky like a rib cage. Her steel comes from the stock yard, certified heats only. The way board says so.</p>`,
  },
  {
    title: 'THE CUT — MV ELIN',
    html: `<p>On the beach south-west, MV ELIN is coming apart under permit — a coaster, laid down in 1961, delivered to the beach under her own steam. Burners work the tide. Her cutting plan releases sound plate to the stock yard, stamps preserved. The yard keeps its paperwork; the paperwork keeps the yard honest.</p>`,
  },
  {
    title: 'STEEL REMEMBERED',
    html: `<p>A plate carries its heat number longer than it carries its paint. Find a stamp on a new hull, find the same stamp on an old one, and the two ends of the yard hold hands. That is the whole trade: nothing at Jernvik is thrown away, and nothing at Jernvik is forgotten. <em>Steel remembered.</em></p>`,
  },
];
