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
    } catch (e: any) {
      const details =
        e?.response?.data?.details ||
        "Aconteceu um erro ao tentar finalizar o pedido.";

      throw new Error(details);
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

  async getMyRequests(params: string, size: number = 6) {
    try {
      const { data } = await api.get(
        `/requests/user/my-requests?size=${size}&${params}&sort=updatedAt,desc`
      );
      return data;
    } catch (e: any) {
      const details =
        e?.response?.data?.details ||
        "Aconteceu um erro ao tentar conectar no servidor.";
      throw new Error(details);
    }
  },

  async cancelRequest(uuid: string) {
    try {
      await api.patch(`/requests/cancel/all/${uuid}`);
    } catch (e: any) {
      const details =
        e?.response?.data?.details ||
        "Aconteceu um erro ao tentar conectar no servidor.";
      throw new Error(details);
    }
  },
};

export default requestsEndpoints;
