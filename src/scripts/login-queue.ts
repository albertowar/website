/**
 * Login Queue: a ~45 second captcha shooter that gates the site.
 * You are the login filter at the bottom. Bots descend toward the login line; fire captchas at
 * them. Players descend too, and hitting one is a false positive. From wave 2 some bots wear a
 * player disguise that drops as they get closer. In wave 3 a blocked bot splits in two: block one
 * and it finds another way in. Canvas 2D, 240x160 logical pixels, no deps.
 *
 * Controls: keys or the mouse on desktop; on touch screens tap the screen (the ship slides there and
 * fires, dragging steers) or use the joystick and fire button on the cabinet's control panel.
 */

type Kind = 'human' | 'bot';
/** Which gamer sprite an entity wears; disguised bots wear one too. */
type Look = 'boy' | 'girl';
type State = 'title' | 'playing' | 'won' | 'lost' | 'surrendered';

interface Ent {
  /** Centre x and top y in logical pixels. */
  x: number;
  y: number;
  baseX: number;
  sway: number;
  kind: Kind;
  look: Look;
  /** A bot still drawn as a player. */
  disguised: boolean;
  revealAt: number;
  /** Seconds of reveal ring left. */
  ring: number;
  /** Seconds of death animation left; 0 means alive. */
  dead: number;
  deathKind: 'burst' | 'fp' | null;
  gone: boolean;
  /** Whether blocking this bot in a split wave leaves two behind; the halves never split again. */
  canSplit: boolean;
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
  /** Blocked bots split into two. */
  split: boolean;
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
  /** Start a run. The cabinet calls this once a coin is inserted. */
  start(): void;
  /** Give up: show the surrender screen. The cabinet opens the gate afterwards. */
  surrender(): void;
  focus(): void;
}

const W = 240;
const H = 160;
const HUD_H = 24;
const LINE_Y = 146;
const SHIP_Y = 136;
const SHIP_SPEED = 160;
const BULLET_SPEED = 300;
const MAX_ATO = 3;
const MAX_FP = 3;
const SCALE = 2;
/** Sprites are 8 columns by 10 rows. */
const SPR_H = 10 * SCALE;
const BANNER_T = 1.4;

const WAVES: Wave[] = [
  { spawns: 10, gap: 1.2, speed: 38, botRate: 0.5, disguise: 0, revealY: Infinity, maxOn: 3, banner: 'WAVE 1', split: false },
  { spawns: 10, gap: 1.0, speed: 42, botRate: 0.55, disguise: 0.3, revealY: 64, maxOn: 4, banner: 'BOTS NOW SPOOF PLAYERS', split: false },
  { spawns: 11, gap: 1.0, speed: 42, botRate: 0.6, disguise: 0.5, revealY: 66, maxOn: 3, banner: 'BLOCKED BOTS SPLIT', split: true },
];
/** A bot blocked below this line just dies: two halves this close to the line could not be stopped. */
const SPLIT_MAX_Y = LINE_Y - 50;
const STICK_DEAD = 0.15;
const TAP_SPEED = SHIP_SPEED * 2.5;

// Sprite maps: '.' is transparent, every other character is a palette key (see sprites()).
// Gamers: h hair, H headset, f face, e eyes, # shirt and legs. Robot: # body, e eyes, l chest light.
const GAMER_BOY = [
  '..hhhh..',
  'HhhhhhhH',
  'HffffffH',
  'HfeffefH',
  '.ffffff.',
  '..####..',
  '.######.',
  '#.####.#',
  '..#..#..',
  '.##..##.',
];
const GAMER_GIRL = [
  '..hhhh..',
  'HhhhhhhH',
  'HhffffhH',
  'hfeffefh',
  'hffffffh',
  'h.####.h',
  '.######.',
  '#.####.#',
  '..#..#..',
  '.##..##.',
];
const ROBOT = [
  '...#....',
  '.######.',
  '.#e##e#.',
  '.######.',
  '..####..',
  '#.####.#',
  '#.#ll#.#',
  '#.####.#',
  '..#..#..',
  '.##..##.',
];
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

/** The pixel face. Read from the CSS token because the self-hosted family name is hashed at build time. */
function readPixelFont(el: HTMLElement): string {
  const family = getComputedStyle(el).getPropertyValue('--font-pixel').trim();
  return `8px ${family || 'Silkscreen, monospace'}`;
}

export function mountLoginQueue(root: HTMLElement, onWin: () => void): LoginQueue {
  const canvas = root.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return { reset() {}, focus() {}, start() {}, surrender() {} };
  const c = ctx;

  canvas.width = W;
  canvas.height = H;
  c.imageSmoothingEnabled = false;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speedK = reduced ? 0.6 : 1;
  let colors = readColors(root);
  const pixelFont = readPixelFont(root);

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
  /** Joystick deflection, -1 (full left) to 1 (full right). */
  let stick = 0;
  /** Logical x the mouse is pointing at, while it is over the screen. */
  let pointerX: number | null = null;
  /** Logical x a finger is holding on the screen; the ship slides there. */
  let tapX: number | null = null;
  /** Fire once the ship reaches the tapped spot. */
  let fireOnArrive = false;

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
    return Math.sign(d);
  }

  /** Drop every held input: keys, joystick and finger. */
  function releaseAll() {
    heldKeys.clear();
    setStick(0);
    tapX = null;
    fireOnArrive = false;
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
    releaseAll();
    pointerX = null;
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

  function surrender() {
    window.clearTimeout(winTimer);
    cancelAnimationFrame(raf);
    releaseAll();
    bullet = null;
    setState('surrendered');
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

  function makeEnt(baseX: number, y: number, kind: Kind, more: Partial<Ent> = {}): Ent {
    return {
      x: baseX,
      y,
      baseX,
      sway: Math.random() * Math.PI * 2,
      kind,
      look: Math.random() < 0.5 ? 'boy' : 'girl',
      disguised: false,
      revealAt: Infinity,
      ring: 0,
      dead: 0,
      deathKind: null,
      gone: false,
      canSplit: kind === 'bot',
      ...more,
    };
  }

  function spawn(w: Wave) {
    const kind: Kind = Math.random() < w.botRate ? 'bot' : 'human';
    const disguised = kind === 'bot' && Math.random() < w.disguise;
    ents.push(
      makeEnt(16 + Math.random() * (W - 32), -SPR_H, kind, { disguised, revealAt: disguised ? w.revealY : Infinity }),
    );
  }

  /** Block one, two take its place: the halves fan out from where it was hit. */
  function split(e: Ent) {
    for (const side of [-1, 1]) {
      const baseX = Math.max(16, Math.min(W - 16, e.x + side * 12));
      ents.push(makeEnt(baseX, e.y - 6, 'bot', { canSplit: false, ring: 0.18 }));
    }
  }

  /** Returns whether a captcha left the ship; only one can be in flight. */
  function fire(): boolean {
    if (state !== 'playing' || bullet) return false;
    bullet = { x: Math.round(ship), y: SHIP_Y - 4 };
    return true;
  }

  function hit(e: Ent) {
    if (e.kind === 'bot') {
      stats.blocked++;
      e.dead = 0.3;
      e.deathKind = 'burst';
      if (WAVES[wi].split && e.canSplit && e.y < SPLIT_MAX_Y) split(e);
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

    // Input precedence: keys, then the joystick, then a finger on the screen, then the mouse.
    const dir = moveDir();
    if (dir !== 0) {
      pointerX = null; // keys take over from the mouse until it moves again
      ship += dir * SHIP_SPEED * dt;
    } else if (stick !== 0) {
      pointerX = null;
      ship += stick * SHIP_SPEED * dt;
    } else if (tapX !== null) {
      const gap = tapX - ship;
      const stepX = TAP_SPEED * dt;
      ship = Math.abs(gap) <= stepX ? tapX : ship + Math.sign(gap) * stepX;
    } else if (pointerX !== null) {
      ship = pointerX;
    }
    ship = Math.max(8, Math.min(W - 8, ship));
    // A tap's shot waits for the ship to arrive and for the previous captcha to clear.
    if (fireOnArrive && tapX !== null && Math.abs(ship - Math.max(8, Math.min(W - 8, tapX))) < 1 && fire()) {
      fireOnArrive = false;
    }

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

      if (bullet && bullet.x >= e.x - 8 && bullet.x <= e.x + 8 && bullet.y <= e.y + SPR_H && bullet.y + 4 >= e.y) {
        bullet = null;
        hit(e);
        continue;
      }

      if (e.y + SPR_H >= LINE_Y) {
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
  function blit(map: string[], x: number, y: number, scale: number, palette: Record<string, string>) {
    for (let py = 0; py < map.length; py++) {
      const row = map[py];
      for (let px = 0; px < row.length; px++) {
        const color = palette[row[px]];
        if (!color) continue;
        c.fillStyle = color;
        c.fillRect(Math.round(x + px * scale), Math.round(y + py * scale), scale, scale);
      }
    }
  }
  function sprites() {
    return {
      gamer: { '#': colors.accent, h: colors.ink2, H: colors.accent, f: colors.ink, e: colors.paper },
      robot: { '#': colors.signal, e: colors.ink, l: colors.ink },
    };
  }
  const gamerMap = (look: Look) => (look === 'girl' ? GAMER_GIRL : GAMER_BOY);

  function drawEnt(e: Ent) {
    const left = e.x - 8;
    const pal = sprites();
    if (e.dead > 0) {
      if (e.deathKind === 'burst') {
        if (reduced) return;
        const p = 1 - e.dead / 0.3;
        const r = 4 + p * 10;
        c.fillStyle = colors.signal;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          c.fillRect(Math.round(e.x + Math.cos(a) * r) - 1, Math.round(e.y + SPR_H / 2 + Math.sin(a) * r) - 1, 2, 2);
        }
      } else {
        c.globalAlpha = Math.max(0, e.dead / 0.5);
        blit(gamerMap(e.look), left, e.y, SCALE, pal.gamer);
        c.globalAlpha = 1;
        text('!', e.x - 2, e.y - 10, colors.signal);
      }
      return;
    }
    const asBot = e.kind === 'bot' && !e.disguised;
    if (asBot) blit(ROBOT, left, e.y, SCALE, pal.robot);
    else blit(gamerMap(e.look), left, e.y, SCALE, pal.gamer);
    if (e.ring > 0) {
      const rh = SPR_H + 4;
      c.fillStyle = colors.ink;
      c.fillRect(Math.round(left) - 2, Math.round(e.y) - 2, 20, 1);
      c.fillRect(Math.round(left) - 2, Math.round(e.y) + rh - 3, 20, 1);
      c.fillRect(Math.round(left) - 2, Math.round(e.y) - 2, 1, rh);
      c.fillRect(Math.round(left) + 17, Math.round(e.y) - 2, 1, rh);
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

    blit(SHIP, ship - 8, SHIP_Y, 1, { '#': colors.accent });
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

    c.font = pixelFont;
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

    // Overlay card for title, win, lose and surrender.
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
      center('INSERT COIN', 104, colors.accent);
    } else if (state === 'won') {
      center('ACCESS RESTORED', 50, colors.accent);
      center(`AUTH SUCCESS ${auth()}%`, 68);
      center(`${stats.blocked} BOTS BLOCKED`, 78);
      center(`${stats.fp} PLAYERS HIT`, 88, colors.ink2);
      center('WELCOME BACK', 104, colors.accent);
    } else if (state === 'surrendered') {
      center('WHITE FLAG RAISED', 50, colors.signal);
      center('THE BOTS ARE IN', 66);
      center('AUTH SUCCESS 0.0%', 80, colors.ink2);
      center('ACCESS GRANTED TO EVERYONE', 100, colors.accent);
    } else {
      if (loseReason === 'fp') {
        center('3 PLAYERS BLOCKED', 54, colors.signal);
        center('REAL PLAYERS GOT CAPTCHAS', 70);
      } else {
        center('3 ACCOUNT TAKEOVERS', 54, colors.signal);
        center('THE BOTS GOT IN', 70);
      }
      center(`AUTH SUCCESS ${auth()}%`, 80, colors.ink2);
      center('INSERT COIN TO RETRY', 100, colors.accent);
    }
  }

  // Keyboard: move and fire only while playing and in view. Starting is the coin's job.
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
    }
  });
  window.addEventListener('keyup', (e) => {
    const dir = MOVE_KEYS[e.code];
    if (dir !== undefined) heldKeys.delete(dir);
  });
  window.addEventListener('blur', releaseAll);

  const logicalX = (clientX: number) => {
    const r = canvas.getBoundingClientRect();
    return r.width === 0 ? null : ((clientX - r.left) / r.width) * W;
  };

  // Mouse: the ship follows the cursor across the screen; click fires.
  // Touch and pen: the ship slides to where the finger lands and fires on arrival; dragging steers.
  // The canvas only captures touches while playing (see touch-action in ArcadeGate.astro).
  canvas.addEventListener('pointerdown', (e) => {
    if (state !== 'playing') return;
    if (e.pointerType === 'mouse') return void fire();
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    tapX = logicalX(e.clientX);
    fireOnArrive = tapX !== null;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (state !== 'playing') return;
    if (e.pointerType === 'mouse') pointerX = logicalX(e.clientX);
    else if (tapX !== null) tapX = logicalX(e.clientX);
  });
  const lift = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') tapX = null;
  };
  canvas.addEventListener('pointerup', lift);
  canvas.addEventListener('pointercancel', lift);
  canvas.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') pointerX = null;
  });

  // Joystick: press anywhere on the base and slide; the knob follows the thumb and the ship moves at
  // a speed proportional to how far it is pushed. Releasing re-centres it.
  const stickEl = root.querySelector<HTMLElement>('[data-stick]');
  function setStick(v: number) {
    stick = Math.abs(v) < STICK_DEAD ? 0 : v;
    stickEl?.style.setProperty('--kx', String(v));
  }
  if (stickEl) {
    let held: number | null = null;
    const aim = (e: PointerEvent) => {
      const r = stickEl.getBoundingClientRect();
      if (r.width === 0) return;
      setStick(Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))));
    };
    stickEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      held = e.pointerId;
      stickEl.setPointerCapture(e.pointerId);
      stickEl.classList.add('is-held');
      aim(e);
    });
    stickEl.addEventListener('pointermove', (e) => {
      if (e.pointerId === held) aim(e);
    });
    const letGo = (e: PointerEvent) => {
      if (e.pointerId !== held) return;
      held = null;
      stickEl.classList.remove('is-held');
      setStick(0);
    };
    stickEl.addEventListener('pointerup', letGo);
    stickEl.addEventListener('pointercancel', letGo);
  }
  root.querySelector('[data-fire]')?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    fire();
  });
  document.addEventListener('visibilitychange', () => {
    releaseAll();
    if (!document.hidden && state === 'playing') {
      last = 0;
      loop();
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        inView = entries.some((en) => en.isIntersecting);
        if (!inView) releaseAll();
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
          .map((e) => ({
            x: e.x,
            y: e.y,
            kind: e.kind,
            look: e.look,
            revealed: e.kind === 'human' || !e.disguised,
            canSplit: e.canSplit,
          })),
      }),
    };
  }

  root.dataset.state = state;
  draw();
  if (document.fonts?.load) document.fonts.load(pixelFont).then(draw, draw);

  return {
    reset,
    start,
    surrender,
    focus: () => canvas.focus(),
  };
}
