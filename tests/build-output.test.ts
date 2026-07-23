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

  it('shows a card for every case study, each with its tag set', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    // One representative tag per case, taken from the Figma source of truth.
    for (const tag of [
      'Microsoft Clarity', // vpn-premium
      'Browser extensions', // vpn-typography
      'Amplitude', // freelancehunt
      'Data-heavy', // resonance
      'Solo project', // leaf
    ]) {
      expect(html).toContain(tag);
    }
  });

  it('links to both Experiments and Writing', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).toContain('href="/experiments"');
    expect(html).toContain('href="/writing"');
  });

  it('renders the Experiments and Writing sections inline', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).toContain('id="experiments"');
    expect(html).toContain('id="writing"');
    expect(html).toContain('Claude Code');
  });
});

describe('experiments page', () => {
  it('builds and lists every experiment category', () => {
    const html = readFileSync('dist/experiments/index.html', 'utf-8');
    for (const title of ['3D', 'Figma AI', 'Claude Code', 'UI Practice']) {
      expect(html).toContain(title);
    }
  });
});

describe('experiment detail pages', () => {
  const slugs = ['3d', 'figma-ai', 'ui-practice', 'claude-code'];

  it('builds a page for every experiment', () => {
    for (const slug of slugs) {
      const html = readFileSync(`dist/experiments/${slug}/index.html`, 'utf-8');
      expect(html.length).toBeGreaterThan(0);
    }
  });

  it('the listing links to each detail page', () => {
    const html = readFileSync('dist/experiments/index.html', 'utf-8');
    for (const slug of slugs) {
      expect(html).toContain(`href="/experiments/${slug}/"`);
    }
  });

  it('the Figma AI page lists the tool write-ups and links them out', () => {
    const html = readFileSync('dist/experiments/figma-ai/index.html', 'utf-8');
    expect(html).toContain('Figma Make');
    expect(html).toContain('linkedin.com');
  });

  it('the 3D page carries its real scale figure', () => {
    const html = readFileSync('dist/experiments/3d/index.html', 'utf-8');
    expect(html).toContain('130+ original assets');
    expect(html).toContain('Cinema 4D');
  });

  it('pages without finished content are marked work in progress', () => {
    for (const slug of ['ui-practice', 'claude-code']) {
      const html = readFileSync(`dist/experiments/${slug}/index.html`, 'utf-8');
      expect(html).toContain('Work in progress');
    }
  });

  it('never mentions impressions, reach, or view counts', () => {
    for (const slug of slugs) {
      const html = readFileSync(`dist/experiments/${slug}/index.html`, 'utf-8');
      expect(html).not.toMatch(/impressions|reach(?:ed)?|[\d.,]+\s*[kKmM]?\+?\s*views?\b/i);
    }
  });
});

describe('writing page', () => {
  it('builds and lists the Figma Make post', () => {
    const html = readFileSync('dist/writing/index.html', 'utf-8');
    expect(html).toContain('Figma Make');
  });

  it('links out to LinkedIn for every post card', () => {
    const html = readFileSync('dist/writing/index.html', 'utf-8');
    expect(html).toContain('linkedin.com');
  });

  it('never mentions impressions, reach, or view counts', () => {
    const html = readFileSync('dist/writing/index.html', 'utf-8');
    expect(html).not.toMatch(/impressions|reach(?:ed)?|[\d.,]+\s*[kKmM]?\+?\s*views?\b/i);
  });
});
