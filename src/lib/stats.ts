export interface ParsedStat {
  isNumeric: boolean;
  numericTarget: number | null;
  prefix: string;
  suffix: string;
}

export function parseStatValue(value: string): ParsedStat {
  const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(%?)$/);
  if (!match) {
    return { isNumeric: false, numericTarget: null, prefix: '', suffix: '' };
  }
  const [, sign, number, percent] = match;
  return {
    isNumeric: true,
    numericTarget: Number(number),
    prefix: sign,
    suffix: percent,
  };
}
