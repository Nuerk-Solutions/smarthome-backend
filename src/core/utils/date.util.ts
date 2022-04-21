export function convertToMonth(date: Date): string {
  return date.toLocaleString('de-DE', { month: 'short', year: '2-digit' });
}