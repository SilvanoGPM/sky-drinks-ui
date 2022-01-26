import { formatDisplayPrice } from './formatDisplayPrice';
import { sum } from './sum';

/**
 * Calcula o preço total de uma lista de bebidas.
 * @param {DrinkType[]} drinks bebidas para calcular o preço
 */
export function calculateDrinksPrice(drinks: DrinkType[]): string {
  const totalPrice = sum(drinks, ({ price }) => price);
  return formatDisplayPrice(totalPrice);
}
