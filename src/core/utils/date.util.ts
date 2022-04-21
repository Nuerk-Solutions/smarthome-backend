export function convertToMonth(date: Date): string {
  return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
}