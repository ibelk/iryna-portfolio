import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initBeforeAfterSliders } from './before-after-slider.js';

gsap.registerPlugin(ScrollTrigger);

function reducedMotionRequested() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealSections() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });
}

function animateStatCounters() {
  document.querySelectorAll('[data-animatable="true"]').forEach((el) => {
    const target = Number(el.dataset.target);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const valueEl = el.querySelector('.stat-callout__value');
    if (!valueEl || Number.isNaN(target)) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.2,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      onUpdate: () => {
        valueEl.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
    });
  });
}

export function initAnimations() {
  if (reducedMotionRequested()) {
    return;
  }
  revealSections();
  animateStatCounters();
  initBeforeAfterSliders();
}
