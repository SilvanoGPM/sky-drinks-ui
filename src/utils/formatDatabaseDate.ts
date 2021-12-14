function ofPattern(pattern: string, date: Date) {
  return pattern
    .replace('y', `${date.getFullYear()}`)
    .replace('m', `${date.getMonth()}`)
    .replace('d', `${date.getDate()}`);
}

export function formatDatabaseDate(dateStr: string) {
  const date = new Date(dateStr);
  return ofPattern('d/m/y', date);
}
