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

  async getMyRequests(params: string, size: number = 10) {
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

  async searchRequests(params: string, size: number = 10) {
    try {
      const { data } = await api.get(
        `/requests/staff/search?size=${size}&${params}`
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
      await api.patch(`/requests/all/cancel/${uuid}`);
    } catch (e: any) {
      const details =
        e?.response?.data?.details ||
        "Aconteceu um erro ao tentar cancelar o pedido.";
      throw new Error(details);
    }
  },

  async finishRequest(uuid: string) {
    try {
      await api.patch(`/requests/staff/finish/${uuid}`);
    } catch (e: any) {
      const details =
        e?.response?.data?.details ||
        "Aconteceu um erro ao tentar finalizar o pedido.";
      throw new Error(details);
    }
  },

  async getProcessingRequests(page = 0, size = 10) {
    return this.searchRequests(`page=${page}&status=PROCESSING&sort=createdAt`, size)
  },
};

export default requestsEndpoints;
