import { RequestGrouped, RequestType } from "src/types/requests";

export function getDrinksGroupedByUUID(request: RequestType) {
  return request.drinks.reduce((obj: RequestGrouped, drink) => {
    if (!obj[drink.uuid]) {
      obj[drink.uuid] = [drink];
    } else {
      obj[drink.uuid] = [...obj[drink.uuid], drink];
    }

    return obj;
  }, {});
}
