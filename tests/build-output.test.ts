import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('unlisted access config', () => {
  it('ships a robots.txt that disallows all crawlers', () => {
    const contents = readFileSync('dist/robots.txt', 'utf-8');
    expect(contents).toContain('Disallow: /');
  });

  it('every built page has a noindex meta tag', () => {
    const indexHtml = readFileSync('dist/index.html', 'utf-8');
    expect(indexHtml).toContain('name="robots" content="noindex, nofollow"');
  });
});

describe('case study pages', () => {
  const slugs = ['vpn-premium', 'vpn-typography', 'freelancehunt', 'resonance', 'leaf'];

  it('builds a page for every case study slug', () => {
    for (const slug of slugs) {
      const html = readFileSync(`dist/case/${slug}/index.html`, 'utf-8');
      expect(html.length).toBeGreaterThan(0);
    }
  });

  it('the VPN premium page shows the verified conversion stat', () => {
    const html = readFileSync('dist/case/vpn-premium/index.html', 'utf-8');
    expect(html).toContain('+21%');
    expect(html).toContain('0.28% → 0.34%');
  });

  it('both VPN pages show the NDA disclosure', () => {
    const premium = readFileSync('dist/case/vpn-premium/index.html', 'utf-8');
    const typography = readFileSync('dist/case/vpn-typography/index.html', 'utf-8');
    expect(premium).toContain('Interfaces reproduced for portfolio via NDA');
    expect(typography).toContain('Interfaces reproduced for portfolio via NDA');
  });

  it('non-VPN pages do not show the NDA disclosure', () => {
    const resonance = readFileSync('dist/case/resonance/index.html', 'utf-8');
    expect(resonance).not.toContain('Interfaces reproduced for portfolio via NDA');
  });
});

describe('home page', () => {
  it('does not contain the old generic hero copy', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).not.toContain('crafting innovative product designs');
  });

  it('lists all 5 case study tags', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    for (const tag of [
      'Consumer / Growth',
      'Accessibility / Infrastructure',
      'Marketplace',
      'Enterprise / Data-heavy',
      'Consumer Mobile / 0→1',
    ]) {
      expect(html).toContain(tag);
    }
  });

  it('links to both Experiments and Writing from the preview strip', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).toContain('href="/experiments"');
    expect(html).toContain('href="/writing"');
  });
});

describe('experiments page', () => {
  it('builds and lists at least the LEAF illustrations entry', () => {
    const html = readFileSync('dist/experiments/index.html', 'utf-8');
    expect(html).toContain('LEAF — 3D Illustrations');
  });
});
