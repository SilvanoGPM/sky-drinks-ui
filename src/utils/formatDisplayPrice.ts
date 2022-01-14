/**
 * Formata o preço para o estilo brasileiro.
 * @param {number} price Preço a ser formatado.
 * @example
 *  formatDisplayPrice(10.5) // return "R$ 10,50"
 */
export function formatDisplayPrice(price: number): string {
  const formattedPrice = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  return `R$ ${formattedPrice}`;
}
