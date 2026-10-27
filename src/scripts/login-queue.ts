/**
 * Login Queue: a ~45 second captcha shooter that gates the site.
 * You are the login filter at the bottom. Bots descend toward the login line; fire captchas at
 * them. Players descend too, and hitting one is a false positive. From wave 2 some bots wear a
 * player disguise that drops as they get closer. Canvas 2D, 240x160 logical pixels, no deps.
 */

type Kind = 'human' | 'bot';
type State = 'title' | 'playing' | 'won' | 'lost';

interface Ent {
  /** Centre x and top y in logical pixels. */
  x: number;
  y: number;
  baseX: number;
  sway: number;
  kind: Kind;
  /** A bot still drawn as a player. */
  disguised: boolean;
  revealAt: number;
  /** Seconds of reveal ring left. */
  ring: number;
  /** Seconds of death animation left; 0 means alive. */
  dead: number;
  deathKind: 'burst' | 'fp' | null;
  gone: boolean;
}

interface Wave {
  spawns: number;
  gap: number;
  speed: number;
  botRate: number;
  disguise: number;
  revealY: number;
  maxOn: number;
  banner: string;
}

interface Stats {
  blocked: number;
  ato: number;
  fp: number;
  passed: number;
}

interface Colors {
  panel: string;
  paper: string;
  ink: string;
  ink2: string;
  line: string;
  accent: string;
  signal: string;
}

export interface LoginQueue {
  reset(): void;
  focus(): void;
}

const W = 240;
const H = 160;
const HUD_H = 24;
const LINE_Y = 146;
const SHIP_Y = 136;
const SHIP_SPEED = 120;
const BULLET_SPEED = 300;
const MAX_ATO = 3;
const MAX_FP = 3;
const SCALE = 2;
const BANNER_T = 1.4;

const WAVES: Wave[] = [
  { spawns: 12, gap: 1.2, speed: 45, botRate: 0.5, disguise: 0, revealY: Infinity, maxOn: 3, banner: 'WAVE 1' },
  { spawns: 12, gap: 1.0, speed: 50, botRate: 0.55, disguise: 0.3, revealY: 64, maxOn: 4, banner: 'BOTS NOW SPOOF PLAYERS' },
  { spawns: 14, gap: 1.0, speed: 50, botRate: 0.6, disguise: 0.5, revealY: 66, maxOn: 3, banner: 'WATCH FOR THE TELL' },
];

const HUMAN = ['..####..', '.######.', '.######.', '..####..', '.######.', '########', '########', '.##..##.'];
const BOT = ['...#....', '.######.', '.#.##.#.', '.######.', '.######.', '#.####.#', '#.####.#', '.##..##.'];
const SHIP = [
  '.......##.......',
  '......####......',
  '......####......',
  '..###.####.###..',
  '.##############.',
  '################',
  '################',
  '.##..##..##..##.',
];

const MOVE_KEYS: Record<string, number> = { ArrowLeft: -1, KeyA: -1, ArrowRight: 1, KeyD: 1 };
const FIRE_KEYS = new Set(['Space', 'ArrowUp', 'KeyW', 'KeyS']);

function readColors(el: HTMLElement): Colors {
  const cs = getComputedStyle(el);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  return {
    panel: v('--accent-fill'),
    paper: v('--paper'),
    ink: v('--ink'),
    ink2: v('--ink-2'),
    line: v('--line'),
    accent: v('--accent'),
    signal: v('--signal'),
  };
}

export function mountLoginQueue(root: HTMLElement, onWin: () => void): LoginQueue {
  const canvas = root.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return { reset() {}, focus() {} };
  const c = ctx;

  canvas.width = W;
  canvas.height = H;
  c.imageSmoothingEnabled = false;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speedK = reduced ? 0.6 : 1;
  let colors = readColors(root);

  let state: State = 'title';
  let ents: Ent[] = [];
  let stats: Stats = fresh();
  let wi = 0;
  let spawned = 0;
  let nextSpawn = 0;
  let bannerT = 0;
  let ship = W / 2;
  let bullet: { x: number; y: number } | null = null;
  let flash = 0;
  let t = 0;
  let last = 0;
  let raf = 0;
  let winTimer = 0;
  let loseReason = '';
  let inView = true;
  const heldKeys = new Set<number>();
  const heldButtons = new Set<number>();

  function fresh(): Stats {
    return { blocked: 0, ato: 0, fp: 0, passed: 0 };
  }

  function setState(next: State) {
    state = next;
    root.dataset.state = next;
  }

  function auth(): string {
    const seen = stats.passed + stats.fp;
    return seen === 0 ? '100.0' : ((stats.passed / seen) * 100).toFixed(1);
  }

  function moveDir(): number {
    let d = 0;
    for (const k of heldKeys) d += k;
    for (const k of heldButtons) d += k;
    return Math.sign(d);
  }

  function start() {
    window.clearTimeout(winTimer);
    ents = [];
    stats = fresh();
    wi = 0;
    spawned = 0;
    nextSpawn = 0;
    bannerT = BANNER_T;
    ship = W / 2;
    bullet = null;
    flash = 0;
    t = 0;
    loseReason = '';
    heldKeys.clear();
    heldButtons.clear();
    setState('playing');
    last = 0;
    loop();
  }

  function reset() {
    window.clearTimeout(winTimer);
    cancelAnimationFrame(raf);
    setState('title');
    ents = [];
    stats = fresh();
    bullet = null;
    draw();
  }

  function loop() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function frame(ts: number) {
    if (state !== 'playing') return draw();
    if (!inView || document.hidden) {
      last = 0;
      return;
    }
    const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
    last = ts;
    update(dt);
    draw();
    if (state === 'playing') raf = requestAnimationFrame(frame);
  }

  function spawn(w: Wave) {
    const kind: Kind = Math.random() < w.botRate ? 'bot' : 'human';
    const disguised = kind === 'bot' && Math.random() < w.disguise;
    const baseX = 16 + Math.random() * (W - 32);
    ents.push({
      x: baseX,
      y: -16,
      baseX,
      sway: Math.random() * Math.PI * 2,
      kind,
      disguised,
      revealAt: disguised ? w.revealY : Infinity,
      ring: 0,
      dead: 0,
      deathKind: null,
      gone: false,
    });
  }

  function fire() {
    if (state !== 'playing' || bullet) return;
    bullet = { x: Math.round(ship), y: SHIP_Y - 4 };
  }

  function hit(e: Ent) {
    if (e.kind === 'bot') {
      stats.blocked++;
      e.dead = 0.3;
      e.deathKind = 'burst';
    } else {
      stats.fp++;
      e.dead = 0.5;
      e.deathKind = 'fp';
    }
  }

  function update(dt: number) {
    t += dt;
    if (flash > 0) flash -= dt;
    const w = WAVES[wi];

    ship = Math.max(8, Math.min(W - 8, ship + moveDir() * SHIP_SPEED * dt));

    if (bullet) {
      bullet.y -= BULLET_SPEED * dt;
      if (bullet.y < HUD_H) bullet = null;
    }

    if (bannerT > 0) {
      bannerT -= dt;
    } else {
      nextSpawn -= dt;
      const alive = ents.filter((e) => !e.gone && e.dead <= 0).length;
      if (nextSpawn <= 0 && spawned < w.spawns && alive < w.maxOn) {
        spawn(w);
        spawned++;
        nextSpawn = w.gap;
      }
    }

    for (const e of ents) {
      if (e.gone) continue;
      if (e.dead > 0) {
        e.dead -= dt;
        if (e.dead <= 0) e.gone = true;
        continue;
      }
      e.y += w.speed * speedK * dt;
      e.x = e.baseX + Math.sin(t * 2 + e.sway) * 6;
      if (e.disguised && e.y >= e.revealAt) {
        e.disguised = false;
        e.ring = 0.18;
      }
      if (e.ring > 0) e.ring -= dt;

      if (bullet && bullet.x >= e.x - 8 && bullet.x <= e.x + 8 && bullet.y <= e.y + 16 && bullet.y + 4 >= e.y) {
        bullet = null;
        hit(e);
        continue;
      }

      if (e.y + 16 >= LINE_Y) {
        if (e.kind === 'bot') {
          stats.ato++;
          flash = 0.25;
        } else {
          stats.passed++;
        }
        e.gone = true;
      }
    }
    ents = ents.filter((e) => !e.gone);

    if (stats.ato >= MAX_ATO) return lose('ato');
    if (stats.fp >= MAX_FP) return lose('fp');

    if (bannerT <= 0 && spawned >= w.spawns && ents.length === 0) {
      if (wi === WAVES.length - 1) return win();
      wi++;
      spawned = 0;
      nextSpawn = 0.3;
      bannerT = BANNER_T;
    }
  }

  function win() {
    flash = 0;
    setState('won');
    draw();
    winTimer = window.setTimeout(onWin, 1600);
  }

  function lose(reason: string) {
    flash = 0;
    setState('lost');
    loseReason = reason;
    draw();
  }

  // Drawing helpers. Coordinates are rounded so the pixel font stays crisp.
  function text(s: string, x: number, y: number, color = colors.ink) {
    c.fillStyle = color;
    c.fillText(s, Math.round(x), Math.round(y));
  }
  function textRight(s: string, x: number, y: number, color = colors.ink) {
    text(s, x - c.measureText(s).width, y, color);
  }
  function center(s: string, y: number, color = colors.ink) {
    text(s, (W - c.measureText(s).width) / 2, y, color);
  }
  function blit(map: string[], x: number, y: number, scale: number, color: string) {
    c.fillStyle = color;
    for (let py = 0; py < map.length; py++) {
      const row = map[py];
      for (let px = 0; px < row.length; px++) {
        if (row[px] === '#') c.fillRect(Math.round(x + px * scale), Math.round(y + py * scale), scale, scale);
      }
    }
  }

  function drawEnt(e: Ent) {
    const left = e.x - 8;
    if (e.dead > 0) {
      if (e.deathKind === 'burst') {
        if (reduced) return;
        const p = 1 - e.dead / 0.3;
        const r = 4 + p * 10;
        c.fillStyle = colors.signal;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          c.fillRect(Math.round(e.x + Math.cos(a) * r) - 1, Math.round(e.y + 8 + Math.sin(a) * r) - 1, 2, 2);
        }
      } else {
        c.globalAlpha = Math.max(0, e.dead / 0.5);
        blit(HUMAN, left, e.y, SCALE, colors.accent);
        c.globalAlpha = 1;
        text('!', e.x - 2, e.y - 10, colors.signal);
      }
      return;
    }
    const asBot = e.kind === 'bot' && !e.disguised;
    blit(asBot ? BOT : HUMAN, left, e.y, SCALE, asBot ? colors.signal : colors.accent);
    if (e.ring > 0) {
      c.fillStyle = colors.ink;
      c.fillRect(Math.round(left) - 2, Math.round(e.y) - 2, 20, 1);
      c.fillRect(Math.round(left) - 2, Math.round(e.y) + 17, 20, 1);
      c.fillRect(Math.round(left) - 2, Math.round(e.y) - 2, 1, 20);
      c.fillRect(Math.round(left) + 17, Math.round(e.y) - 2, 1, 20);
    }
  }

  function draw() {
    c.fillStyle = colors.panel;
    c.fillRect(0, 0, W, H);

    // Playfield, clipped under the HUD so sprites emerge from beneath it.
    c.save();
    c.beginPath();
    c.rect(0, HUD_H, W, H - HUD_H);
    c.clip();

    c.fillStyle = colors.accent;
    c.fillRect(0, LINE_Y, W, 1);
    c.fillRect(0, LINE_Y - 3, 2, 4);
    c.fillRect(W - 2, LINE_Y - 3, 2, 4);

    for (const e of ents) drawEnt(e);

    blit(SHIP, ship - 8, SHIP_Y, 1, colors.accent);
    if (bullet) {
      c.fillStyle = colors.accent;
      c.fillRect(bullet.x - 1, Math.round(bullet.y), 2, 4);
    }
    c.restore();

    if (flash > 0 && !reduced) {
      c.fillStyle = colors.signal;
      c.fillRect(0, HUD_H, W, 2);
      c.fillRect(0, H - 2, W, 2);
      c.fillRect(0, HUD_H, 2, H - HUD_H);
      c.fillRect(W - 2, HUD_H, 2, H - HUD_H);
    }

    c.font = '8px Silkscreen, monospace';
    c.textBaseline = 'top';

    if (state === 'playing') {
      text(`WAVE ${wi + 1}/${WAVES.length}`, 4, 4);
      textRight(`BLOCKED ${String(stats.blocked).padStart(2, '0')}`, W - 4, 4);
      text(`ATO ${stats.ato}/${MAX_ATO}`, 4, 14, colors.ink2);
      textRight(`FP ${stats.fp}/${MAX_FP}`, W - 4, 14, colors.ink2);
      if (bannerT > 0) {
        c.fillStyle = colors.paper;
        c.fillRect(20, 56, W - 40, 20);
        c.fillStyle = colors.accent;
        c.fillRect(20, 56, W - 40, 1);
        c.fillRect(20, 75, W - 40, 1);
        center(WAVES[wi].banner, 62, colors.accent);
      }
      return;
    }

    // Overlay card for title, win and lose.
    c.fillStyle = colors.paper;
    c.fillRect(20, 40, W - 40, 80);
    c.fillStyle = colors.accent;
    c.fillRect(20, 40, W - 40, 1);
    c.fillRect(20, 119, W - 40, 1);
    c.fillRect(20, 40, 1, 80);
    c.fillRect(W - 21, 40, 1, 80);

    if (state === 'title') {
      center('LOGIN QUEUE', 48, colors.accent);
      center('BOTS HAVE FLOODED THE SITE', 62, colors.signal);
      center('FIRE CAPTCHAS AT BOTS', 74);
      center("DON'T HIT THE PLAYERS", 84);
      center('PRESS START', 104, colors.accent);
    } else if (state === 'won') {
      center('ACCESS RESTORED', 50, colors.accent);
      center(`AUTH SUCCESS ${auth()}%`, 68);
      center(`${stats.blocked} BOTS BLOCKED`, 78);
      center(`${stats.fp} PLAYERS HIT`, 88, colors.ink2);
      center('WELCOME BACK', 104, colors.accent);
    } else {
      if (loseReason === 'fp') {
        center('3 PLAYERS BLOCKED', 54, colors.signal);
        center('REAL PLAYERS GOT CAPTCHAS', 70);
      } else {
        center('3 ACCOUNT TAKEOVERS', 54, colors.signal);
        center('THE BOTS GOT IN', 70);
      }
      center(`AUTH SUCCESS ${auth()}%`, 80, colors.ink2);
      center('PRESS START TO RETRY', 100, colors.accent);
    }
  }

  // Keyboard: move and fire only while playing and in view; Enter/Space on the canvas starts.
  window.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (state === 'playing') {
      if (!inView) return;
      const dir = MOVE_KEYS[e.code];
      if (dir !== undefined) {
        e.preventDefault();
        heldKeys.add(dir);
        return;
      }
      if (FIRE_KEYS.has(e.code)) {
        e.preventDefault();
        if (!e.repeat) fire();
      }
      return;
    }
    if (document.activeElement === canvas && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      start();
    }
  });
  window.addEventListener('keyup', (e) => {
    const dir = MOVE_KEYS[e.code];
    if (dir !== undefined) heldKeys.delete(dir);
  });
  window.addEventListener('blur', () => heldKeys.clear());

  canvas.addEventListener('pointerdown', () => {
    if (state !== 'playing') {
      canvas.focus();
      start();
      return;
    }
    fire();
  });

  // Touch pad: hold to move, tap to fire.
  root.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((b) => {
    const dir = Number(b.dataset.move);
    const down = (e: Event) => {
      e.preventDefault();
      heldButtons.add(dir);
    };
    const up = () => heldButtons.delete(dir);
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('pointerleave', up);
  });
  root.querySelector('[data-fire]')?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    fire();
  });
  root.querySelector('[data-start]')?.addEventListener('click', () => {
    canvas.focus();
    start();
  });

  document.addEventListener('visibilitychange', () => {
    heldKeys.clear();
    if (!document.hidden && state === 'playing') {
      last = 0;
      loop();
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        inView = entries.some((en) => en.isIntersecting);
        if (!inView) heldKeys.clear();
        if (inView && state === 'playing') {
          last = 0;
          loop();
        }
      },
      { threshold: 0.2 },
    ).observe(root);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    colors = readColors(root);
    draw();
  });

  // Dev-only hook so the browser test can play the game by reading real state.
  if (import.meta.env.DEV) {
    (window as unknown as { __lq: unknown }).__lq = {
      snapshot: () => ({
        state,
        wave: wi + 1,
        stats: { ...stats },
        loseReason,
        shipX: ship,
        bullet: !!bullet,
        ents: ents
          .filter((e) => e.dead <= 0)
          .map((e) => ({ x: e.x, y: e.y, kind: e.kind, revealed: e.kind === 'human' || !e.disguised })),
      }),
    };
  }

  root.dataset.state = state;
  draw();
  if (document.fonts?.load) document.fonts.load('8px Silkscreen').then(draw, draw);

  return {
    reset,
    focus: () => canvas.focus(),
  };
}
