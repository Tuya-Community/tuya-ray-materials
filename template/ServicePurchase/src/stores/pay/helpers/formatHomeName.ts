/** Sanitize home name by removing path-traversal patterns */
export function formatHomeName(input: string): string {
  const patterns = [/\.\./g, /\.\\\./g, /\\\.\\/g, /\."\."/g];
  return patterns.reduce((acc, pattern) => acc.replace(pattern, ""), input);
}
