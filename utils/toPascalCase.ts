export function toPascalCase(name: string |null): string {
  if (!name) {
    return '-';
  }
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}