function ofPattern(pattern: string, date: Date) {
  return pattern
    .replace('y', `${date.getFullYear().toString().padStart(2, '0')}`)
    .replace('m', `${date.getMonth().toString().padStart(2, '0')}`)
    .replace('d', `${date.getDate().toString().padStart(2, '0')}`);
}

export function formatDatabaseDate(dateStr: string) {
  const date = new Date(dateStr);
  return ofPattern('d/m/y', date);
}

export function formatToDatabaseDate(date: Date) {
  return ofPattern('y-m-d', date);
}
