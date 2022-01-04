import qs from "query-string";

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

type Table = {
  uuid: string;
};

type RequestToCreate = {
  drinks: DrinkType[];
  table?: Table;
};

type StatusType = "PROCESSING" | "FINISHED" | "CANCELED";

type RequestSearchParams = {
  status?: StatusType;
  drinkName?: string;
  drinkDescription?: string;
  createdAt?: string;
  createdInDateOrAfter?: string;
  createdInDateOrBefore?: string;
  price?: number;
  lessThanOrEqualToTotalPrice?: number;
  greaterThanOrEqualToTotalPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
};

const requestsEndpoints = {
  async createRequest(request: RequestToCreate) {
    const { data } = await api.post("/requests/user", request);
    return data;
  },

  async findRequestByUUID(uuid: string) {
    const { data } = await api.get(`/requests/${uuid}`);
    return data;
  },

  async searchRequests(
    params: RequestSearchParams = {} as RequestSearchParams
  ) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(`/requests/staff/search?${searchParams}`);

    return data;
  },

  async getMyRequests(params: RequestSearchParams = {} as RequestSearchParams) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(
      `/requests/user/my-requests?${searchParams}`
    );

    return data;
  },

  async getProcessingRequests(page = 0, size = 10) {
    return this.searchRequests({
      status: "PROCESSING",
      sort: "createdAt",
      page,
      size,
    });
  },

  async cancelRequest(uuid: string) {
    await api.patch(`/requests/all/cancel/${uuid}`);
  },

  async finishRequest(uuid: string) {
    await api.patch(`/requests/staff/finish/${uuid}`);
  },

  async deliverRequest(uuid: string) {
    await api.patch(`/requests/staff/deliver/${uuid}`);
  },
};

export default requestsEndpoints;
