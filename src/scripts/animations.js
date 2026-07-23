import gsap from 'gsap';
import { initBeforeAfterSliders } from './before-after-slider.js';

function reducedMotionRequested() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealSections() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.from(entry.target, { opacity: 0, y: 24, duration: 0.6 });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}

function animateStatCounters() {
  const targets = document.querySelectorAll('[data-animatable="true"]');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target);
        const prefix = el.dataset.prefix ?? '';
        const suffix = el.dataset.suffix ?? '';
        const valueEl = el.querySelector('.stat-callout__value');

        obs.unobserve(el);

        if (!valueEl || Number.isNaN(target)) return;

        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.2,
          onUpdate: () => {
            valueEl.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
          },
        });
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}

/**
 * Desktop card stack: as the next card rides up over the one below, the lower
 * card fades and shrinks a little.
 *
 * Progress is measured from live rects on every frame rather than from offsets
 * cached at setup. That is deliberate: lazily-loaded images shift this page's
 * layout after load, and anything holding pre-computed scroll positions goes
 * stale and silently stops firing.
 */
function initCardStack() {
  const items = Array.from(document.querySelectorAll('.work__item'));
  if (items.length < 2) return;

  const desktop = window.matchMedia('(min-width: 1024px)');
  let queued = false;

  const scaleMin = 0.94; // keep in sync with --stack-scale-min
  const fadeMin = 0.55; // keep in sync with --stack-fade-min

  // The card the transform applies to is the sticky wrapper's only child.
  const cardOf = (el) => el.firstElementChild;

  const clear = () =>
    items.forEach((el) => {
      const card = cardOf(el);
      if (!card) return;
      card.style.removeProperty('transform');
      card.style.removeProperty('opacity');
    });

  const update = () => {
    queued = false;
    if (!desktop.matches) return;

    for (let i = 0; i < items.length; i += 1) {
      const card = cardOf(items[i]);
      if (!card) continue;

      // last card is never covered
      if (i === items.length - 1) {
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
        continue;
      }

      const el = items[i];
      const height = el.offsetHeight;
      if (!height) continue;
      const gapToNext = items[i + 1].getBoundingClientRect().top - el.getBoundingClientRect().top;
      // 0 while the next card is a full card away, 1 once it fully covers this one
      const covered = Math.min(1, Math.max(0, (height - gapToNext) / height));
      // Write finished values straight onto the card — no CSS var indirection.
      card.style.transform = `scale(${(1 - covered * (1 - scaleMin)).toFixed(4)})`;
      card.style.opacity = (1 - covered * (1 - fadeMin)).toFixed(4);
    }
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  desktop.addEventListener('change', () => {
    clear();
    schedule();
  });
  update(); // paint the initial state synchronously; scroll/resize schedule the rest
}

export function initAnimations() {
  if (reducedMotionRequested()) {
    return;
  }
  revealSections();
  animateStatCounters();
  initCardStack();
  initBeforeAfterSliders();
}
