import axios from "axios";

type DrinkType = {
  uuid: string;
  volume: number;
  cratedAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
};

const baseURL = "http://localhost:8080/api/v1";

const fetch = axios.create({
  baseURL,
});

const api = {
  async getLatestDrinks(size: number = 5) {
    try {
      const response = await fetch.get(
        `/drinks?size=${size}&page=0&sort=createdAt,desc`
      );
      
      return response.data.content.map((drink: DrinkType) => ({
        ...drink,
        picture: `${baseURL}/files/images/${drink.picture}`,
      }));
    } catch (exception) {
      throw new Error('Aconteceu um erro no servidor.');
    }
  },
};

export default api;
