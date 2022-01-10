import qs from "query-string";

import { api } from "./api";

type TableToCreate = {
  seats: number;
  number: number;
};

type TableToUpdate = {
  uuid: string;
  seats: number;
  number: number;
};

type TableSearchParams = {
  greaterThanOrEqualToSeats?: number;
  lessThanOrEqualToSeats?: number;
  occupied?: number;
  page?: number;
  size?: number;
};

const tablesEndpoints = {
  async createTable(table: TableToCreate) {
    const { data } = await api.post("/tables/waiter/", table);

    return data;
  },

  async getAllTables(size = 100) {
    const { data } = await api.get(`/tables/all?size=${size}&sort=number`);

    return data;
  },

  async searchTables(params: TableSearchParams) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(`/tables/waiter/search?${searchParams}`);

    return data;
  },

  async updateTable(table: TableToUpdate) {
    await api.put("/tables/waiter/", table);
  },

  async toggleTableOccupied(uuid: string) {
    const { data } = await api.patch(`/tables/waiter/switch-occupied/${uuid}`);

    return data;
  },

  async deleteTable(uuid: string) {
    await api.delete(`/tables/waiter/${uuid}`);
  },
};

export default tablesEndpoints;
