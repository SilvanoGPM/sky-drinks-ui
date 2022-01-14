import { DrinkType } from "src/types/drinks";

import { formatDisplayPrice } from "./formatDisplayPrice";
import { sum } from "./sum";

export function calculateDrinksPrice(drinks: DrinkType[]) {
  const price = sum(drinks, ({ price }) => price);
  return formatDisplayPrice(price);
}
