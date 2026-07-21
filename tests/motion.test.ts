import { describe, it, expect } from 'vitest';
import { prefersReducedMotion } from '../src/lib/motion';

describe('prefersReducedMotion', () => {
  it('returns true when the media query matches', () => {
    expect(prefersReducedMotion({ matches: true })).toBe(true);
  });

  it('returns false when the media query does not match', () => {
    expect(prefersReducedMotion({ matches: false })).toBe(false);
  });
});
