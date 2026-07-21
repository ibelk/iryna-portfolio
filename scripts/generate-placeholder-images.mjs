// scripts/generate-placeholder-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const targets = [
  ['public/images/case-vpn-premium/hero.svg', 'VPN Premium'],
  ['public/images/case-vpn-typography/hero.svg', 'VPN Typography'],
  ['public/images/case-freelancehunt/hero.svg', 'Freelancehunt'],
  ['public/images/case-resonance/hero.svg', 'Resonance'],
  ['public/images/case-leaf/hero.svg', 'LEAF'],
  ['public/images/experiments/leaf-illustrations.svg', 'LEAF 3D Illustrations'],
  ['public/images/experiments/experiment-2.svg', 'Experiment 2'],
  ['public/images/experiments/experiment-3.svg', 'Experiment 3'],
];

function svgFor(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <rect width="100%" height="100%" fill="#1f1f24"/>
  <text x="50%" y="50%" fill="#9a9aa2" font-family="sans-serif" font-size="32" text-anchor="middle" dominant-baseline="middle">${label} (placeholder)</text>
</svg>`;
}

for (const [path, label] of targets) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svgFor(label));
}

console.log(`Generated ${targets.length} placeholder images.`);
