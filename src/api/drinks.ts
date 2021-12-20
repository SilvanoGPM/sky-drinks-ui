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

const drinksEndpoints = {
  async createDrink(drink: DrinkToCreate) {
    try {
      const { picture } = drink;

      if (picture && picture instanceof File) {
        const image = await filesEndpoints.uploadImage(picture);
        drink.picture = image.data.fileName;
      }

      const response = await api.post("/drinks/barmen", drink);
      return response.data;
    } catch (e: any) {
      throw e;
    }
  },

  async searchDrink(params: string, size = 6) {
    try {
      const { data } = await api.get(`/drinks/search?size=${size}&${params}`);

      return {
        totalElements: data.totalElements,
        content: data.content.map(toFullPictureURI),
      };
    } catch (exception: any) {
      throw new Error("Aconteceu um erro ao tentar conectar no servidor.");
    }
  },


  async findDrinkByUUID(uuid?: string) {
    if (!uuid) {
      throw new Error("Passe um UUID para a pesquisa!");
    }

    try {
      const response = await api.get(`/drinks/${uuid}`);

      return toFullPictureURI(response.data);
    } catch (exception: any) {
      const details =
        exception?.response?.data?.details ||
        "Aconteceu um erro ao tentar conectar no servidor.";
      throw new Error(details);
    }
  },

  async getLatestDrinks(size: number = 5) {
    try {
      const response = await api.get(
        `/drinks?size=${size}&page=0&sort=createdAt,desc`
      );

      return response.data.content.map(toFullPictureURI);
    } catch (exception) {
      throw new Error("Aconteceu um erro ao tentar conectar no servidor.");
    }
  },

  async replaceDrink(drink: DrinkToUpdate) {
    try {
      const { picture } = drink;

      if (picture && picture instanceof File) {
        const image = await filesEndpoints.uploadImage(picture);
        drink.picture = image.data.fileName;
      }

      await api.put("/drinks/barmen", drink);
    } catch (e: any) {
      throw e;
    }
  },

  async deleteDrink(uuid: string) {
    try {
      await api.delete(`/drinks/barmen/${uuid}`);
    } catch (e: any) {
      throw e;
    }
  },

};

export default drinksEndpoints;
