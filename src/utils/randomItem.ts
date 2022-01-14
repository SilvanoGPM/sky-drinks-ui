/**
 * Retorna um elemento aleatório de uma determinada lista.
 * @param {T[]} arr Lista com os elementos.
 */
export function randomItem<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * (arr.length - 1));
  return arr[randomIndex];
}
