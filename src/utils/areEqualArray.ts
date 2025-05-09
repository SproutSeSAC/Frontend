export function areArraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return [...a].sort().every((item, index) => item === [...b].sort()[index]);
}
