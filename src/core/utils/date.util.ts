export function convertToMonth(date: Date | string): string {
  return new Date(date).toLocaleString('de-DE', { month: 'long' });
}