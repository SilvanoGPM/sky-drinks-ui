import qs from "query-string";

import { toFullPictureURI } from "src/utils/toFullPictureURI";
import { DrinkPaginatedType, DrinkSearchParams, DrinkToCreate, DrinkToUpdate, DrinkType } from "src/types/drinks";

import { api } from "./api";
import filesEndpoints from "./files";

const drinksEndpoints = {
  async createDrink(drink: DrinkToCreate): Promise<DrinkType> {
    const { picture } = drink;

    if (picture && picture instanceof File) {
      const image = await filesEndpoints.uploadImage(picture);
      drink.picture = image.data.fileName;
    }

    const { data } = await api.post<DrinkType>("/drinks/barmen", drink);
    return data;
  },

  async searchDrink(params: DrinkSearchParams): Promise<DrinkPaginatedType> {
    const searchParams = qs.stringify(params);

    const { data } = await api.get<DrinkPaginatedType>(`/drinks/search?${searchParams}`);

    return {
      totalElements: data.totalElements,
      content: data.content.map(toFullPictureURI),
    };
  },

  async findDrinkByUUID(uuid: string): Promise<DrinkType> {
    const { data } = await api.get<DrinkType>(`/drinks/${uuid}`);

    return toFullPictureURI(data);
  },

  async getLatestDrinks(size: number = 5): Promise<DrinkType[]> {
    const { data } = await api.get<DrinkPaginatedType>(
      `/drinks?size=${size}&page=0&sort=createdAt,desc`
    );

    return data.content.map(toFullPictureURI);
  },

  async replaceDrink(drink: DrinkToUpdate): Promise<void> {
    const { picture } = drink;

    if (picture && picture instanceof File) {
      const image = await filesEndpoints.uploadImage(picture);
      drink.picture = image.data.fileName;
    }

    await api.put("/drinks/barmen", drink);
  },

  async deleteDrink(uuid: string): Promise<void>  {
    await api.delete(`/drinks/barmen/${uuid}`);
  },
};

export default drinksEndpoints;
