function ofPattern(pattern: string, date: Date) {
  return pattern
    .replace("y", `${date.getFullYear().toString().padStart(2, "0")}`)
    .replace("m", `${date.getMonth().toString().padStart(2, "0")}`)
    .replace("d", `${date.getDate().toString().padStart(2, "0")}`);
}

export function formatDatabaseDate(dateStr: string) {
  const date = new Date(dateStr);
  return ofPattern("d/m/y", date);
}

export function getBirthDayDate(dateStr: string, monthMinus = false) {
  const [year, month, day] = dateStr.split("-").slice(0, 3).map(Number);

  return new Date(year, monthMinus ? month - 1 : month, day);
}

export function formatBirthDayDate(dateStr: string) {
  return ofPattern("d/m/y", getBirthDayDate(dateStr));
}

export function formatToDatabaseDate(date: Date) {
  console.log(ofPattern("y-m-d", date));
  return ofPattern("y-m-d", date);
}
