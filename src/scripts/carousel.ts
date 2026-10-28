/**
 * Scroll-snap carousel controls shared by the photo and post carousels.
 * Markup: [data-carousel] > [data-track] (the scroller) + [data-prev] / [data-next] buttons.
 */
export function initCarousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;

  const step = (dir: number) => {
    const slide = track.querySelector<HTMLElement>(':scope > :not([hidden])');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: dir * (slide ? slide.offsetWidth + gap : track.clientWidth), behavior: 'smooth' });
  };
  const sync = () => {
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      step(e.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
}
