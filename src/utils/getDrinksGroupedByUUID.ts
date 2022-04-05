/**
 * Agrupa as bebidas de um determinado pedido.
 * @param {RequestType} request Pedidos com as bebidas para agrupar.
 */
export function getDrinksGroupedByUUID(request: {
  drinks: DrinkType[];
}): RequestGrouped {
  return request.drinks.reduce((obj: RequestGrouped, drink: DrinkType) => {
    if (!obj[drink.uuid]) {
      return { ...obj, [drink.uuid]: [drink] };
    }

    return { ...obj, [drink.uuid]: [...obj[drink.uuid], drink] };
  }, {});
}
