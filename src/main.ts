import './styles.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/700.css';

import * as THREE from 'three/webgpu';
import { Render, QUALITY_LEVELS } from './engine/renderer';
import { Loop } from './engine/loop';
import { AudioEngine } from './engine/audio/engine';
import { AudioDirector } from './systems/audioDirector';
import { buildYard, FLOOD_MASTS } from './world/yard';
import { Sky } from './world/sky';
import { waterLevel, groundHeight } from './world/ground';
import { zoneAt } from './content/zones';
import { YardClock } from './systems/clock';
import { Weather } from './systems/weather';
import { Production } from './systems/production';
import { LaunchSystem } from './systems/launch';
import { Crew } from './world/crew';
import { Gulls } from './world/gulls';
import { FloodPool } from './systems/floods';
import { Input } from './player/input';
import { PlayerController } from './player/controller';
import { Interaction } from './player/interact';
import { Discovery } from './inspection/discovery';
import { Captions } from './ui/captions';
import { Hud } from './ui/hud';
import { DocCard } from './ui/doccard';
import { Clipboard } from './ui/clipboard';
import { Noticeboard } from './ui/noticeboard';
import { Twod } from './ui/twod';
import { state, save } from './state/store';
import { ARRIVAL_PA, HINTS, SFX_CAPTIONS, PA_LINES } from './content/lines';
import { clamp, damp, easeInOut } from './utils/math';

/* ================================================================
   JERNVIK — boot, arrival, and the daily round.
   ================================================================ */

const $ = (id: string): HTMLElement => document.getElementById(id)!;

async function boot(): Promise<void> {
  const bootlist = $('bootlist');
  const step = (name: string, done: string): void => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span><b>${done}</b>`;
    bootlist.appendChild(li);
    requestAnimationFrame(() => li.classList.add('on'));
  };

  /* ---------- UI shells first: they work even if the renderer doesn't ---------- */
  const captions = new Captions($('captions'));
  const hud = new Hud();
  const card = new DocCard();
  const clipboard = new Clipboard();
  const twod = new Twod();
  const audioE = new AudioEngine();
  const audio = new AudioDirector(audioE);
  const discovery = new Discovery(captions, card, clipboard, audio);

  const applyCaptionSettings = (): void => {
    document.documentElement.style.setProperty(
      '--cap-scale',
      state.settings.capSize === 's' ? '0.85' : state.settings.capSize === 'l' ? '1.35' : '1',
    );
    $('captions').style.display = state.settings.captions ? '' : 'none';
  };
  const applyContrast = (): void => {
    document.body.classList.toggle('hc', state.settings.highContrast);
  };
  applyCaptionSettings();
  applyContrast();

  /* ---------- renderer: WebGPU first, WebGL2 inside the same scene graph ---------- */
  let render: Render | null = null;
  step('RENDERER', 'waking…');
  render = await Render.create($('gl') as HTMLCanvasElement);
  if (!render) {
    step('RENDERER', 'UNAVAILABLE');
    step('THE YARD', 'READING COPY');
    twod.show();
    $('boot').classList.add('boot--gone');
    return;
  }
  step('RENDERER', render.backend === 'webgpu' ? 'WEBGPU' : 'WEBGL2');

  /* ---------- the yard ---------- */
  const hooks = {
    stamp: (id: string): void => discovery.stamp(id),
    doc: (id: string): void => discovery.doc(id),
    torbenHorn: (): void => {
      if (!audioE.ctx) return;
      audio.cues.twoTone({ x: 70, y: 1.4, z: 26 });
      captions.sfx(SFX_CAPTIONS.twoTone);
    },
  };
  const yard = buildYard(hooks);
  step('YARD', 'OPEN');
  step('VESSELS', 'ELIN · 44 · 43');
  step('TIDE', 'TURNING');
  step('SURVEY', 'STAMPS FOUND');

  const scene = yard.scene;
  const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 1600);
  camera.position.set(187, 2.4, -15);
  scene.add(camera);

  const sky = new Sky(scene);
  const weather = new Weather(scene);
  const floods = new FloodPool(scene, FLOOD_MASTS);
  step('AUDIO', 'ON CLOCK-IN');

  /* ---------- systems ---------- */
  const clock = new YardClock(state.narrative.day || 1);
  const waterY = (): number => waterLevel(clock.simSec);
  const player = new PlayerController(yard.colliders, () => audio.step(), waterY);
  const interaction = new Interaction(yard.interactables);
  const input = new Input($('gl') as HTMLCanvasElement);
  const launch = new LaunchSystem(yard.kirsten, audio.cues, (t) => captions.pa(t), scene);
  const crew = new Crew(scene);
  const gulls = new Gulls(scene);

  const inOverlook = (): boolean => zoneAt(player.pos.x, player.pos.z)?.id === 'overlook';
  const A_PENT = [110, 130.81, 146.83, 164.81, 196.0];
  const production = new Production(scene, yard.points, audio.cues, (pos) => {
    if (audioE.ctx && inOverlook()) {
      const f = A_PENT[Math.floor(Math.random() * A_PENT.length)] * (Math.random() < 0.5 ? 1 : 2);
      audio.cues.pluck(f, pos);
    }
  });

  /* ---------- noticeboard ---------- */
  const notice = new Noticeboard({
    onQuality: () => quality.apply(),
    onVolumes: () => audioE.setVolumes({ amb: state.settings.amb, sfx: state.settings.sfx, mute: state.settings.mute }),
    onCaptions: applyCaptionSettings,
    onContrast: applyContrast,
    onReducedMotion: () => { /* read live where needed */ },
    openTwod: () => { twod.show(); input.releaseLock(); },
  });
  audioE.setVolumes({ amb: state.settings.amb, sfx: state.settings.sfx, mute: state.settings.mute });

  /* ---------- overlays ↔ pointer lock ---------- */
  const anyOverlayOpen = (): boolean => card.open || clipboard.open || notice.open || twod.open;
  input.onInteract = () => {
    if (card.open) { card.close(); return; }
    if (anyOverlayOpen()) return;
    if (interaction.focus) interaction.trigger();
    else input.requestLock();
  };
  input.onEscape = () => {
    if (card.open) card.close();
    else if (clipboard.open) clipboard.close();
    else if (notice.open) notice.close();
    else if (twod.open) twod.close();
  };
  input.onClipboard = () => { if (!card.open) clipboard.toggle(); };
  input.onNotice = () => { if (!card.open) notice.toggle(); };
  card.onClosed = () => { /* the yard kept moving anyway */ };

  /* ---------- quality: modest start, honest governance ---------- */
  let tierName: keyof typeof QUALITY_LEVELS = 'high';
  const quality = {
    apply(): void {
      const name = state.settings.quality === 'auto' ? tierName : state.settings.quality;
      const q = QUALITY_LEVELS[name];
      render!.applyQuality(q);
      camera.far = q.far;
      camera.updateProjectionMatrix();
      sky.setFar(q.far);
      weather.setBudget(q.rain);
      const sh = sky.sun.shadow;
      if (sh.mapSize.x !== q.shadowSize) {
        sh.mapSize.set(q.shadowSize, q.shadowSize);
        if (sh.map) { sh.map.dispose(); (sh as unknown as { map: null }).map = null; }
      }
    },
  };
  quality.apply();
  render.resize();

  /* ---------- stats ---------- */
  let statsEl: HTMLElement | null = null;
  let statsOn = false;
  input.onStats = () => {
    statsOn = !statsOn;
    if (statsOn && !statsEl) {
      statsEl = document.createElement('div');
      statsEl.id = 'stats';
      document.body.appendChild(statsEl);
    }
    if (statsEl) statsEl.style.display = statsOn ? '' : 'none';
  };

  /* ---------- arrival ---------- */
  const ARRIVE_DUR = state.settings.reducedMotion ? 3.2 : 15;
  let arrivalT = -1;
  const camFrom = new THREE.Vector3(187, 2.1, -17);
  const lookFrom = new THREE.Vector3(-60, 24, 10);
  let arriveOverlay = $('arrive');
  let titleEl = $('title');

  const beginArrival = (): void => {
    arrivalT = 0;
    hud.show();
    $('boot').classList.add('boot--gone');
    arriveOverlay.classList.add('arrive--in');
    audioE.ensure();
    audio.startBeds({ x: 70, y: 1, z: 26 });
    audioE.setVolumes({ amb: state.settings.amb, sfx: state.settings.sfx, mute: state.settings.mute });
    discovery.clockedIn();
    window.setTimeout(() => {
      captions.pa(ARRIVAL_PA);
      if (audioE.ctx) audio.cues.paChime();
    }, (ARRIVE_DUR - 3) * 1000);
  };

  $('enter').addEventListener('click', beginArrival);

  const skipArrival = (): void => { if (arrivalT >= 0 && arrivalT < ARRIVE_DUR) arrivalT = ARRIVE_DUR; };
  input.onAnyKey = skipArrival;
  $('gl').addEventListener('mousedown', skipArrival);

  const endArrival = (): void => {
    arrivalT = ARRIVE_DUR;
    titleEl.classList.remove('title--on');
    arriveOverlay.style.opacity = '0';
    player.enabled = true;
    hud.hint(HINTS.move);
    window.setTimeout(() => hud.hint(null), 9000);
    window.setTimeout(() => hud.hint(HINTS.clipboard), 16000);
    window.setTimeout(() => hud.hint(null), 26000);
    captions.sfx(SFX_CAPTIONS.foghorn);
    if (audioE.ctx) audio.cues.foghorn('near');
  };

  /* ---------- debug hook (also used by the verification harness) ---------- */
  const api = {
    clock, player, camera, render, yard,
    place(x: number, z: number, yawDeg = 90): void {
      player.pos.set(x, groundHeight(x, z), z);
      player.yaw = (yawDeg * Math.PI) / 180;
      player.enabled = true;
      if (arrivalT < ARRIVE_DUR) endArrival();
    },
    toggle(name: string): void {
      scene.traverse((o) => {
        if (o.name === name) o.visible = !o.visible;
      });
    },
    focusInfo(): { id: string | null; label: string | null } {
      return { id: interaction.focus?.id ?? null, label: interaction.focus?.label ?? null };
    },
    lookAt(x: number, y: number, z: number): void {
      const dx = x - player.pos.x, dy = y - (player.pos.y + player.eye), dz = z - player.pos.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      player.pitch = Math.asin(dy / len);
      player.yaw = Math.atan2(-dx / len, -dz / len);
    },
    setTime(hhmm: string): void {
      clock.force(hhmm);
      sky.snap(clock.yardSec, weather.fogMul);
      render!.three.toneMappingExposure = sky.exposure;
    },
    setShadows(on: boolean): void {
      render!.three.shadowMap.enabled = on;
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => { x.needsUpdate = true; });
        else if (m) m.needsUpdate = true;
      });
    },
    stats(): { fps: number; calls: number; tris: number; backend: string } {
      return { fps: Math.round(loop.fps), calls: render!.stats.calls, tris: render!.stats.tris, backend: render!.backend };
    },
  };
  (window as unknown as { __jernvik: typeof api }).__jernvik = api;

  /* ---------- the daily round ---------- */
  let lastHour = Math.floor(clock.yardSec / 3600);
  let lastZone = '';
  let saveT = 0;
  let highMsT = 0;
  let lowMsT = 0;

  const onSim = (dt: number): void => {
    // the clock drives everything
    const events = clock.update(dt);
    const yardSec = clock.yardSec;
    const hour = Math.floor(yardSec / 3600);
    const tea = yardSec >= 9.5 * 3600 && yardSec < 9.75 * 3600;

    for (const id of events) {
      if (id.startsWith('launch-')) launch.onEvent(id, yardSec);
      if (id.startsWith('whistle-')) {
        if (audioE.ctx) audio.cues.shiftWhistle();
        captions.sfx(SFX_CAPTIONS.whistle);
        continue;
      }
      const t = PA_LINES[id];
      if (t) { captions.pa(t); if (audioE.ctx) audio.cues.paChime(); }
    }

    // player
    if (player.enabled && !anyOverlayOpen()) {
      const look = input.consumeLook();
      player.look(look.dx, look.dy, state.settings.sens);
      player.update(dt, input.axis());
    } else {
      player.update(dt, { x: 0, z: 0 });
      input.consumeLook();
    }

    // world
    yard.tick({ simSec: clock.simSec, yardSec });
    weather.update(dt, yardSec, player.pos);
    crew.update(dt, yardSec, tea);
    gulls.update(dt, clock.simSec, yardSec > 5.8 * 3600 && yardSec < 19.5 * 3600);
    // wet ground: the floor drinks when it rains
    {
      const fm = yard.ground.floorMat;
      const wet = weather.rain;
      fm.color.setRGB(1 - wet * 0.42, 1 - wet * 0.42, 1 - wet * 0.4);
      fm.roughness = 0.94 - wet * 0.4;
    }
    production.update(dt, yardSec, player.pos, tea);
    launch.update(dt, waterY());

    hud.clock(clock.hhmm(), clock.day);

    // zones → HUD + work orders
    const zn = zoneAt(player.pos.x, player.pos.z);
    if (zn) {
      if (zn.id !== lastZone) { lastZone = zn.id; hud.place(zn.name); }
      discovery.visit(zn.id);
    }

    // foghorn at the top of every yard hour
    if (hour !== lastHour) {
      lastHour = hour;
      if (audioE.ctx) audio.cues.foghorn('near');
    }

    // audio beds + listener
    const fwd = player.forward;
    audioE.updateListener(player.pos.x, player.pos.y + player.eye, player.pos.z, fwd.x, 0, fwd.z);
    audio.update(dt, player.pos, weather, null);

    // narrative time + autosave
    state.narrative.seconds += dt;
    saveT += dt;
    if (saveT > 10) { saveT = 0; state.narrative.day = clock.day; save(); }

    // adaptive quality (only downward is proactive; upward is earned)
    if (state.settings.quality === 'auto') {
      if (loop.ms > 27) { highMsT += dt; lowMsT = 0; } else if (loop.ms < 13.5) { lowMsT += dt; highMsT = 0; }
      else { highMsT = 0; lowMsT = 0; }
      if (highMsT > 5) {
        highMsT = 0;
        const order: Array<keyof typeof QUALITY_LEVELS> = ['low', 'medium', 'high', 'ultra'];
        const idx = order.indexOf(tierName);
        if (idx > 0) { tierName = order[idx - 1]; quality.apply(); }
      }
      if (lowMsT > 40) {
        lowMsT = 0;
        const order: Array<keyof typeof QUALITY_LEVELS> = ['low', 'medium', 'high', 'ultra'];
        const idx = order.indexOf(tierName);
        const capIdx = order.indexOf('high');
        if (idx < Math.min(capIdx, order.length - 1)) { tierName = order[idx + 1]; quality.apply(); }
      }
    }
  };

  const onFrame = (dt: number, _now: number): void => {
    // arrival camera choreography
    if (arrivalT >= 0 && arrivalT < ARRIVE_DUR) {
      arrivalT = Math.min(arrivalT + dt, ARRIVE_DUR);
      const t = arrivalT / ARRIVE_DUR;
      const light = state.settings.reducedMotion ? clamp(t * 4, 0, 1) : clamp((t - 0.12) / 0.5, 0, 1);
      const e = easeInOut(t);
      camera.position.lerpVectors(camFrom, new THREE.Vector3(player.pos.x, player.pos.y + player.eye, player.pos.z), e);
      const lookTo = new THREE.Vector3(player.pos.x - 20, player.pos.y + 2.4, player.pos.z + 4);
      const look = lookFrom.clone().lerp(lookTo, e);
      camera.lookAt(look);
      const p = sky.update(dt, clock.yardSec, player.pos, weather.fogMul, QUALITY_LEVELS[tierName].shadows);
      render!.three.toneMappingExposure = p.exposure * (0.04 + 0.96 * light);
      titleEl.classList.toggle('title--on', t > 0.3 && t < 0.85);
      if (t >= 1) endArrival();
    } else if (arrivalT >= ARRIVE_DUR) {
      const look = input.consumeLook();
      if (player.enabled) player.look(look.dx, look.dy, state.settings.sens);
      player.applyToCamera(camera);
      const p = sky.update(dt, clock.yardSec, player.pos, weather.fogMul, QUALITY_LEVELS[tierName].shadows);
      render!.three.toneMappingExposure = damp(render!.three.toneMappingExposure, p.exposure, 1.2, dt);
      floods.update(dt, player.pos, sky.floodsEnabled ? 1 : 0, clock.yardSec > 8 * 3600 && clock.yardSec < 17 * 3600);
      // interaction prompt (hidden under overlays)
      camera.getWorldDirection(camDir);
      const focus = anyOverlayOpen() ? null : interaction.update(camera.position, camDir);
      hud.prompt(focus ? focus.label : null);
      (document.getElementById('dot') as HTMLElement).classList.toggle('hud__dot--hot', !!focus);
    } else {
      // still booting: gentle idle so the checklist has a living frame behind it
      sky.update(1 / 60, clock.yardSec, player.pos, weather.fogMul, false);
      render!.three.toneMappingExposure = 0.04;
    }

    render!.render(scene, camera);

    if (statsEl && statsOn) {
      const s = render!.stats;
      const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      statsEl.textContent =
        `fps ${loop.fps.toFixed(0)}  ms ${loop.ms.toFixed(1)}\n` +
        `calls ${s.calls}  tris ${(s.tris / 1000).toFixed(0)}k\n` +
        `backend ${render!.backend}  tier ${state.settings.quality === 'auto' ? tierName : state.settings.quality}` +
        (mem ? `\nheap ${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB` : '');
    }
  };

  const camDir = new THREE.Vector3();
  const loop = new Loop(onSim, onFrame);

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    render!.resize();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

  // player start
  player.pos.set(181, groundHeight(181, -11), -11);
  player.applyToCamera(camera);

  loop.start();
  step('SURVEY', 'READY');
  const enterBtn = $('enter') as HTMLButtonElement;
  enterBtn.disabled = false;
  enterBtn.focus();
}

void boot();
