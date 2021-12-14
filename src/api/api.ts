import axios from "axios";

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

const baseURL = "http://localhost:8080/api/v1";

const fetch = axios.create({
  baseURL,
});

function toFullPictureURI(drink: DrinkType) {
  return ({
    ...drink,
    picture: `${baseURL}/files/images/${drink.picture}`,
  });
}

const api = {
  async getLatestDrinks(size: number = 5) {
    try {
      const response = await fetch.get(
        `/drinks?size=${size}&page=0&sort=createdAt,desc`
      );
      
      return response.data.content.map(toFullPictureURI);
    } catch (exception) {
      throw new Error('Aconteceu um erro ao tentar conectar no servidor.');
    }
  },

  async findDrinkByUUID(uuid?: string) {
    if (!uuid) {
      throw new Error('Passe um UUID para a pesquisa!');
    }

    try {
      const response = await fetch.get(`/drinks/${uuid}`);

      return toFullPictureURI(response.data);
    } catch (exception: any) {
      const details = exception?.response?.data?.details || 'Aconteceu um erro ao tentar conectar no servidor.';
      throw new Error(details);
    }
  }
};

export default api;
