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

export const api = axios.create({
  baseURL,
});

function toFullPictureURI(drink: DrinkType) {
  return {
    ...drink,
    picture: `${baseURL}/files/images/${drink.picture}`,
  };
}

const endpoints = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });
  
      return response.headers.authorization;
    } catch (exception: any) {
      const status = exception?.response?.data?.status || 0;

      if (status === 401) {
        throw new Error("Login ou senha incorretos!");
      }

      throw new Error("Aconteceu um erro ao tentar conectar no servidor.");
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
};

export default endpoints;
