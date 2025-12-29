export function splitOnLastDash(str: string): [string, string] {
  const lastIndex = str.lastIndexOf("-");
  const before = str.slice(0, lastIndex);
  const after = str.slice(lastIndex + 1);
  return [before, after];
}
