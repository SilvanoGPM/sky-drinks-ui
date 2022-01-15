import moment from "moment";

import "moment/locale/pt-br";

/**
 * Formata data com o padrão DD/MM/YYYY.
 * @param {string} date Data a ser formatada.
 */
export function formatDatabaseDate(date: string = new Date().toString()): string {
  return moment(date || new Date().toString()).format("DD/MM/YYYY");
}

/**
 * Formata data com o padrão YYYY-MM-DD.
 * @param {Date} date Data a ser formatada.
 */
export function formatToDatabaseDate(date: Date = new Date()): string {
  return moment(date || new Date()).format("YYYY-MM-DD");
}

/**
 * Formata data com o padrão DD [de] MMMM, YYYY [as] HH:mm.
 * @param {string} date Data a ser formatada.
 */
export function formatDisplayDate(date: string = new Date().toString()): string {
  return moment(date || new Date().toString()).locale("pt-br").format("DD [de] MMMM, YYYY [as] HH:mm");
}
