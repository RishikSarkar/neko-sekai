export function generateSequence(basePath: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${basePath}${i + 1}.png`);
}
