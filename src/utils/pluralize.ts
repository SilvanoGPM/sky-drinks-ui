/**
 * Caso n seja igual a 1, retorna a palavra no singular, caso contrário, retorna a palavra no plural.
 * @param {number} n Unidade para verificar se deve ser usado o singular ou plural.
 * @param {string} singular Palavra no singular.
 * @param {string} plural Palavra no plural.
 */
export function pluralize(n: number, singular: string, plural: string): string {
  return n === 1 ? singular : plural;
}
