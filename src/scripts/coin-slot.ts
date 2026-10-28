/**
 * The insert-coin gate for the arcade cabinet. The coin (`[data-coin]`, a button) has to be dragged
 * into the slot (`[data-slot]`) with a pointer, mouse or finger alike; a bare click never counts.
 * Enter or Space on the focused coin inserts it directly, since keyboard users cannot drag.
 */
export function mountCoinSlot(root: HTMLElement, onInsert: () => void): void {
  const coin = root.querySelector<HTMLButtonElement>('[data-coin]');
  const slot = root.querySelector<HTMLElement>('[data-slot]');
  if (!coin || !slot) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pointer: number | null = null;
  let startX = 0;
  let startY = 0;
  let over = false;
  let inserting = false;

  const overSlot = () => {
    const c = coin.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height / 2;
    return cx >= s.left && cx <= s.right && cy >= s.top && cy <= s.bottom;
  };

  // The drag offset lives in custom properties so the drop animation can compose with it.
  const park = () => {
    coin.style.removeProperty('--dx');
    coin.style.removeProperty('--dy');
  };

  const settle = () => {
    coin.classList.remove('is-inserted');
    park();
    inserting = false;
  };

  const insert = () => {
    if (inserting) return;
    inserting = true;
    slot.classList.remove('is-over');
    if (reduced) {
      onInsert();
      settle();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      coin.removeEventListener('transitionend', finish);
      onInsert();
      settle();
    };
    coin.addEventListener('transitionend', finish);
    window.setTimeout(finish, 350);
    coin.classList.add('is-inserted');
  };

  coin.addEventListener('pointerdown', (e) => {
    if (inserting || pointer !== null) return;
    e.preventDefault();
    pointer = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    coin.setPointerCapture(e.pointerId);
    coin.classList.add('is-dragging');
  });

  coin.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointer) return;
    coin.style.setProperty('--dx', `${e.clientX - startX}px`);
    coin.style.setProperty('--dy', `${e.clientY - startY}px`);
    const now = overSlot();
    if (now !== over) {
      over = now;
      slot.classList.toggle('is-over', over);
    }
  });

  const release = (e: PointerEvent) => {
    if (e.pointerId !== pointer) return;
    pointer = null;
    coin.classList.remove('is-dragging');
    if (e.type === 'pointerup' && overSlot()) {
      insert();
    } else {
      over = false;
      slot.classList.remove('is-over');
      park();
    }
  };
  coin.addEventListener('pointerup', release);
  coin.addEventListener('pointercancel', release);

  // A click (mouse, tap, or keyboard) is not a drag. Only the keys insert.
  coin.addEventListener('click', (e) => e.preventDefault());
  coin.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      insert();
    }
  });
}
