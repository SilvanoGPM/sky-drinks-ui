import qs from 'query-string';

import { toFullDrinkImageURI } from 'src/utils/toFullPictureURI';

import { api } from './api';
import filesEndpoints from './files';

const drinksEndpoints = {
  async drinkUploadImage(
    drink: DrinkToCreate | DrinkToUpdate
  ): Promise<DrinkToCreate | DrinkToUpdate> {
    const { picture } = drink;

    if (picture && picture instanceof File) {
      const image = await filesEndpoints.uploadDrinkImage(picture);
      return { ...drink, picture: image.data.fileName };
    }

    return drink;
  },

  async createDrink(drinkToCreate: DrinkToCreate): Promise<DrinkType> {
    const drink = await this.drinkUploadImage(drinkToCreate);

    const { data } = await api.post<DrinkType>('/drinks/barmen', drink);
    return data;
  },

  async searchDrink(params: DrinkSearchParams): Promise<DrinkPaginatedType> {
    const searchParams = qs.stringify(params);

    const { data } = await api.get<DrinkPaginatedType>(
      `/drinks/search?${searchParams}`
    );

    return {
      totalElements: data.totalElements,
      content: data.content.map(toFullDrinkImageURI),
    };
  },

  async findDrinkByUUID(uuid: string): Promise<DrinkType> {
    const { data } = await api.get<DrinkType>(`/drinks/${uuid}`);

    return toFullDrinkImageURI(data);
  },

  async getLatestDrinks(size = 5): Promise<DrinkType[]> {
    const { data } = await api.get<DrinkPaginatedType>(
      `/drinks?size=${size}&page=0&sort=createdAt,desc`
    );

    return data.content.map(toFullDrinkImageURI);
  },

  async replaceDrink(drinkToUpdate: DrinkToUpdate): Promise<void> {
    const drink = await this.drinkUploadImage(drinkToUpdate);

    await api.put('/drinks/barmen', drink);
  },

  async deleteDrink(uuid: string): Promise<void> {
    await api.delete(`/drinks/barmen/${uuid}`);
  },
};

export default drinksEndpoints;
