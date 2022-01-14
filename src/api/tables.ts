import qs from "query-string";
import { TablePaginetedType, TableSearchParams, TableToCreate, TableToUpdate, TableType } from "src/types/tables";

import { api } from "./api";

const tablesEndpoints = {
  async createTable(table: TableToCreate): Promise<TableType> {
    const { data } = await api.post<TableType>("/tables/waiter/", table);

    return data;
  },

  async getAllTables(size = 100): Promise<TablePaginetedType> {
    const { data } = await api.get<TablePaginetedType>(`/tables/all?size=${size}&sort=number`);
    return data;
  },

  async searchTables(params: TableSearchParams): Promise<TablePaginetedType> {
    const searchParams = qs.stringify(params);

    const { data } = await api.get<TablePaginetedType>(`/tables/waiter/search?${searchParams}`);

    return data;
  },

  async updateTable(table: TableToUpdate): Promise<void> {
    await api.put("/tables/waiter/", table);
  },

  async toggleTableOccupied(uuid: string): Promise<TableType> {
    const { data } = await api.patch<TableType>(`/tables/waiter/switch-occupied/${uuid}`);

    return data;
  },

  async deleteTable(uuid: string): Promise<void> {
    await api.delete(`/tables/waiter/${uuid}`);
  },
};

export default tablesEndpoints;
