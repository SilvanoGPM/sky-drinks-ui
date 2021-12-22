type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

type RequestType = {
  drinks: DrinkType[];
};

type RequestGrouped = { [key: string]: DrinkType[] };

export function getDrinksGroupedByUUID(request: RequestType) {
  return request.drinks.reduce((obj, drink) => {
    if (!obj[drink.uuid]) {
      obj[drink.uuid] = [drink];
    } else {
      obj[drink.uuid] = [...obj[drink.uuid], drink];
    }

    return obj;
  }, {} as RequestGrouped);
}
