import { DrinkType } from "src/types/drinks";
import { formatDisplayPrice } from "./formatDisplayPrice";

export function calculateDrinksPrice(drinks: DrinkType[]) {
  const price = drinks.reduce((total, { price }) => total + price, 0);
  return formatDisplayPrice(price);
}
