import { RequestGrouped, RequestType } from "src/types/requests";

/**
 * Agrupa as bebidas de um determinado pedido.
 * @param {RequestType} request Pedidos com as bebidas para agrupar.
 */
export function getDrinksGroupedByUUID(request: RequestType): RequestGrouped {
  return request.drinks.reduce((obj: RequestGrouped, drink) => {
    if (!obj[drink.uuid]) {
      obj[drink.uuid] = [drink];
    } else {
      obj[drink.uuid] = [...obj[drink.uuid], drink];
    }

    return obj;
  }, {});
}
