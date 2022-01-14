/**
 * Soma uma determinada lista.
 * @param {T[]} arr Lista que será somada.
 * @param {(x:T)=>number=(x:T} mapper Função para transformar a lista em uma lista de números.
 */
export function sum<T>(arr: T[], mapper: (x: T) => number = (x: T) => Number(x)): number {
  return arr.map(mapper).reduce((total, n) => total + n, 0);
}
