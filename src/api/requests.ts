import { api } from "./api";

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

type Table = {};

type RequestToCreate = {
  drinks: DrinkType[];
  table?: Table;
};

const requestsEndpoints = {
  async createRequest(request: RequestToCreate) {
    try {
      const { data } = await api.post("/requests/user", request);
      return data;
    } catch (e) {
      throw e;
    }
  },

  async findRequestByUUID(uuid: string) {
    try {
      const { data } = await api.get(`/requests/${uuid}`);
      return data;
    } catch (e: any) {
      const details =
        e?.response?.data?.details ||
        "Aconteceu um erro ao tentar conectar no servidor.";
      throw new Error(details);
    }
  },
};

export default requestsEndpoints;
