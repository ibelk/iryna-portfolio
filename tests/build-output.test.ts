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
