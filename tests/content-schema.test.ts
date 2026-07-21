import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';

const CASE_DIR = 'src/content/case-studies';
const EXPECTED_ORDER = [
  'vpn-premium.md',
  'vpn-typography.md',
  'freelancehunt.md',
  'resonance.md',
  'leaf.md',
];

describe('case study content', () => {
  it('has exactly the 5 expected case studies, no more, no less', () => {
    const files = readdirSync(CASE_DIR).sort();
    expect(files.sort()).toEqual(EXPECTED_ORDER.slice().sort());
  });

  it('every case study has the required frontmatter fields', () => {
    for (const file of EXPECTED_ORDER) {
      const { data } = matter(readFileSync(`${CASE_DIR}/${file}`, 'utf-8'));
      expect(data.title, `${file}: title`).toBeTruthy();
      expect(data.tag, `${file}: tag`).toBeTruthy();
      expect(data.statValue, `${file}: statValue`).toBeTruthy();
      expect(data.statCaption, `${file}: statCaption`).toBeTruthy();
      expect(Array.isArray(data.impactList), `${file}: impactList`).toBe(true);
    }
  });

  it('the VPN premium conversion stat is exactly the verified figure', () => {
    const { data } = matter(readFileSync(`${CASE_DIR}/vpn-premium.md`, 'utf-8'));
    expect(data.statValue).toBe('+21%');
    expect(data.statCaption).toContain('0.28% → 0.34%');
    expect(data.statCaption).toContain('first 2 weeks');
  });

  it('both VPN case studies have the NDA badge enabled', () => {
    const premium = matter(readFileSync(`${CASE_DIR}/vpn-premium.md`, 'utf-8'));
    const typography = matter(readFileSync(`${CASE_DIR}/vpn-typography.md`, 'utf-8'));
    expect(premium.data.ndaBadge).toBe(true);
    expect(typography.data.ndaBadge).toBe(true);
  });
});

describe('writing section content', () => {
  const POSTS_DIR = 'src/content/posts';
  const bannedPattern = /impressions|reach(?:ed)?|[\d.,]+\s*[kKmM]?\+?\s*views?\b/i;

  it('has at least 5 posts', () => {
    const files = readdirSync(POSTS_DIR);
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  it('never mentions impressions, reach, or view counts in any post', () => {
    const files = readdirSync(POSTS_DIR);
    for (const file of files) {
      const raw = readFileSync(`${POSTS_DIR}/${file}`, 'utf-8');
      expect(raw, `${file} should not mention reach/impressions/views`).not.toMatch(bannedPattern);
    }
  });

  it('every post links out to LinkedIn rather than hosting the full text', () => {
    const files = readdirSync(POSTS_DIR);
    for (const file of files) {
      const { data } = matter(readFileSync(`${POSTS_DIR}/${file}`, 'utf-8'));
      expect(data.linkedinUrl, `${file}: linkedinUrl`).toMatch(/^https:\/\/www\.linkedin\.com\//);
    }
  });
});
