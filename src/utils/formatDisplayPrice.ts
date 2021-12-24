export function formatDisplayPrice(price: number) {
  const formattedPrice = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  return `R$ ${formattedPrice}`;
}
