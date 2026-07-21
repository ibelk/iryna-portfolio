import { describe, it, expect } from 'vitest';
import { parseStatValue } from '../src/lib/stats';

describe('parseStatValue', () => {
  it('parses a signed percentage into an animatable numeric target', () => {
    expect(parseStatValue('+21%')).toEqual({
      isNumeric: true,
      numericTarget: 21,
      prefix: '+',
      suffix: '%',
    });
  });

  it('parses a plain percentage with no sign', () => {
    expect(parseStatValue('63%')).toEqual({
      isNumeric: true,
      numericTarget: 63,
      prefix: '',
      suffix: '%',
    });
  });

  it('treats non-numeric stats as static, not animatable', () => {
    expect(parseStatValue('Weekly → Monthly')).toEqual({
      isNumeric: false,
      numericTarget: null,
      prefix: '',
      suffix: '',
    });
    expect(parseStatValue('4+ years')).toEqual({
      isNumeric: false,
      numericTarget: null,
      prefix: '',
      suffix: '',
    });
  });
});
