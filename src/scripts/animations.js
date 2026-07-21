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

export function initAnimations() {
  if (reducedMotionRequested()) {
    return;
  }
  revealSections();
  animateStatCounters();
  initBeforeAfterSliders();
}
