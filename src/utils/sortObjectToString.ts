/**
 * Transforma um objeto de organização em uma string.
 * @param {SortType} sort Objecto de organização
 */
export function sortObjectToString(sort?: SortType): string {
  return sort ? `${sort.order},${sort.sort}` : '';
}
