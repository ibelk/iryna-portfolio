// scripts/generate-placeholder-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const targets = [
  ['public/images/case-vpn-premium/hero.svg', 'VPN Premium'],
  ['public/images/case-vpn-typography/hero.svg', 'VPN Typography'],
  ['public/images/case-freelancehunt/hero.svg', 'Freelancehunt'],
  ['public/images/case-resonance/hero.svg', 'Resonance'],
  ['public/images/case-leaf/hero.svg', 'LEAF'],
  ['public/images/experiments/3d.svg', '3D'],
  ['public/images/experiments/figma-ai.svg', 'Figma AI'],
  ['public/images/experiments/claude-code.svg', 'Claude Code'],
  ['public/images/experiments/ui-practice.svg', 'UI Practice'],
  ['public/images/posts/figma-make.svg', 'Figma Make'],
  ['public/images/posts/figma-sites.svg', 'Figma Sites'],
  ['public/images/posts/figma-buzz.svg', 'Figma Buzz'],
  ['public/images/posts/figma-motion.svg', 'Figma Motion'],
  ['public/images/posts/figma-draw.svg', 'Figma Draw'],
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
