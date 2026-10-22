import { state, save, emit } from '../state/store';

export interface NoticeHooks {
  onQuality(): void;
  onVolumes(): void;
  onCaptions(): void;
  onContrast(): void;
  onReducedMotion(): void;
  openTwod(): void;
}

/** The noticeboard. Settings never pause the yard. */
export class Noticeboard {
  private root: HTMLElement;
  constructor(private hooks: NoticeHooks) {
    this.root = document.getElementById('noticeboard')!;
    const bind = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

    const amb = bind('set-amb') as HTMLInputElement;
    const sfx = bind('set-sfx') as HTMLInputElement;
    const mute = bind('set-mute') as HTMLInputElement;
    const caps = bind('set-caps') as HTMLInputElement;
    const capsize = bind('set-capsize') as HTMLSelectElement;
    const rm = bind('set-rm') as HTMLInputElement;
    const sens = bind('set-sens') as HTMLInputElement;
    const quality = bind('set-quality') as HTMLSelectElement;
    const hc = bind('set-hc') as HTMLInputElement;

    // load current values
    amb.value = String(state.settings.amb);
    sfx.value = String(state.settings.sfx);
    mute.checked = state.settings.mute;
    caps.checked = state.settings.captions;
    capsize.value = state.settings.capSize;
    rm.checked = state.settings.reducedMotion;
    sens.value = String(state.settings.sens);
    quality.value = state.settings.quality;
    hc.checked = state.settings.highContrast;

    const volChange = (): void => {
      state.settings.amb = Number(amb.value);
      state.settings.sfx = Number(sfx.value);
      state.settings.mute = mute.checked;
      save(); emit('settings'); this.hooks.onVolumes();
    };
    amb.addEventListener('input', volChange);
    sfx.addEventListener('input', volChange);
    mute.addEventListener('change', volChange);

    caps.addEventListener('change', () => {
      state.settings.captions = caps.checked; save(); emit('settings'); this.hooks.onCaptions();
    });
    capsize.addEventListener('change', () => {
      state.settings.capSize = capsize.value as 's' | 'm' | 'l'; save(); emit('settings'); this.hooks.onCaptions();
    });
    rm.addEventListener('change', () => {
      state.settings.reducedMotion = rm.checked; save(); emit('settings'); this.hooks.onReducedMotion();
    });
    sens.addEventListener('input', () => { state.settings.sens = Number(sens.value); save(); });
    quality.addEventListener('change', () => {
      state.settings.quality = quality.value as typeof state.settings.quality; save(); this.hooks.onQuality();
    });
    hc.addEventListener('change', () => {
      state.settings.highContrast = hc.checked; save(); this.hooks.onContrast();
    });

    bind('set-clear').addEventListener('click', () => {
      state.narrative = { records: [], docs: [], orders: [], zones: [], connected: false, seconds: 0, day: 1 };
      save(); emit('narrative');
    });
    bind('set-twod').addEventListener('click', () => this.hooks.openTwod());
  }

  get open(): boolean { return !this.root.hidden; }
  toggle(): void { this.root.hidden = !this.root.hidden; }
  close(): void { this.root.hidden = true; }
}
