import { formatDisplayPrice } from "./formatDisplayPrice";

type DrinkType = {
  price: number;
};

export function calculateDrinksPrice(drinks: DrinkType[]) {
  const price = drinks.reduce((total, { price }) => total + price, 0);
  return formatDisplayPrice(price);
}
