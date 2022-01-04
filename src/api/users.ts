import qs from "query-string";

import { LoginError } from "src/errors/LoginError";

import { api } from "./api";

type UserToCreate = {
  name: string;
  email: string;
  password: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type UserToUpdate = {
  uuid: string;
  name: string;
  email: string;
  password: string;
  newPassword?: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type UserSearchParams = {
  name?: string;
  role?: string;
  birthDay?: string;
  page?: number;
  size?: number;
};

const usersEndpoints = {
  async login(email: string, password: string) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      return response.headers.authorization;
    } catch (exception: any) {
      const status = exception?.response?.data?.status || 0;

      if (status === 401) {
        throw new LoginError("Login ou senha incorretos!");
      }

      throw new Error("Aconteceu um erro ao tentar conectar no servidor");
    }
  },

  async createUser(user: UserToCreate) {
    const { data } = await api.post("/users/admin", user);
    return data;
  },

  async searchUser(params: UserSearchParams) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(`/users/admin/search?${searchParams}`);

    return {
      totalElements: data.totalElements,
      content: data.content,
    };
  },

  async findUserByUUID(uuid: string) {
    const { data } = await api.get(`/users/all/${uuid}`);
    return data;
  },

  async findUserByEmail(email: string) {
    const { data } = await api.get(`/users/admin/find-by-email/${email}`);
    return data;
  },

  async findUserByCPF(cpf: string) {
    const { data } = await api.get(`/users/admin/find-by-cpf/${cpf}`);
    return data;
  },

  async getUserInfo() {
    const { data } = await api.get("/users/all/user-info");
    return data;
  },

  async replaceUser(drink: UserToUpdate) {
    await this.login(drink.email, drink.password);

    const { newPassword, ...drinkToUpdate } = {
      ...drink,
      password: drink.newPassword || drink.password,
    };

    await api.put("/users/user", drinkToUpdate);
  },

  async deleteUser(uuid: string) {
    await api.delete(`/users/user/${uuid}`);
  },
};

export default usersEndpoints;
