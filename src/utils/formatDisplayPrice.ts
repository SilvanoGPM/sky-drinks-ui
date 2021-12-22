export function formatDisplayPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
}
