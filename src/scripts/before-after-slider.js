export function initBeforeAfterSliders() {
  document.querySelectorAll('[data-before-after]').forEach((el) => {
    const handle = el.querySelector('[data-handle]');
    const afterLayer = el.querySelector('[data-after-layer]');
    if (!handle || !afterLayer) return;

    const setPosition = (clientX) => {
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      afterLayer.style.clipPath = `inset(0 ${100 - ratio * 100}% 0 0)`;
      handle.style.left = `${ratio * 100}%`;
    };

    let dragging = false;
    handle.addEventListener('pointerdown', () => (dragging = true));
    window.addEventListener('pointerup', () => (dragging = false));
    window.addEventListener('pointermove', (event) => {
      if (dragging) setPosition(event.clientX);
    });
    handle.addEventListener('touchstart', () => (dragging = true), { passive: true });
    window.addEventListener('touchend', () => (dragging = false));
    window.addEventListener(
      'touchmove',
      (event) => {
        if (dragging && event.touches[0]) setPosition(event.touches[0].clientX);
      },
      { passive: true },
    );
  });
}
