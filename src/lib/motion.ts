export function prefersReducedMotion(mediaQueryList: { matches: boolean }): boolean {
  return mediaQueryList.matches;
}
