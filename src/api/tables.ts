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

const tablesEndpoints = {
  async searchTables(params: string, size = 10) {
    try {
      const { data } = await api.get(
        `/tables/waiter/search?size=${size}&${params}`
      );
      return data;
    } catch (e: any) {
      throw new Error("Aconteceu um erro ao tentar pesquisar as mesas!");
    }
  },

  async toggleTableOccupied(uuid: string) {
    try {
      const { data } = await api.patch(
        `/tables/waiter/switch-occupied/${uuid}`
      );
      return data;
    } catch (e: any) {
      throw new Error(
        "Aconteceu um erro ao tentar inverter a ocupação da mesa!"
      );
    }
  },

  async createTable(table: TableToCreate) {
    try {
      const { data } = await api.post("/tables/waiter/", table);
      return data;
    } catch (e: any) {
      throw new Error(
        "Aconteceu um erro ao tentar criar mesa!"
      );
    }
  },

  async updateTable(table: TableToUpdate) {
    try {
      await api.put("/tables/waiter/", table);
    } catch (e: any) {
      throw new Error(
        "Aconteceu um erro ao tentar atualizar mesa!"
      );
    }
  },

  async deleteTable(uuid: string) {
    try {
      await api.delete(`/tables/waiter/${uuid}`);
    } catch (e: any) {
      throw new Error(
        "Aconteceu um erro ao tentar remover mesa!"
      );
    }
  },
};

export default tablesEndpoints;
