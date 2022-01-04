import moment from "moment";

import "moment/locale/pt-br";

export function formatDatabaseDate(dateStr: string) {
  return moment(dateStr).format("DD/MM/yyyy");
}

export function getBirthDayDate(dateStr: string, monthMinus = false) {
  const [year, month, day] = dateStr.split("-").slice(0, 3).map(Number);

  return new Date(year, monthMinus ? month - 1 : month, day);
}

export function formatBirthDayDate(dateStr: string) {
  return moment(dateStr).format("DD/MM/yyyy");
}

export function formatToDatabaseDate(date: Date) {
  return moment(date).format("yyyy-MM-DD");
}

export function formatDisplayDate(date: string) {
  return moment(date).locale("pt-br").format("DD [de] MMMM, yyyy [as] HH:mm");
}
