import qs from "query-string";

import { api, toFullPictureURI } from "./api";
import filesEndpoints from "./files";

type DrinkToCreate = {
  volume: number;
  name: string;
  picture?: File | string;
  description: string;
  price: number;
  additional: string;
  alcoholic: boolean;
};

type DrinkToUpdate = {
  uuid: string;
  volume: number;
  name: string;
  picture?: File | string;
  description: string;
  price: number;
  additional: string;
  alcoholic: boolean;
};

type DrinkSearchParams = {
  name?: string;
  description?: string;
  additional?: string;
  alcoholic?: string;
  greaterThanOrEqualToPrice?: number;
  lessThanOrEqualToPrice?: number;
  greaterThanOrEqualToVolume?: number;
  lessThanOrEqualToVolume?: number;
  page?: number;
  size?: number;
};

const drinksEndpoints = {
  async createDrink(drink: DrinkToCreate) {
    const { picture } = drink;

    if (picture && picture instanceof File) {
      const image = await filesEndpoints.uploadImage(picture);
      drink.picture = image.data.fileName;
    }

    const response = await api.post("/drinks/barmen", drink);
    return response.data;
  },

  async searchDrink(params: DrinkSearchParams) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(`/drinks/search?${searchParams}`);

    return {
      totalElements: data.totalElements,
      content: data.content.map(toFullPictureURI),
    };
  },

  async findDrinkByUUID(uuid: string) {
    const { data } = await api.get(`/drinks/${uuid}`);

    return toFullPictureURI(data);
  },

  async getLatestDrinks(size: number = 5) {
    const { data } = await api.get(
      `/drinks?size=${size}&page=0&sort=createdAt,desc`
    );

    return data.content.map(toFullPictureURI);
  },

  async replaceDrink(drink: DrinkToUpdate) {
    const { picture } = drink;

    if (picture && picture instanceof File) {
      const image = await filesEndpoints.uploadImage(picture);
      drink.picture = image.data.fileName;
    }

    await api.put("/drinks/barmen", drink);
  },

  async deleteDrink(uuid: string) {
    await api.delete(`/drinks/barmen/${uuid}`);
  },
};

export default drinksEndpoints;
